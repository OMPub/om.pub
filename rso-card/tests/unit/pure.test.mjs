// Executing unit tests for the card's PURE logic — these RUN the real functions with real inputs and
// assert real outputs (unlike the string-pin contract tests, which only check that source text exists).
//
// The functions live inside one big module IIFE and aren't exported, so we extract each function's source
// by brace-matching from index.html and evaluate it in a tiny sandbox with its few free dependencies stubbed
// (nextTask, state, a couple globals). This tests behaviour without shipping any module structure — the
// mint artifact stays a single self-contained file. If a signature changes, extraction fails loudly.
//
// Run: node --test rso-card/tests/unit/     (or via pytest test_pure_units.py)

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CARD = path.resolve(HERE, "../../../web/public/rso/live/index.html");
const html = readFileSync(CARD, "utf8");
const MOD = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];

// A JS-aware brace matcher: skips line/block comments, '..' ".." strings, `..` templates (with ${}
// nesting) and /regex/ literals, so their braces don't throw off the depth count.
function skipString(s, i, q) { for (i++; i < s.length; i++) { if (s[i] === "\\") i++; else if (s[i] === q) return i; } return i; }
function skipRegex(s, i) { for (i++; i < s.length; i++) { if (s[i] === "\\") i++; else if (s[i] === "[") { for (i++; i < s.length && s[i] !== "]"; i++) if (s[i] === "\\") i++; } else if (s[i] === "/") return i; } return i; }
function skipTemplate(s, i) {
  for (i++; i < s.length; i++) {
    if (s[i] === "\\") i++;
    else if (s[i] === "`") return i;
    else if (s[i] === "$" && s[i + 1] === "{") { i = matchBraces(s, i + 1); }   // ${ expr } — may nest
  }
  return i;
}
// Returns the index of the `}` matching the `{` at position `open`.
function matchBraces(s, open) {
  let depth = 0, prev = "";
  for (let i = open; i < s.length; i++) {
    const c = s[i];
    if (c === "/" && s[i + 1] === "/") { i = s.indexOf("\n", i); if (i < 0) return s.length; continue; }
    if (c === "/" && s[i + 1] === "*") { i = s.indexOf("*/", i + 2) + 1; continue; }
    if (c === '"' || c === "'") { i = skipString(s, i, c); prev = c; continue; }
    if (c === "`") { i = skipTemplate(s, i); prev = c; continue; }
    if (c === "/" && (prev === "" || "(,=:[!&|?{};+-*%^~<>".includes(prev))) { i = skipRegex(s, i); prev = "/"; continue; }
    if (c === "{") depth++;
    else if (c === "}") { if (--depth === 0) return i; }
    if (!/\s/.test(c)) prev = c;
  }
  return s.length;
}
function fnSource(name) {
  const re = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`, "g");
  const m = re.exec(MOD);
  if (!m) throw new Error(`function ${name} not found — extraction is stale`);
  const open = MOD.indexOf("{", m.index);
  const end = matchBraces(MOD, open);
  if (end >= MOD.length) throw new Error(`could not brace-match ${name}`);
  return MOD.slice(m.index, end + 1);
}

// Evaluate the given function sources together with a stub preamble; return the named functions.
function load(names, preamble = "") {
  const src = preamble + "\n" + names.map(fnSource).join("\n") + "\n" +
    "return {" + names.join(",") + "};";
  return new Function(src)();   // eslint-disable-line no-new-func
}

const STUBS = `
  const nextTask = () => Promise.resolve();
  const state = { loadToken: 0 };
`;

test("isPrivateHost: loopback/RFC-1918/ULA yes; public + fc/fd DNS names no", () => {
  const { isPrivateHost } = load(["isPrivateHost"]);
  for (const h of ["localhost", "127.0.0.1", "10.1.2.3", "192.168.1.50", "172.16.0.1",
                   "172.31.255.1", "169.254.1.1", "box.local", "::1",
                   "fe80::1", "fd00::1", "fc00::abcd"]) {
    assert.equal(isPrivateHost(h), true, `${h} should be private`);
  }
  for (const h of ["example.com", "raw.githubusercontent.com", "8.8.8.8", "172.32.0.1", "172.15.0.1",
                   "fcdn.attacker.com", "fd-cache.evil.net", "fccorp.io", "fdisk.example.org"]) {
    assert.equal(isPrivateHost(h), false, `${h} must NOT be treated as private`);
  }
});

test("rowsOf: bare array, {data:[...]} wrapper, object-keyed → entries, junk", () => {
  const { rowsOf } = load(["rowsOf"]);
  assert.deepEqual(rowsOf([1, 2, 3]), { list: [1, 2, 3], shape: "rows" });
  assert.deepEqual(rowsOf({ data: [{ a: 1 }] }), { list: [{ a: 1 }], shape: "rows" });
  const keyed = rowsOf({ "25544": { name: "ISS" }, "25545": { name: "X" } });
  assert.equal(keyed.shape, "entries");
  assert.equal(keyed.list.length, 2);
  assert.equal(keyed.list[0][0], "25544");
  assert.deepEqual(rowsOf(null), { list: [], shape: "rows" });
  assert.deepEqual(rowsOf({ data: "nope" }), { list: [], shape: "rows" });
});

test("parseJsonNonBlocking: byte-identical to JSON.parse across tricky payloads", async () => {
  const { parseJsonNonBlocking } = load(["parseJsonNonBlocking", "rowsOf"], STUBS);
  const enc = new TextEncoder();
  const big = Array.from({ length: 30000 }, (_, i) =>
    ({ NORAD_CAT_ID: String(i), OBJECT_NAME: `OBJ-${i},{["x"]}\\`, MEAN_MOTION: 15.5 + i * 1e-6,
       ECCENTRICITY: 0.0001 * (i % 100), RA_OF_ASC_NODE: (i * 7.3) % 360, nested: { a: [1, 2, { b: "]}" }] } }));
  const cases = {
    "bare-array": JSON.stringify(big),
    "data-wrapper": JSON.stringify({ data: big.slice(0, 20000), extra: "suffix" }),
    "object-keyed": JSON.stringify(Object.fromEntries(big.slice(0, 5000).map(o => [o.NORAD_CAT_ID, o]))),
    "empty-array": "[]",
    "whitespace-wrapper": '  {  "data" :  [' + JSON.stringify(big[0]) + "]  }  ",
    "tricky-strings": JSON.stringify([{ s: 'comma, brace } bracket ] quote " backslash \\\\ end' }, { s: "日本語,]}" }]),
  };
  for (const [label, txt] of Object.entries(cases)) {
    const got = await parseJsonNonBlocking(enc.encode(txt));
    const cat = JSON.parse(txt);
    const want = Array.isArray(cat) ? cat : ("data" in cat ? cat.data : Object.entries(cat));
    assert.equal(got.list.length, want.length, `${label}: length`);
    assert.deepEqual(got.list[0] ?? null, want[0] ?? null, `${label}: first`);
    assert.deepEqual(got.list.at(-1) ?? null, want.at(-1) ?? null, `${label}: last`);
    // spot-check throughout
    for (let k = 0; k < Math.min(50, want.length); k++) {
      const idx = Math.floor(k * want.length / 50);
      assert.deepEqual(got.list[idx], want[idx], `${label}: row ${idx}`);
    }
  }
});

test("detectStacks: co-incident NORAD ids group under the lowest-id core; distinct orbits don't", async () => {
  const { detectStacks } = load(["detectStacks"], STUBS);
  // three modules sharing one exact state vector (a station) + two lone sats on other planes
  const station = (id, ma) => ({ id, reentered: false, inc: 51.64, raan: 120.5, ecc: 0.0004, mm: 15.5, ma });
  const objs = [
    station("25544", 10.0), station("25575", 10.0), station("49044", 10.0),   // ISS-like, identical state → group
    { id: "40000", reentered: false, inc: 53.0, raan: 300.0, ecc: 0.0001, mm: 15.06, ma: 200 },  // Starlink-ish loner
    { id: "40001", reentered: false, inc: 97.4, raan: 12.3, ecc: 0.001, mm: 14.9, ma: 88 },       // SSO loner
    { id: "99999", reentered: true, inc: 51.64, raan: 120.5, ecc: 0.0004, mm: 15.5, ma: 10.0 },   // decayed → excluded even if coincident
  ];
  await detectStacks(objs, null);
  const core = objs.find(o => o.id === "25544");
  assert.ok(core.dockGroup, "coincident station modules should form a dock group");
  assert.equal(core.dockPrimary, "25544", "primary is the lowest NORAD id");
  assert.equal(core.dockGroup.length, 3, "all three modules in the group");
  // ungrouped objects are left as-is (falsy dockPrimary/dockGroup — fresh objects start undefined)
  assert.ok(!objs.find(o => o.id === "40000").dockPrimary, "a lone sat is never grouped");
  assert.ok(!objs.find(o => o.id === "40001").dockGroup, "distinct-plane sat is never grouped");
  assert.ok(!objs.find(o => o.id === "99999").dockPrimary, "a decayed object is excluded from stacking");
});

test("decodeSeed: hand vectors, malformed inputs, and the sealed production seed", () => {
  const { decodeSeed } = load(["decodeSeed"]);
  // hand vector: base36 absolute + delta + zero-delta ("2s" = 100)
  const v = decodeSeed("1|19590111*3|2s,1,0");
  assert.deepEqual(v.days, ["1959-01-11", "1959-01-12", "1959-01-13"]);
  assert.deepEqual(v.counts, [100, 101, 101]);
  // run break + repeat marker + negative delta
  const w = decodeSeed("1|19590111*2,19590115*3|5,0.2,-2,1");
  assert.deepEqual(w.days, ["1959-01-11", "1959-01-12", "1959-01-15", "1959-01-16", "1959-01-17"]);
  assert.deepEqual(w.counts, [5, 5, 5, 3, 4]);
  // malformed → null, never a throw (the offline boot must survive a bad splice)
  for (const bad of ["", "2|x|y", "1|nope|1", "1|19590111*2|1", "1||1", "1|19590111*2|"]) {
    assert.equal(decodeSeed(bad), null, `must reject: ${JSON.stringify(bad)}`);
  }
  // the SEALED seed itself: decodes, coherent, and matches frozen historical facts
  const m = MOD.match(/\/\*__RSO_SEED__\*\/"([^"]*)"\/\*__RSO_SEED_END__\*\//);
  assert.ok(m && m[1].length > 10000, "production seed must be sealed into the file");
  const s = decodeSeed(m[1]);
  assert.ok(s, "sealed seed must decode");
  assert.equal(s.days.length, s.counts.length, "one count per day");
  assert.ok(s.days.length >= 25000, `full archive expected, got ${s.days.length}`);
  assert.equal(s.days[0], "1957-10-04", "genesis day is Sputnik 1's");
  assert.equal(s.counts[0], 1, "one object on genesis day");
  assert.equal(s.counts[s.days.indexOf("1969-04-20")], 3286, "frozen deep-history count");
  assert.ok(s.days[s.days.length - 1] >= "2026-07-03", "seed reaches the seal date");
  for (let i = 1; i < s.days.length; i++) {
    if (!(s.days[i] > s.days[i - 1])) assert.fail(`days not strictly ascending at ${i}`);
  }
  assert.ok(s.counts.every((c) => Number.isInteger(c) && c > 0), "all counts positive integers");
});

test("detectStacks: token supersession bails without throwing", async () => {
  const { detectStacks } = load(["detectStacks"],
    "const nextTask = () => Promise.resolve(); const state = { loadToken: 7 };");
  const objs = Array.from({ length: 25000 }, (_, i) =>
    ({ id: String(i), reentered: false, inc: 50 + (i % 40), raan: i % 360, ecc: 0.001, mm: 15 + (i % 3) * 0.001, ma: i % 360 }));
  // token 1 != state.loadToken 7 → should return early on the first yield, no throw
  await assert.doesNotReject(() => detectStacks(objs, 1));
});
