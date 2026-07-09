"""Contract tests for the archive card viewer (web/public/rso/live/index.html).

The card is developed in this repo (om.pub): the source of truth is the served
file at web/public/rso/live/index.html, with its dev kit (nft-preview.html,
serve.py, vendored three.js) co-located beside it. These tests pin the contracts
between the viewer and the rest of the RSO pipeline so a change on either side
fails loudly:

- the viewer stays self-contained (vendored three.js, one inline module);
- it only fetches bundle mirrors a browser can actually read (Arweave + raw
  node-branch files — never GitHub release assets, whose redirect target sends
  no CORS headers);
- the generated attestation index keeps the shape the viewer parses;
- the witness gate defaults stay coherent between markup and script.

The attestation-index contract is checked against a frozen fixture
(tests/fixtures/rso-docchain-index.json), a snapshot of the RSO indexer output;
refresh it from the RSO repo when the index schema changes.
"""

import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]                       # om.pub repo root
CARD = ROOT / "web" / "public" / "rso" / "live" / "index.html"   # the card: source-of-truth and served file
INDEX = Path(__file__).resolve().parent / "fixtures" / "rso-docchain-index.json"  # frozen indexer snapshot


class CardArtifactTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = CARD.read_text(encoding="utf-8")

    def test_single_file_with_vendored_three(self):
        self.assertTrue(CARD.is_file())
        # DEV file: one app module; the vendored three.js files sit beside it for local iteration.
        self.assertEqual(self.html.count('<script type="module">'), 1, "one app module only")
        for vendored in ("three.module.js", "three.core.js"):
            self.assertTrue((CARD.parent / vendored).is_file(), vendored)
        # no CDN/runtime dependencies — the piece must outlive any host
        self.assertNotIn("cdn.jsdelivr.net", self.html)
        self.assertNotIn("unpkg.com", self.html)
        self.assertNotIn("esm.sh", self.html)

    def test_three_loads_dual_mode_inline_or_vendored(self):
        # loadThree() prefers INLINED three.js (the standalone mint artifact) and falls back to the
        # vendored files relative to the mount point (dev). Both code paths must be present.
        self.assertIn("function loadThree()", self.html)
        self.assertIn('document.getElementById("three-core-src")', self.html)
        self.assertIn('document.getElementById("three-module-src")', self.html)
        # inline path: blob-import the core, rewrite the module's ./three.core.js specifier to it
        self.assertIn("URL.createObjectURL(new Blob([coreEl.textContent]", self.html)
        self.assertIn(r"\.\/three\.core\.js\1/g, JSON.stringify(coreUrl)", self.html)
        self.assertIn("const THREE = await loadThree();", self.html)

    def test_mount_agnostic_module_resolution(self):
        # served at a slashless path (om.pub/rso/live, Arweave gateways) a bare
        # relative import would resolve against the parent directory (the dev fallback)
        self.assertIn('import(new URL("./three.module.js", MOUNT)', self.html)
        self.assertIn("const MOUNT = new URL(location.href)", self.html)
        self.assertIn('MOUNT.pathname += "/"', self.html)

    def test_standalone_build_is_self_contained(self):
        # the build step must produce ONE file with zero external CODE fetches (catalog DATA stays remote)
        build = CARD.parent / "build-standalone.py"
        self.assertTrue(build.is_file(), "build-standalone.py present")
        r = subprocess.run([sys.executable, str(build), "--check"], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("zero external code dependencies", r.stdout)

    def test_tap_selection_locks_the_object_at_press_not_release(self):
        # a small fast mover drifts out from under the cursor between press and release (+ the 260ms tap
        # timer), so the hit-test runs at pointerDOWN and locks the object by identity; the release just
        # commits that locked object. Re-tapping it or empty space closes the card; drags never select.
        self.assertIn("function pickAt(cx, cy)", self.html)
        self.assertIn("function commitPick(nid, idx)", self.html)
        self.assertNotIn("function inspectAt", self.html)                       # old up-coordinate path is gone
        # captured at press in BOTH the touch and mouse pointerdown paths
        self.assertIn("const pi = pickAt(e.clientX, e.clientY), pickNid = pi >= 0 ? (O[pi].meta?.id ?? null) : null;", self.html)
        self.assertIn("t: performance.now(), pickIdx: pi, pickNid });", self.html)   # touch record
        self.assertIn("t: performance.now(), pickIdx: pi, pickNid };", self.html)    # mouse record
        # the tap carries the locked pick through to the commit, which re-acquires by identity
        self.assertEqual(self.html.count("sceneTapAt(e.clientX, e.clientY, p.pickNid, p.pickIdx)"), 2)
        self.assertIn("commitPick(nid, idx)", self.html)
        self.assertIn("slotForNorad(nid) >= 0) ? slotForNorad(nid) : idx", self.html)

    def test_hyperspace_spin_is_distance_independent(self):
        # the roll is keyed to warp ALONE (capped), NOT overdrive — so a 50-year leap rolls no harder
        # than a 1-day nudge (it just travels faster). The old `(1 + state.over * 1.6)` amplifier is gone.
        self.assertIn("const spinTarget = Math.min(1, state.warp) * 0.11 * (state.timeDir >= 0 ? 1 : -1);", self.html)
        self.assertNotIn("state.warp * 0.11 * (1 + state.over * 1.6)", self.html)

    def test_idle_is_tab_visibility_not_user_input(self):
        # "Idle" is decided by TAB VISIBILITY, never by input: a FOREGROUND tab always renders at full rate
        # (just WATCHING the moving field must stay smooth), and a BACKGROUND tab parks the loop → ~0% CPU.
        # An input-gated frame-throttle was REMOVED — it dropped watching to 30fps and its stretched frame
        # interval fooled the work-stride governor into stepping the non-interpolated solids to ~1fps.
        self.assertNotIn("IDLE_FRAME_MS", self.html)
        self.assertNotIn("renderedAt", self.html)
        self.assertNotIn("const restless =", self.html)
        # the ONLY gate left is tab visibility: early-return when hidden + visibilitychange parks/restarts
        self.assertIn("if (document.hidden) return;", self.html)
        self.assertIn('document.addEventListener("visibilitychange",', self.html)
        self.assertIn("if (document.hidden) renderer.setAnimationLoop(null);", self.html)
        self.assertIn("else if (!state.suspended) { animate.last = performance.now(); renderer.setAnimationLoop(animate); }", self.html)

    def test_heavy_caches_and_metadata_maps_are_bounded(self):
        # left open for hours, scrubbing thousands of days must NOT grow the heap without limit. The heavy
        # per-day payloads (parsed catalog + gzip) are LRU-capped; the light aggregate maps get a hard horizon.
        self.assertIn("const CATALOG_CACHE_MAX = 6, CATALOG_GZ_MAX = 3;", self.html)
        self.assertIn("catalogCache.set(date, sampled); lruCap(catalogCache, CATALOG_CACHE_MAX); pruneMetadata();", self.html)
        self.assertIn("lruCap(catalogGzByDate, CATALOG_GZ_MAX)", self.html)
        self.assertIn("if (catalogCache.has(date)) return lruTouch(catalogCache, date);", self.html)
        self.assertIn("function pruneMetadata()", self.html)
        self.assertIn("bandCountsByDate, typeCountsByDate, orbitByDate, deltaByDate, annoByDate, integrityByDate, attestByDate", self.html)
        # the suspend path prunes them too
        self.assertIn("for (const date of catalogGzByDate.keys()) if (date !== current) catalogGzByDate.delete(date);\n      pruneMetadata();", self.html)

    def test_time_rewind_scales_with_days_scrubbed(self):
        # Scrubbing winds every orbit by a phase term proportional to the DAYS the cursor moved
        # (not the scroll speed) — so a 1-day flick gives a subtle wind and a week a clear rewind,
        # reversibly. Damped as warp (hyperspace) takes the big multi-year leaps.
        self.assertIn("const DAY_REWIND =", self.html)
        self.assertIn("const dCursor = state.cursor - (o.cursorAt == null ? state.cursor : o.cursorAt); o.cursorAt = state.cursor;", self.html)
        self.assertIn("+ dCursor * DAY_REWIND * o.wj * (1 - 0.6 * warpC)", self.html)

    def test_goto_panel_finds_objects_and_follows_them(self):
        # 'g' opens a finder mirrored opposite the lens legend; search the day's catalog by NORAD id
        # or name, default to the oldest survivors still on orbit, select to follow across the timeline.
        self.assertIn('id="goto-panel"', self.html)
        self.assertIn('id="goto-input"', self.html)
        self.assertIn('if (k === "g") { toggleGoto();', self.html)
        self.assertIn("function oldestStillUp(n)", self.html)
        self.assertIn("function gotoSearch(q)", self.html)
        # results are RANKED by relevance, not raw catalog order: exact id (0) < name-prefix (1) < word-boundary
        # (2) < mid-word (3) < id-substring (4) < country/type (5) — so "iss" floats ISS (ZARYA) above swISScube
        self.assertIn("if (qn && id === qn) score = 0;", self.html)
        self.assertIn("else if (ni === 0) score = 1;", self.html)
        self.assertIn("else if (ni > 0 && !ALNUM.test(name[ni - 1])) score = 2;", self.html)
        self.assertIn("scored.sort((a, b) => a[0] - b[0]", self.html)
        self.assertIn("o.launch && !o.reentered", self.html)            # oldest *still on orbit*
        self.assertIn("showInspector(idx);", self.html)                 # selecting follows it (sets followNorad)
        self.assertIn("refreshGotoIfOpen();", self.html)                # list refreshes when a new day loads
        # at most ten rows, with a subtle TOTAL-match count below the list
        self.assertIn("const GOTO_MAX = 10;", self.html)
        self.assertIn("gotoRows = all.slice(0, GOTO_MAX);", self.html)
        self.assertIn('id="goto-count"', self.html)
        self.assertIn("`showing ${GOTO_MAX} of ${all.length} matches`", self.html)
        # the finder REMEMBERS the last search and restores it (selected) on reopen
        self.assertIn("const q = (gotoLastQuery = $(\"goto-input\").value).trim();", self.html)
        self.assertIn("inp.value = gotoLastQuery;", self.html)
        self.assertIn("inp.focus(); inp.select();", self.html)
        # mirrored layout, but the input is anchored at a FIXED top (not centred) so it never moves as the list grows
        self.assertIn(".goto-panel { position: absolute; left: calc(var(--safe-left) + 18px); top: max(96px, 16vh);", self.html)

    def test_every_fetch_is_timeout_bounded(self):
        # a node that connects but never responds must not stall the fallback chain — every fetch is
        # wrapped with an AbortController timeout; no bare fetch( remains in the data path.
        self.assertIn("async function fetchTimed(url, opts)", self.html)
        self.assertIn("setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)", self.html)
        self.assertEqual(self.html.count("await fetch("), 1, "the only raw fetch is inside fetchTimed")
        self.assertEqual(self.html.count("await fetchTimed("), 3, "all 3 data-path fetches are timeout-bounded")
        # scrub physics are clamped so a hostile manifest with millions of fake dates can't explode navK
        self.assertIn("state.navK = Math.max(1, Math.min(800, TOTAL / 144));", self.html)

    def test_bundle_mirrors_are_browser_readable(self):
        # The index entry's catalog_url locator first (Arweave bundle tar when permanent, else the
        # node-branch catalog.json.gz), then any witness's signed Arweave mirrors, then the ranked
        # nodes' raw catalog.json.gz — and never the GitHub release asset (unreadable cross-origin).
        self.assertIn("led.raw.catalog_url", self.html)
        self.assertIn("catalog.json.gz`", self.html)
        self.assertNotIn("releases/download", self.html)
        self.assertNotIn("asset_url", self.html)

    def test_observation_plane_is_wired(self):
        self.assertIn("annotations.json", self.html)
        self.assertIn("digestAnnotations", self.html)
        self.assertIn('"Daily changes"', self.html)
        # Dense daily GP updates plus consequential events get distinct colours.
        for const in ("UPD_REENTRY", "UPD_DECAY", "UPD_NEW", "UPD_DYNAMIC", "UPD_META", "UPD_ORBIT"):
            self.assertIn(const, self.html)
        self.assertIn("fieldKind(c.field)", self.html)
        self.assertIn("changedObjects: changedIds.size", self.html)
        self.assertIn("const updatedIds = new Set((delta?.updated_norad_cat_ids", self.html)
        self.assertIn('change = annoSum?.tipIds.has(id) ? "reentry"', self.html)
        self.assertIn('annoSum?.decayIds.has(id) || status === "decayed" ? "decay"', self.html)
        self.assertIn("bstar >= 0.005 || mmDot >= 0.0025", self.html)
        self.assertIn('o.change === "decay" ? UPD_DECAY', self.html)
        self.assertIn("size = Math.max(size * 2.2, 11.0); aMul = 5.0", self.html)
        self.assertIn("GP-updated", self.html)

    def test_tip_reentry_predictions_surfaced(self):
        # Profile r3 added TIP (Tracking & Impact Prediction) reentry forecasts to the
        # observation plane — the headline of the data. digest consumes them, top priority.
        self.assertIn("anno.tip_messages", self.html)
        self.assertIn("tipIds", self.html)
        self.assertIn('note(id, "tip"', self.html)
        self.assertIn("reentry predicted", self.html)
        self.assertIn('change = annoSum?.tipIds.has(id) ? "reentry"', self.html)
        # the brightest beacon in the daily-changes lens + inspector warning + legend
        self.assertIn('o.change === "reentry" ? UPD_REENTRY', self.html)
        self.assertIn('o.anno && o.anno.kind === "tip"', self.html)
        self.assertIn('sw(UPD_REENTRY, "Reentry predicted")', self.html)

    def test_daily_change_colours_are_mutually_distinct(self):
        # Re-entry (incandescent white-hot) used to read as the same warm gold as the
        # high-drag swatch. Parse the constants and require real separation between every
        # event colour so a legend dot is never ambiguous.
        def rgb(name):
            m = re.search(name + r"\s*=\s*\[\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+)\s*\]", self.html)
            self.assertIsNotNone(m, name + " colour not found")
            return tuple(float(x) for x in m.groups())

        def dist(a, b):
            return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

        cols = {k: rgb("UPD_" + k.upper()) for k in ("reentry", "decay", "new", "dynamic", "meta", "orbit")}
        # the pair the user flagged: now clearly separated
        self.assertGreater(dist(cols["reentry"], cols["dynamic"]), 0.35)
        # re-entry reads incandescent — every channel near white
        self.assertGreater(min(cols["reentry"]), 0.8)
        # high-drag stays a warm amber, not white (mid channel well below white)
        self.assertLess(cols["dynamic"][1], 0.75)
        # no two event colours collide
        keys = list(cols)
        for i in range(len(keys)):
            for j in range(i + 1, len(keys)):
                self.assertGreater(dist(cols[keys[i]], cols[keys[j]]), 0.2,
                                   f"{keys[i]} and {keys[j]} swatches are too similar")

    def test_inspector_names_the_selected_change_category(self):
        # "Which one did I select?" — in the Daily-changes lens the inspector headline
        # names the object's change category and tints it to match its legend swatch.
        self.assertIn("const CHANGE_INFO = {", self.html)
        for kind in ("reentry", "decay", "new", "dynamic", "meta", "orbit"):
            self.assertRegex(self.html, kind + r":\s*\[")
        self.assertIn('reentry: ["Re-entry predicted", UPD_REENTRY]', self.html)
        self.assertIn("state.lens === 4 && o.change && CHANGE_INFO[o.change]", self.html)
        self.assertIn("labelEl.style.color = rgbStr(ci[1])", self.html)

    def test_witness_gate_defaults_are_coherent(self):
        # script default, persisted-settings fallback and slider markup must
        # agree: rank 0 = any sweeper-accepted witness counts
        self.assertRegex(self.html, r"ethRank:\s*0\b")
        self.assertRegex(self.html, r"s\.ethRank \?\? 0")
        slider = re.search(r'<input type="range" id="set-eth"[^>]*>', self.html)
        self.assertIsNotNone(slider)
        self.assertIn('value="0"', slider.group(0))

    def test_downloads_are_verified_on_device(self):
        # the ledger sha256 hashes the canonical catalog bytes — exactly what
        # the viewer holds after gunzip, so one digest proves the download is
        # the attested record
        self.assertIn('crypto.subtle.digest("SHA-256", bytes)', self.html)
        self.assertIn("verifyCatalogBytes(date, catBytes)", self.html)
        self.assertIn("hex === led.sha", self.html)
        self.assertIn("verified on this device", self.html)
        self.assertIn("DOES NOT MATCH DOWNLOAD", self.html)

    def test_attested_core_face_shows_consensus_hash(self):
        self.assertIn('id="fp-core"', self.html)
        self.assertIn("content_sha256", self.html)
        self.assertIn("content_schema", self.html)

    def test_contract_link_is_chain_aware(self):
        self.assertIn('id="fp-contract"', self.html)
        self.assertIn("sepolia.etherscan.io", self.html)
        self.assertIn("https://etherscan.io", self.html)
        # links inside a rotating prism must not also rotate it
        self.assertIn('closest("a")', self.html)

    def test_field_shows_whats_up_there(self):
        # re-entered objects keep their slot only as today's decay event or a
        # fresh observation; the long-gone never fly past the camera
        self.assertIn(
            '!o.reentered || o.status === "decayed" || o.anno', self.html
        )

    def test_per_type_silhouettes(self):
        # The machine silhouettes are the BatchedMesh solids (buildVigShape / bakeSolid);
        # the field SPRITES are honest round dots — the dead sprite-SDF pipeline is gone.
        self.assertIn("function bakeSolid(o)", self.html)
        self.assertIn("function buildVigShape(o)", self.html)
        for marker in ("payload: archetype-keyed, like the field",
                       "rocket body: a barrel, not a torpedo",
                       "debris: a faceted shard all its own"):
            self.assertIn(marker, self.html)
        # the sprite pipeline is collapsed to a round dot — no leftover aShape/vShape
        self.assertNotIn("aShape", self.html)
        self.assertNotIn("vShape", self.html)
        self.assertIn("Every field point is an honest round dot", self.html)

    def test_constellation_archetypes_are_name_keyed(self):
        # the famous constellations get their real silhouettes, in field and vignette alike
        self.assertIn("function payloadShape(", self.html)
        for marker in ('n.startsWith("STARLINK")', 'n.startsWith("ONEWEB")',
                       'n.includes("IRIDIUM")', "STARLINK v1 — flat bus + one LONG array, seeded sun-tracking fold",
                       "ONEWEB — box-wing", "IRIDIUM — wings + the big canted antenna",
                       "GEO comsat — long symmetric wings + dish"):
            self.assertIn(marker, self.html)

    def test_rcs_is_the_size_family(self):
        # radar cross-section dominates rendered size: tiers spaced 2.5x apart with
        # jitter too small to cross them, echoed in the vignette scale and meta line
        self.assertIn('rcs === "LARGE" ? 1.55 : rcs === "MEDIUM" ? 1.0 : rcs === "SMALL" ? 0.62', self.html)
        self.assertIn("0.92 + rand2(nid, 89) * 0.16", self.html)
        self.assertIn('rcs === "LARGE" ? 1.28', self.html)   # vignette presence
        self.assertIn('tip(m.rcs.toLowerCase(), "how big it looks on radar")', self.html)

    def test_band_clocks_and_persistent_selection(self):
        # each band returns on its own clean story clock: LEO 5 min, MEO 12, GEO 60
        self.assertIn("const LAP_BY_BAND = [300, 720, 3600]", self.html)
        self.assertIn("o.lapRate + warpFlow * o.wj", self.html)
        # MEO occupies the viewer-height encounter corridor instead of looming overhead.
        self.assertIn("1: { r0: 442, r1: 450", self.html)
        self.assertIn("if (band === 1) g *= 0.16", self.html)
        # the inspector has no auto-hide timer; tapping the same object toggles it closed
        self.assertNotIn("5200", self.html)
        self.assertIn("cur === state.selIdx", self.html)
        self.assertIn("hideInspector()", self.html)
        # selection: halo rides the chosen object; travel releases the halo but a followed
        # object keeps its card and re-acquires by NORAD on the next day (see ISS test)
        self.assertIn("RingGeometry", self.html)
        self.assertIn("state.selIdx = -1;                                                                // release the halo during the warp", self.html)
        self.assertIn("if (!state.followNorad) { $(\"inspector\").classList.remove(\"visible\"); vigHide(); }", self.html)

    def test_full_population_flies(self):
        # desktop flies EVERY on-orbit object — buffers at the ceiling, draw range live
        self.assertIn("const MAXF = mobile ? 9000 : 36000", self.html)
        self.assertIn("pointGeo.setDrawRange(0, FIELD_N)", self.html)
        self.assertIn("sampleByBand(objs, MAXF)", self.html)

    def test_tier2_solids_and_tooltips(self):
        # physically readable objects fly as real lit solids; everything smaller is a
        # round point. The pool covers every readable solid, and the model stage lives
        # INSIDE the inspector, left of the text.
        self.assertIn("const MESH_POOL = mobile ? 420 : 1800", self.html)
        self.assertIn("const MESH_PX_IN = 3.0, MESH_PX_OUT = 1.6", self.html)
        self.assertIn("const SOLID_EDGE_PAD = 1.8", self.html)
        self.assertIn("solidPx > (o.solid ? MESH_PX_OUT : MESH_PX_IN)", self.html)
        self.assertIn("0.52 * o.baseSize * solidFocalPx", self.html)
        self.assertIn("Math.max(camera.near, -vz)", self.html)
        self.assertIn("o.solid ? SOLID_EDGE_PAD * solidPx / innerWidth : 0", self.html)
        self.assertIn("o.solid ? SOLID_EDGE_PAD * solidPx / innerHeight : 0", self.html)
        self.assertIn("b.px - a.px", self.html)
        self.assertIn("builds >= 1", self.html)
        self.assertIn("meshCandidates[n] || (meshCandidates[n] = {})", self.html)
        self.assertNotIn("dist < MESH_DIST", self.html)
        # one draw call for the whole solid fleet: BatchedMesh with permanent reserved
        # slots rewritten in place (r180 never reuses freed ranges — churn would
        # exhaust the buffer)
        self.assertIn("new THREE.BatchedMesh(", self.html)
        self.assertIn("batch.setGeometryAt(free.bid, geo)", self.html)
        self.assertIn("s.bid = batch.addGeometry(ph, RES_V, RES_I)", self.html)
        # Lens changes tint solid instances too, while neutral baked panel shades
        # preserve the generated shape without rebuilding geometry.
        self.assertIn("batch.setColorAt(s.iid, _batchColor)", self.html)
        self.assertIn("m.material.userData.dim", self.html)
        # Explicit projected-screen admission replaces both duplicate BatchedMesh
        # culling passes.
        self.assertIn("batch.frustumCulled = false", self.html)
        self.assertIn("batch.perObjectFrustumCulled = false", self.html)
        # every sprite is an honest round dot; machine silhouettes are the solids only
        self.assertIn("Every field point is an honest round dot", self.html)
        self.assertNotIn("aShape", self.html)
        self.assertNotIn("pShape", self.html)
        self.assertIn('id="insp-stage"', self.html)
        self.assertIn("how high it orbits — ${BAND_FULL[m?.band ?? o.dataBand ?? o.band]}", self.html)
        # one sun for the field and a dawn-bright arc on the sunward limb
        self.assertIn("const SUN = new THREE.Vector3", self.html)
        self.assertIn("dawn", self.html)
        # Starlink generations split by NORAD id; arrays articulate per-sat
        self.assertIn(">= 55000 ? 10 : 4", self.html)
        self.assertIn("STARLINK v2 mini — bus amidships, TWO arrays", self.html)
        self.assertIn("updateMeshPool(meshCandidates, refreshMeshes)", self.html)
        self.assertIn("setSolidMatrix(free)", self.html)
        self.assertIn("_quat.identity()", self.html)
        self.assertIn("state.objects.length && t >= HUMP_T && state.warpBlend <= 0.25", self.html)
        self.assertIn("meshCandidates.length = 0", self.html)
        self.assertIn("pAlpha[i] *= 0.62", self.html)
        self.assertIn("workStride: mobile ? 2 : 2", self.html)
        self.assertIn("const MAX_WORK_STRIDE = mobile ? 12 : 24", self.html)
        self.assertIn("for (let i = start; i < end; i++)", self.html)
        self.assertIn("attr.addUpdateRange(first * attr.itemSize, count * attr.itemSize)", self.html)
        self.assertIn("aUpdated", self.html)
        self.assertIn("aStep", self.html)
        # inspector values are bare, each explained by an instant hover/tap tooltip
        # (data-tip); aria-label keeps it for screen readers, no slow native title box
        self.assertIn('`<span tabindex="0" aria-label="${esc(txt)} — ${esc(why)}" data-tip="${esc(why)}">', self.html)

    def test_generative_identity_is_norad_seeded_and_guarded(self):
        # identity seeds key to the NORAD id → same silhouette everywhere, forever
        self.assertIn("rand2(nid, 71)", self.html)
        self.assertIn('pointGeo.setAttribute("aSeed"', self.html)
        # the previous-position attribute feeds the strided dead-reckoning interpolation,
        # guarded against a zero step
        self.assertIn('pointGeo.setAttribute("aPrev"', self.html)
        self.assertIn("vec3 displayPos = mix(aPrev, position, blend);", self.html)
        self.assertIn("clamp((uTime - aUpdated) / max(0.008, aStep), 0.0, 1.0)", self.html)
        self.assertIn("innerWidth / innerHeight, 0.015, 2000", self.html)
        # real elements drive placement: RAAN spreads the planes, inclination tilts
        # the family, eccentricity breathes the radius
        self.assertIn("Number(row.INCLINATION)", self.html)
        self.assertIn("Number(row.RA_OF_ASC_NODE)", self.html)
        self.assertIn("o.eccV", self.html)
        # taps prefer the near object over a pixel-perfect far speck
        self.assertIn("camera distance is the primary key", self.html)

    def test_inspector_vignette_shares_context_and_seeds(self):
        self.assertIn("buildVigShape", self.html)
        self.assertIn("setScissorTest(true)", self.html)
        self.assertNotIn("new THREE.WebGLRenderer({ canvas: ", self.html.replace(
            'new THREE.WebGLRenderer({ canvas, antialias', ""))  # exactly one renderer/context
        self.assertIn("geometry.dispose()", self.html)

    def test_overdrive_respects_reduced_motion(self):
        self.assertIn("__HOLD_OVER__", self.html)
        self.assertRegex(self.html, r"reduced \? 0\s*:\s*smooth\(")

    def test_deep_hyperspace_is_one_gated_fullscreen_shader(self):
        self.assertIn("const deepMat = new THREE.ShaderMaterial", self.html)
        self.assertIn("new THREE.PlaneGeometry(2, 2)", self.html)
        self.assertIn("deepSpace.renderOrder = -1000", self.html)
        self.assertIn("deepSpace.visible = false", self.html)
        self.assertIn("deepSpace.visible = deepReveal > 0.006", self.html)
        self.assertIn("const deepReveal = smooth(0.48, 0.94, state.over)", self.html)
        self.assertIn("(1 - deepC * 0.99)", self.html)
        self.assertIn("(1 - deepC * 0.96)", self.html)
        self.assertIn("float turn = t * 1.00 * uDir", self.html)
        self.assertIn("p = mat2(cos(turn), -sin(turn), sin(turn), cos(turn)) * p", self.html)
        self.assertIn("p *= 1.0 + 0.055 * sin", self.html)
        self.assertIn("uniform vec2 uCenter", self.html)
        self.assertIn("deepAxis.set(CAM.x, CAM.y, camera.position.z - CORRIDOR).project(camera)", self.html)
        self.assertIn("deepMat.uniforms.uCenter.value.set", self.html)

    def test_permanence_reads_signed_publication_locations(self):
        # each witness signs its publication locations into its attestation; the
        # card counts distinct Arweave locators as independent permanent copies
        self.assertIn('id="witness-perm"', self.html)
        self.assertIn("independent permanent copies", self.html)
        self.assertIn('"arweave.net", "arweave.dev"', self.html)   # gateways in the locator host allowlist
        # declared locations also serve as verified download mirrors (host-allowlisted before fetch)
        self.assertIn("(attestByDate.get(date) || {}).ar", self.html)
        # Public witness is itself a four-face prism, including the four requested
        # views of the day's witness state.
        self.assertIn('id="prism-witness"', self.html)
        for field in ("witness-state", "witness-nodes", "witness-attestations",
                      "witness-sources"):
            self.assertIn(f'id="{field}"', self.html)
        self.assertIn('setupPrism("prism-witness", "Public witness")', self.html)

    def test_embed_readiness(self):
        # fullscreen never promises what a sandboxed host forbids
        self.assertIn('id="fullscreen-btn"', self.html)
        self.assertIn("document.fullscreenEnabled", self.html)
        # motion sensors are probed via permissions policy → no console violations
        self.assertIn('allowsFeature("accelerometer")', self.html)
        # responsive HUD: compact + whisper breakpoints exist
        self.assertIn("@media (max-width: 640px), (max-height: 540px)", self.html)
        self.assertIn("@media (max-width: 420px), (max-height: 380px)", self.html)
        # boot beacon for embedding hosts
        self.assertIn('parent.postMessage({ rso: "ready"', self.html)
        # the embed test kit ships with the card
        self.assertTrue((CARD.parent / "nft-preview.html").is_file())
        self.assertTrue((CARD.parent / "serve.py").is_file())

    def test_keyboard_controls_and_nearest_visible_selection(self):
        for binding in (
            'k === "z"', 'e.code === "KeyP"', 'k === "h"', 'k === "f"', 'k === "r"',
            'k === ","', 'k === "/" || k === "?"', 'k === "enter"', 'k === "i"',
            'e.code === "Backquote"',
        ):
            self.assertIn(binding, self.html)
        self.assertIn("function resetDefaultView()", self.html)
        self.assertIn("function inspectClosestVisible()", self.html)
        self.assertIn("if (viewZ >= -camera.near) continue", self.html)
        self.assertIn("nearestCycle = closest.slice(0, 6)", self.html)
        self.assertIn("(nearestCyclePos + 1) % nearestCycle.length", self.html)
        # Escape returns the complete visual state, including lens and prism faces.
        self.assertIn("state.lens = 0", self.html)
        self.assertIn("resetPrisms()", self.html)
        # Keyboard steering turns the ship, rather than dragging the scene.
        self.assertIn('ks.has("arrowleft") || ks.has("a")) state.yawT += step', self.html)
        self.assertIn('ks.has("arrowright") || ks.has("d")) state.yawT -= step', self.html)

    def test_long_term_timeline_navigation_uses_witnessed_dates(self):
        # The ledger's actual ordered entries, including gaps and historical backfills,
        # are the timeline. No built-in genesis/latest date limits the card.
        self.assertIn("let witnessDates = [todayIso]", self.html)
        self.assertIn("witnessDates = ordered.map((e) => e.date)", self.html)
        self.assertIn("TOTAL = witnessDates.length - 1", self.html)
        self.assertNotIn('genesis: "2026-', self.html)
        self.assertNotIn('latest: "2026-', self.html)
        self.assertIn("function nearestWitnessIndex(date)", self.html)
        self.assertIn("function moveTimelineCalendar(", self.html)
        self.assertIn("function jumpTimelineDigit(k)", self.html)
        self.assertIn('k === "0" ? TOTAL : k === "1" ? 0', self.html)
        for marker in (
            'moveTimelineCalendar({ days: -1 })', 'moveTimelineCalendar({ days: 7 })',
            'moveTimelineCalendar({ months: -1 })', 'moveTimelineCalendar({ months: 1 })',
            'moveTimelineCalendar({ years: -1 })', 'moveTimelineCalendar({ years: 1 })',
            'moveTimelineCalendar({ years: -10 })', 'moveTimelineCalendar({ years: 10 })',  # PgUp/PgDn decade
        ):
            self.assertIn(marker, self.html)

    def test_keyjump_slew_scales_with_archive_length(self):
        # navK scales ONLY the key-jump slew (number keys / arrows): a cross-archive leap lands in ~2.5s of
        # cinematic flight at any length (==1 for short timelines, so no regression). The wheel uses an
        # absolute day-rate and the timebar is instant — neither scales with the archive.
        self.assertIn("function rescaleNav()", self.html)
        # clamped at the top so a hostile manifest with millions of fake dates can't blow up the physics
        self.assertIn("state.navK = Math.max(1, Math.min(800, TOTAL / 144));", self.html)
        self.assertIn("state.maxSpeed = (reduced ? 18 : 60) * state.navK;", self.html)
        # the brake (accel) must out-pace the decel slope (>= 8·maxSpeed) or the flight overshoots and oscillates
        self.assertIn("state.accel = 640 * state.navK;", self.html)
        self.assertIn("rescaleNav();", self.html)
        # hard guard: the slew never steps PAST the target in one frame (no overshoot → no oscillation, and no
        # re-crossing days near the destination that re-fired per-day densify / year-chunk loads).
        self.assertIn("state.cursor += Math.abs(move) >= ad ? dist : move;", self.html)

    def test_wheel_is_capped_day_rate_no_year_accel(self):
        # The wheel runs through time DAY by day at a capped rate — it can NEVER accelerate into year jumps
        # (leap with the timebar drag or the number keys). Each event adds a bounded impulse to a day-velocity
        # capped at SCROLL_MAX_DPS; friction lands it ~0.3s after the last scroll; reversing is INSTANT.
        self.assertIn("const SCROLL_MAX_DPS = 40;", self.html)
        self.assertIn("const SCROLL_STEP = 12;", self.html)
        self.assertIn("const SCROLL_FRICTION = 8;", self.html)
        # reversing direction drops the old velocity → no queued motion to finish first
        self.assertIn("const reversing = state.scrollVel !== 0 && Math.sign(state.scrollVel) !== dir;", self.html)
        self.assertIn("if (reversing) state.scrollVel = 0;", self.html)
        self.assertIn("state.scrollVel = Math.max(-SCROLL_MAX_DPS, Math.min(SCROLL_MAX_DPS, state.scrollVel + bump));", self.html)
        # the cursor moves DIRECTLY at the day-rate (no target chase = no queue), then snaps HARD to a day
        self.assertIn("state.cursor += state.scrollVel * dt;", self.html)
        self.assertIn("if (Math.abs(r - state.cursor) < 0.01) { state.cursor = r; state.scrubDir = 0; }", self.html)
        # smallest flick commits EXACTLY 1 day: anchor at the gesture's start day, and if it stalls short of a
        # full day, snap to the adjacent day in the scroll direction rather than back to where it began.
        self.assertIn("if (state.scrollVel === 0 || reversing) state.scrubAnchor = Math.round(state.cursor);", self.html)
        self.assertIn("if (state.scrubDir && r === state.scrubAnchor) r = Math.max(0, Math.min(TOTAL, state.scrubAnchor + state.scrubDir));", self.html)
        self.assertIn("state.cursor = state.target = f * TOTAL; state.scrollVel = 0; state.scrubDir = 0;", self.html)  # timebar clears the floor
        # the old per-gesture-cap / velocity-coast / flick machinery is gone
        for gone in ("WHEEL_CAP_PX", "SCRUB_EASE", "scrollNotch", "wheelGain", "state.flickVel", "kickWarp", "warpPulse"):
            self.assertNotIn(gone, self.html)

    def test_timebar_scrubber_and_one_date(self):
        # The bottom timebar is a video-style scrubber: pointer drag maps x→date and sets the cursor directly.
        self.assertIn('<div class="timebar" id="timebar">', self.html)
        self.assertIn('timebar.addEventListener("pointerdown"', self.html)
        self.assertIn('timebar.addEventListener("pointermove"', self.html)
        self.assertIn("state.cursor = state.target = f * TOTAL; state.scrollVel = 0;", self.html)
        self.assertIn("state.lastWheel = 0; }; // → idle → snap to the day + load it", self.html)
        # LIFTED ~9px off the bottom edge (so the OS resize cursor doesn't fight it) with a grab cursor + a
        # knob playhead affordance (the ::after on the fill) so it's easy to grab.
        self.assertIn("left: 10px; right: 10px; top: 6px; height: 12px; pointer-events: auto; cursor: grab;", self.html)
        self.assertIn(".timebar-fill::after { content: \"\"; position: absolute; right: -5px;", self.html)
        # ONE date display: the centre jump-to overlay is gone; only the top #date ticks live as you travel
        self.assertNotIn('id="jump"', self.html)
        self.assertNotIn('classList.toggle("jumping"', self.html)
        self.assertNotIn('$("jump").classList', self.html)

    def test_hyperspace_on_motion_rate(self):
        # Hyperspace keys off the view's MOTION RATE in days/sec (|dCursor/dt|) — ONE signal covering wheel,
        # timebar drag, touch AND the key-jump slew. Measured across frames so input-handler moves count too.
        self.assertIn("const WARP_LO_DPS = 6, WARP_HI_DPS = 26, OVERDRIVE_LO_DPS = 22, OVERDRIVE_HI_DPS = 40;", self.html)
        self.assertIn("state.vel = (state.cursor - state.lastCursor) / Math.max(dt, 1e-3);", self.html)
        self.assertIn("const warpSpeed = smooth(WARP_LO_DPS, WARP_HI_DPS, speed);", self.html)
        self.assertIn("smooth(OVERDRIVE_LO_DPS, OVERDRIVE_HI_DPS, speed)", self.html)
        self.assertNotIn("speed / (11 * state.navK)", self.html)

    def test_full_history_timeline_loads_lazily_per_year(self):
        # The lean index must make the WHOLE archive scrubbable at boot (from the manifest's date list),
        # loading per-year aggregates only as the cursor scrubs into them — not just the boot year (the
        # bug that made a 24k-day index show only the latest year), and not the whole 4 MB ledger at once.
        self.assertIn("const hasDays = Array.isArray(m.days) && m.days.length > 0;", self.html)
        self.assertIn("if (hasDays) witnessDates = m.days.filter((d) => /^\\d{4}-\\d{2}-\\d{2}$/.test(d)).sort();", self.html)
        self.assertIn("async function ensureYearLoaded(year)", self.html)
        self.assertIn("const loadedYears = new Set();", self.html)
        self.assertIn('ensureYearLoaded(date.slice(0, 4));', self.html)            # scrub pulls the year's chunk
        # a wrong-era loaded catalog is NOT carried onto a far day (34k modern objects onto 1965) — fall
        # back to the era-correct placeholder instead
        self.assertIn("stale && expect && stale <= expect * 1.8 && stale >= expect * 0.55", self.html)
        self.assertIn("state.catalogDate = null; state.objects = [];", self.html)

    def test_identity_directory_joins_onto_pure_orbit_catalogs(self):
        # The per-day catalogs stay PURE-ORBIT (so their bytes remain chain-verifiable, hash == attestation);
        # identity — name / type / country / decay / launch — lives in a separate directory.json joined
        # client-side at render (§8.1). Loaded through the same ranked-node path, byte-capped, JSON.parse only.
        self.assertIn("const DIRECTORY = new Map();", self.html)
        self.assertIn("async function loadDirectory()", self.html)
        self.assertIn("function ingestDirectory(d)", self.html)
        self.assertIn('directory: (n, gz) => rawUrl(n, n.node, gz ? "directory.json.gz" : "directory.json"),', self.html)
        # loaded in parallel at boot; loadCatalog awaits it before joining, but the OPTIONAL directory must
        # never block the ESSENTIAL catalog render — a stalled node fails OPEN via a timeout race.
        self.assertIn("directoryReady = loadDirectory();", self.html)
        self.assertIn("if (directoryReady) await Promise.race([directoryReady, new Promise((r) => setTimeout(r, 8000))]);", self.html)
        # FILL-IF-ABSENT merge keyed by NORAD — a full-row catalog (today's production) keeps its own
        # chain-verifiable values, so the join is backward-compatible AND a no-op when no directory is
        # published (DIRECTORY stays empty). The join is gated on DIRECTORY.size.
        self.assertIn("if (DIRECTORY.size) for (const row of list) {", self.html)
        self.assertIn('const d = DIRECTORY.get(String(row.NORAD_CAT_ID ?? row.norad_cat_id ?? ""));', self.html)
        self.assertIn("if (!row.OBJECT_NAME) row.OBJECT_NAME = d.OBJECT_NAME;", self.html)
        self.assertIn("if (!row.DECAY_DATE) row.DECAY_DATE = d.DECAY_DATE;", self.html)
        # RCS_SIZE is part of the join — the Radar-size lens, object sizing and cubesat shapes read o.meta.rcs
        self.assertIn("RCS_SIZE: e.RCS_SIZE ?? e.RCS ?? e.rcs ?? null,", self.html)
        self.assertIn("if (!row.RCS_SIZE) row.RCS_SIZE = d.RCS_SIZE;", self.html)
        # DECAY_DATE from the directory drives the EXISTING time-aware reentered (decay <= shown date) logic,
        # so scrubbing back shows only what was actually on orbit then — decay came for free with the join.
        self.assertIn("const reentered = !!decay && decay <= date;", self.html)
        # tolerant of object-keyed OR array directory form + Space-Track satcat field-name variants
        self.assertIn("if (Array.isArray(d)) for (const e of d) put(null, e);", self.html)
        self.assertIn("e.OBJECT_NAME ?? e.SATNAME ?? e.name", self.html)
        # PRODUCTION-SAFE: the live CONFIG still ships its real backing nodes — NOT cleared to [] for a
        # local-only test (the local source comes via the ?source= dev node, which serves local-first).
        self.assertIn('{ id: "ompub",', self.html)
        self.assertNotIn("nodes: []", self.html)

    def test_settings_capture_timeline_navigation(self):
        self.assertIn('if (settings.classList.contains("open")) return;', self.html)
        # the modal owns its keys natively (Tab / Enter / arrows); background goes inert
        self.assertIn("for (const el of document.body.children) if (el !== settings) el.inert = on;", self.html)
        self.assertIn("state.vel = 0; state.target = state.cursor", self.html)

    def test_prisms_allow_complete_rotated_faces(self):
        self.assertIn("width: min(330px", self.html)
        self.assertIn(".prism-inner { position: relative; height: 94px", self.html)
        self.assertIn("translateZ(47px)", self.html)
        self.assertIn("translateZ(114px)", self.html)
        # The densest face (on-orbit by type: header + four rows) must clear the fixed 94px
        # box. Tight row spacing + a slim header gutter keep every row inside the face, so
        # nothing clips on a display whose font metrics round the layout a pixel or two taller.
        self.assertIn("row-gap: 2px", self.html)
        self.assertIn("letter-spacing: 0.1em; padding-bottom: 3px;", self.html)
        self.assertIn("padding: 6px 10px 0", self.html)
        # The drum is seated so the RESTING front face sits on the screen plane (z=0): a face
        # popped toward the viewer under the shallow perspective magnifies and spills past the
        # clip box, shaving the left edge off left-aligned text. Pull it back by its apothem.
        self.assertIn("new DOMMatrix(getComputedStyle(faces[0]).transform).m43", self.html)
        self.assertIn("const seat = (deg) => `translateZ(${-depth}px) rotateX(${deg}deg)`", self.html)
        self.assertIn("inner.style.transform = seat(-turns * angle)", self.html)
        self.assertIn("turns = 0; inner.style.transform = seat(0)", self.html)

    def test_mobile_layout_gestures_and_tooltip_taps(self):
        # The former two lower-left prisms are one eight-face archive prism,
        # leaving one archive record in each lower mobile corner.
        self.assertIn(".readout .prism { bottom:", self.html)
        self.assertIn("#prism-obj { left:", self.html)
        self.assertIn("#prism-witness { right:", self.html)
        self.assertIn('class="prism eight" id="prism-obj"', self.html)
        self.assertNotIn('id="prism-fp"', self.html)
        self.assertNotIn(".readout, .witness, .lens-legend", self.html)
        # One finger looks; two fingers navigate time/lenses with content-following time direction.
        self.assertIn('touchGesture = { mode: "look"', self.html)
        self.assertIn('touchGesture = { mode: "navigate"', self.html)
        self.assertIn("touches.size >= 2", self.html)
        self.assertIn("function touchDaysForDistance(px)", self.html)
        # reach is CAPPED (~2yr per full drag), not the whole archive — fine day/week/month control restored
        self.assertIn("const reach = Math.min(Math.max(1, TOTAL), Math.max(120, Math.round(TOTAL * 0.03)));", self.html)
        self.assertIn("return Math.max(1, Math.round(Math.pow(reach, t)));", self.html)
        self.assertNotIn("Math.round(TOTAL * 0.8)", self.html)
        self.assertNotIn("Math.pow(span, t)", self.html)
        self.assertIn("if (d <= oneDayPx) return 1", self.html)
        self.assertIn("touchGesture.startTarget + Math.sign(dy) * days", self.html)
        self.assertIn("touchGesture.lensShifted = true", self.html)
        # Mobile taps get a real visible explanation rather than relying on title behavior.
        self.assertIn('data-tip="${esc(why)}"', self.html)
        self.assertIn('closest("[data-tip]")', self.html)
        self.assertIn("tip-open::after", self.html)
        # A non-target click inside the panel dismisses it on touch and desktop.
        self.assertIn('$("inspector").addEventListener("click"', self.html)
        self.assertIn('closest("[data-tip],a,button")', self.html)

    def test_controls_capture_and_catalog_download(self):
        # The control rack sits outside the HUD but joins the rest of the chrome in Zen.
        hud_end = self.html.index("</main>")
        self.assertGreater(self.html.index('id="camera-btn"'), hud_end)
        self.assertGreater(self.html.index('id="settings-btn"'), hud_end)
        self.assertIn(".controls { position: fixed", self.html)
        self.assertIn("top: calc(var(--safe-top) + 12px); right:", self.html)
        self.assertIn("function drawCaptureHud(ctx, out)", self.html)
        self.assertIn("drawCaptureHud(ctx, out)", self.html)
        self.assertNotIn("new XMLSerializer", self.html)
        self.assertIn("renderer.render(scene, camera); renderInspectorVignette(0)", self.html)
        self.assertNotIn('renderer.domElement.toDataURL("image/png")', self.html)
        self.assertIn("fileSlug(LENSES[state.lens])", self.html)
        self.assertIn("norad-${fileSlug(selected.id)}", self.html)
        self.assertIn('document.body.append(a); a.click(); a.remove()', self.html)
        self.assertIn('flashMode("Frame saved")', self.html)
        # Catalog download only appears once the exact loaded compressed file is retained.
        self.assertIn('id="catalog-btn"', self.html)
        self.assertIn("catalogGzByDate.set(date, cgz.slice(0))", self.html)
        self.assertIn("rso-catalog-${date}.json.gz", self.html)
        # Settings replaces the old circle mark and all button glyphs are centered.
        self.assertNotIn("brand-mark", self.html)
        self.assertIn(".icon-btn svg { display: block; margin: auto; }", self.html)
        self.assertIn("FS_EXIT", self.html)

    def test_pause_stops_rendering_and_prunes_transient_caches(self):
        self.assertNotIn('id="pause-btn"', self.html)
        self.assertIn('if (k === "h") { setSuspended(!state.suspended)', self.html)
        self.assertIn("renderer.setAnimationLoop(null)", self.html)
        self.assertIn("renderer.setAnimationLoop(animate)", self.html)
        self.assertIn("renderer.renderLists.dispose()", self.html)
        self.assertIn("animation-play-state: paused !important", self.html)
        self.assertIn("for (const date of catalogCache.keys())", self.html)
        self.assertIn("for (const date of catalogGzByDate.keys())", self.html)
        self.assertIn("state.suspended", self.html)
        self.assertIn("if (state.suspended) return", self.html)

    def test_settings_has_keyboard_shortcut_page(self):
        self.assertIn('id="settings-page-shortcuts"', self.html)
        self.assertIn('data-settings-page="shortcuts"', self.html)
        for label in ("Arrows / WASD", "Space", "Enter", "H", "Z", "P", "F", "Esc", "Home / End",
                      "`", "I", "1–9 / 0", "- / +", "[ / ]", "{ / }", "&lt; / &gt;"):
            self.assertIn(f"<dt>{label}</dt>", self.html)
        self.assertIn("function showSettingsPage(page, focusTab)", self.html)

    def test_settings_has_concise_about_page_and_repo_links(self):
        self.assertIn('id="settings-page-about"', self.html)
        self.assertIn('data-settings-page="about"', self.html)
        for heading in ("Why", "What", "How"):
            self.assertIn(f"<h3>{heading}</h3>", self.html)
        self.assertIn('href="https://github.com/OMPub/RSO"', self.html)
        self.assertIn('href="https://github.com/brookr/RSO"', self.html)
        self.assertIn('aria-label="Project repositories"', self.html)

    def test_desktop_prisms_occupy_lower_corners_and_controls_top_right(self):
        self.assertIn("#prism-obj { left: calc(var(--safe-left) + 18px); }", self.html)
        self.assertIn("#prism-witness { right: calc(var(--safe-right) + 18px); }", self.html)
        self.assertIn(".face { position: absolute; inset: 0; backface-visibility: hidden; padding: 6px 10px 0;", self.html)
        status = re.search(r'<div class="status"[^>]*>(.*?)</div>', self.html, re.S)
        self.assertIsNotNone(status)
        self.assertLess(status.group(1).index('id="status-label"'),
                        status.group(1).index('id="status-light"'))
        self.assertNotIn('class="icon-btn"', status.group(1))

    def test_visual_earth_is_decoupled_from_orbit_center(self):
        # A larger, lower visual globe flattens the horizon without moving the tracks.
        self.assertIn("const EARTH_EC =", self.html)
        self.assertIn("const ER = 430", self.html)
        self.assertIn("earth.position.set(EARTH_EC.x", self.html)
        self.assertIn("y = EC.y + yArc", self.html)

    def test_zen_is_independent_from_lenses_and_double_tap_toggles_it(self):
        lenses = re.search(r"const LENSES = \[(.*?)\];", self.html)
        self.assertIsNotNone(lenses)
        names = re.findall(r'"([^"]+)"', lenses.group(1))
        self.assertIn("Radar size", names)
        self.assertIn("Daily changes", names)
        self.assertNotIn("Zen", names)
        self.assertIn("function toggleZen()", self.html)
        self.assertIn("sceneTapAt(e.clientX, e.clientY, p.pickNid, p.pickIdx)", self.html)
        self.assertIn("body.zen .hud > :not(.inspector)", self.html)
        self.assertIn("body.zen .controls .icon-btn:not(#camera-btn)", self.html)
        self.assertIn("const R2 = 20 * 20", self.html)

    def test_desktop_scroll_scales_time_and_steps_lenses_once(self):
        # The wheel is per-gesture-capped momentum (see test_wheel_is_per_gesture_capped_momentum); TOUCH
        # drag still uses the distance-to-days model (a finger travels a distance → move proportionally).
        self.assertIn("function navigationDaysForDistance(px, oneDayPx)", self.html)
        self.assertIn("touchGesture.startTarget + Math.sign(dy) * days", self.html)   # touch drag (direct manipulation)
        # Horizontal accumulation may cross the threshold many times, but a gesture
        # is allowed to shift the lens once.
        self.assertIn("wheelGesture.lensShifted = true", self.html)
        self.assertNotIn("while (wheelAccumX", self.html)
        # A lull ends the gesture, so a SECOND sideways flick at the same spot re-arms and
        # shifts again — while a continuous swipe (events far closer than the lull) stays one.
        self.assertIn("let wheelGesture = null, wheelEndTimer = 0;", self.html)
        self.assertIn("const WHEEL_GESTURE_IDLE = 140;", self.html)
        self.assertIn("wheelEndTimer = setTimeout(() => { wheelGesture = null; }, WHEEL_GESTURE_IDLE);", self.html)

    def test_operator_unknown_is_split_from_other(self):
        # "Other" (a real operator not in the highlighted eight — Canada, Intelsat…) is a
        # different thing from "Unknown" (no/TBD country on record). They get separate colours
        # and separate legend rows; the genuinely-unattributed objects recede (dimmer alpha).
        self.assertIn("const UNKNOWN_COL = [0.30, 0.32, 0.37];", self.html)
        self.assertIn('const isUnattributed = (cc) => cc === "—" || cc === "TBD";', self.html)
        self.assertIn("col = re ? COLORS.ghost : opc || (isUnattributed(o.country) ? UNKNOWN_COL : OTHER_COL);", self.html)
        self.assertIn("aMul = re ? 0.3 : opc ? 1 : isUnattributed(o.country) ? 0.5 : 0.9;", self.html)
        self.assertIn('sw(OTHER_COL, "Other operators") + sw(UNKNOWN_COL, "Unknown")', self.html)

    def test_inspector_object_takes_the_active_lens_colour(self):
        # The inspected object's name and model-frame are tinted to the colour its speck
        # wears under the active lens (o.col, set by colorSlot) — in every lens, not just 4.
        self.assertIn('const lensCol = o.col ? rgbStr(o.col) : "";', self.html)
        self.assertIn("nameEl.style.color = lensCol;", self.html)
        self.assertIn('$("insp-stage").style.borderColor = lensCol || "";', self.html)

    def test_high_drag_objects_surface_their_drag_terms(self):
        # A high-drag (dynamic) object shows the quantities that flagged it — the SGP4 B*
        # drag term and the mean-motion derivative — on their OWN line (insp-drag), so the
        # data line never wraps. Plain-language tooltips, gated so routine objects stay clean.
        self.assertIn('$("insp-drag").innerHTML = o.change === "dynamic" && m && (m.bstar || m.mmDot)', self.html)
        self.assertIn('m.bstar ? tip(`B* ${m.bstar.toExponential(1)}`, "how hard the thin upper air is dragging it down")', self.html)
        self.assertIn('m.mmDot ? tip(`Δn ${m.mmDot.toExponential(1)}`, "how fast its orbit is shrinking")', self.html)
        self.assertIn('<div class="insp-drag" id="insp-drag">', self.html)
        self.assertIn(".insp-drag:empty { display: none; }", self.html)
        # the drag terms no longer live in the (wrapping) data line
        self.assertNotIn('m.rcs.toLowerCase(), "how big it looks on radar") : null,\n            o.change === "dynamic"', self.html)

    def test_inspector_tooltips_are_instant_only_and_plain(self):
        # data-tip drives the instant in-app tooltip; the slow, redundant native title box
        # is gone (aria-label keeps the explanation for screen readers). Plain wording.
        self.assertIn('aria-label="${esc(txt)} — ${esc(why)}" data-tip="${esc(why)}"', self.html)
        self.assertNotIn('title="${esc(why)}" data-tip="${esc(why)}"', self.html)
        self.assertIn('tip(`NORAD ${m.id}`, "catalog number")', self.html)
        self.assertIn('"which way the orbit\'s plane is turned"', self.html)
        # tooltips work for any data-tip span in the inspector body (meta AND drag line)
        self.assertIn(".insp-body [data-tip]", self.html)
        self.assertIn('$("insp-body").addEventListener("click"', self.html)

    def test_inspector_model_follows_the_active_lens(self):
        # The vignette's 3D model wears the active-lens colour (o.col via vig.tint), so the
        # model matches the name, the stage frame, and the speck in the field — every lens.
        self.assertIn("vig = { active: false, scene: null, camera: null, group: null, tint: null }", self.html)
        self.assertIn("const c = vig.tint || TYPE_COLS[klass] || TYPE_COLS[3]", self.html)
        self.assertIn("vig.tint = o.col || null;", self.html)

    def test_held_view_still_accepts_taps_to_inspect(self):
        # 'h' parks the render loop, but a tap must still inspect a frozen object. pointerdown
        # no longer bails on suspend (only pointermove suppresses pan/look), and a one-shot
        # drawHeldFrame() paints the halo + 3D model onto the frozen scene without resuming.
        self.assertIn("if (state.suspended) return;          // a held view doesn't pan or look", self.html)
        self.assertIn("function drawHeldFrame()", self.html)
        self.assertIn("if (state.suspended) drawHeldFrame();   // parked loop: repaint once so the halo + model show", self.html)
        self.assertIn("if (state.suspended) drawHeldFrame();   // parked loop: repaint once to clear the halo", self.html)
        # pointerdown must NOT short-circuit on suspend any more (that was the tap blocker)
        pd = self.html[self.html.index('canvas.addEventListener("pointerdown"'):]
        pd = pd[:pd.index('canvas.addEventListener("pointermove"')]
        self.assertNotIn("if (state.suspended) return;", pd)

    def test_i_finds_and_follows_the_iss(self):
        # 'i' selects the ISS by catalog number (25544) and follows it: a selection records
        # its NORAD and re-acquires that slot after each day loads, so you can scrub the
        # timeline and watch the same station change. Off-screen is handled (card shows now,
        # halo rings it when its lap returns it). 'i' no longer opens the About page.
        self.assertIn('if (k === "i") { findISS(); ', self.html)
        self.assertNotIn('if (k === "i") { showSettings(true, "about");', self.html)
        self.assertIn('const ISS_NORAD = "25544";', self.html)
        self.assertIn("function findISS()", self.html)
        self.assertIn('flashMode(onScreen ? "Following the ISS" : "Following the ISS · coming around")', self.html)
        self.assertIn("function reacquireFollow()", self.html)
        self.assertIn("state.followNorad = m ? m.id : null;", self.html)   # set on select
        self.assertIn("state.followNorad = null;", self.html)              # cleared on dismiss
        self.assertIn("reacquireFollow();", self.html)                     # wired after day load + on arrival
        self.assertIn("<dt>I</dt><dd>Find and follow the ISS</dd>", self.html)

    def test_iss_has_a_hand_built_model(self):
        # The ISS (25544) is the ONE hand-modelled, realistically-coloured craft: an integrated
        # truss with eight gold solar wings in four pairs, white modules/radiators and the Russian
        # segment slung below. buildVigShape feeds both the inspector and the field solid (bakeSolid).
        self.assertIn('if (o.meta && o.meta.id === "25544") {', self.html)
        self.assertIn("the ISS — the ONE hand-modelled craft", self.html)
        self.assertIn("const ISS_MAT =", self.html)                                  # realistic, not lens-tinted
        self.assertIn("for (const sx of [-0.92, -0.5, 0.5, 0.92])", self.html)       # four truss stations…
        self.assertIn("for (const sy of [0.46, -0.46]) add(wing, gold", self.html)   # …a wing up + down → eight
        self.assertIn("Russian segment slung below", self.html)
        # even the hand-built craft is generated FROM its data: a seeded sun-tracking array pitch
        self.assertIn("const pitch = (R(7) - 0.5) * 0.5;", self.html)

    def test_sputnik_1_and_2_have_hand_built_models(self):
        # The first two craft get their own hand models (like the ISS), keyed on their catalog
        # numbers (Sputnik 1 = NORAD 2, Sputnik 2 = NORAD 3), each generatively varied from its data.
        self.assertIn("const SPUTNIK_MAT =", self.html)
        self.assertIn('if (id === "2") {', self.html)                                   # Sputnik 1
        self.assertIn("the 58 cm pressurised sphere", self.html)
        self.assertIn('if (id === "3") {', self.html)                                   # Sputnik 2
        self.assertIn("the spent R-7 core", self.html)
        self.assertIn("whip.quaternion.setFromUnitVectors(up, dir)", self.html)         # seeded swept antennas
        # bake guards BOTH the vertex and index slot reservations (a tessellated sphere can blow RES_I)
        self.assertIn("geo.getAttribute(\"position\").count > RES_V || (geo.index && geo.index.count > RES_I)", self.html)

    def test_generic_payloads_follow_their_design_era(self):
        # A generic payload's silhouette tracks its launch-year era: dawn spheres + whip antennas,
        # spin-stabilized drums, boxy 3-axis buses, then modern winged buses. Placeholders (no real
        # data) get a seeded launch year drawn from the era under the cursor, and seed their shape from
        # the per-slot id (not the old nid=1 that made every placeholder solid identical).
        self.assertIn("const eraOf = (y) =>", self.html)
        self.assertIn("const era = eraOf(o.launchYear);", self.html)
        self.assertIn("DAWN (≤1965)", self.html)
        self.assertIn("SPIN-STABILISED DRUM", self.html)
        self.assertIn("BOXY 3-AXIS BUS", self.html)
        self.assertIn("const nid = o.nid || (o.meta ? (parseInt(o.meta.id, 10) || 1) : 1);", self.html)  # per-slot seed
        self.assertIn("o.nid = nid;", self.html)                                        # stored on both init paths
        self.assertIn("phYear = parseInt(date.slice(0, 4), 10) || 0;", self.html)       # scrubbed-era for placeholder ages
        self.assertIn("(phYear > 1957 ? 1957 + Math.floor(rand2(i, 131) * (phYear - 1956)) : phYear || 0)", self.html)

    def test_iss_is_a_normal_field_object_biased_central(self):
        # The ISS is NOT a separate scripted cameo — it's the real catalogue object, rendered as its
        # detailed solid by the normal field path (bakeSolid -> buildVigShape), selectable/clickable
        # and ring-able like any object, just nudged toward the central river so it floats by nearer
        # the middle.
        self.assertNotIn("issCameo", self.html)                                       # the gimmicky cameo is gone
        self.assertNotIn("updateIssCameo", self.html)
        self.assertIn("const g = buildVigShape(o);", self.html)                       # field solids ARE buildVigShape
        self.assertIn("if (nid === 25544) g *= 0.4;", self.html)                      # central-river bias for the ISS
        self.assertIn('const ISS_NORAD = "25544";', self.html)                        # 'i' still finds the real object

    def test_iss_always_solidifies_and_flies_closer(self):
        # The ISS should never read as a bare sphere when it passes: it solidifies whenever it is
        # on-screen, however far, and is force-kept in the pool. Its orbit is pulled in to a closer,
        # central shell so it floats by nearer the viewer, and laps slowly so the pass is legible.
        self.assertIn("o.iss = !!(src && src.id === \"25544\");", self.html)           # flag set on fresh init
        self.assertIn('o.iss = src.id === "25544";', self.html)                        # …and on the migrate path (adoptSlot)
        self.assertIn("if (solidPx > (o.solid ? MESH_PX_OUT : MESH_PX_IN) || o.iss)", self.html)  # solid whenever on-screen
        self.assertIn("|| o.iss) {", self.html)
        self.assertIn("R: iss ? 438", self.html)                                       # pulled into a closer shell
        self.assertIn("iss ? 1 / 900", self.html)                                      # slow, legible lap
        # the pool reserves enough verts per slot to bake the most complex solid — the ISS (~748 v)
        self.assertIn("const RES_V = 800,", self.html)

    def test_rocket_body_and_debris_tumble(self):
        # Rocket bodies and debris/unknown keep their per-axis body tumble, seeded deterministically
        # from the NORAD id so the same object always spins the same way: rocket bodies (klass 1) roll
        # on the single long/travel axis (keep flying nose-forward), debris & unknown (klass 2,3) on
        # all three axes. (Payloads are handled separately — see test_payloads_fly_nadir_locked.)
        self.assertIn("function seedSpin(i, klass, nid, iss)", self.html)
        self.assertIn("const pSpin = new Float32Array(MAXF * 3)", self.html)
        self.assertIn("const spB = klass === 2 ? 0.8 : klass >= 3 ? 0.55 : 0.4;", self.html)   # debris/unknown/R-B
        self.assertIn("pSpin[i * 3]     = spB * (0.5 + rand2(nid, 71)) * sg(72);", self.html)  # roll: every non-payload class
        self.assertIn("pSpin[i * 3 + 1] = (klass >= 2) ?", self.html)                          # 2nd axis: debris/unknown only
        self.assertIn("pSpin[i * 3 + 2] = (klass >= 2) ?", self.html)                          # 3rd axis: debris/unknown only
        # applied in the BODY frame after the nose-along-velocity alignment, as a tumble quaternion
        self.assertIn("_quat.setFromUnitVectors(_AX, _vel)", self.html)
        self.assertIn("_qspin.setFromEuler(_eul)", self.html)
        self.assertIn("_eul.set(state.time * pSpin[i3], state.time * pSpin[i3 + 1], state.time * pSpin[i3 + 2])", self.html)

    def test_payloads_fly_nadir_locked(self):
        # Operational satellites (klass 0) are NOT free-tumbling — they fly a true LVLH attitude rebuilt
        # every frame from the live orbit: the solar-panel face-normal (local +Y) is LOCKED TO THE RADIAL,
        # so the panels lie PARALLEL TO THE PLANET SURFACE (face toward Earth / out to space, never edge-on
        # to Earth); the wing SPAN (local +X) runs CROSS-TRACK along the orbit-normal, so an edge-on pass
        # reads as a long bright line, not a foreshortened stub. The frame tracks live position so it
        # rotates once per orbit for free; most payloads need no added spin and a seeded minority gets a
        # slow flat-spin about the radial. GEO comsats, navsats and the ISS hold steady.
        self.assertIn("if (o.klass === 0) {", self.html)
        # LVLH basis built from radial-out (away from the ORBITAL centre EC, at the dead-reckoned draw point)
        self.assertIn("_radial.set(_bp.x - EC.x, _bp.y - EC.y, _bp.z - EC.z);", self.html)
        self.assertIn("_tan.copy(_vel).addScaledVector(_radial, -_vel.dot(_radial));", self.html)   # vel projected off radial
        self.assertIn("_norm.crossVectors(_tan, _radial).normalize();", self.html)                  # orbit-normal (cross-track)
        # generic payload: wing span (+X) -> orbit-normal (cross-track), panel face-normal (+Y) -> radial (parallel to surface)
        self.assertIn("_zc.crossVectors(_norm, _radial);", self.html)
        self.assertIn("_m4.makeBasis(_norm, _radial, _zc);", self.html)
        # ISS: panels face local +Z, so lock +Z to the radial instead (truss->track, arrays span the orbit-normal)
        self.assertIn("_zc.crossVectors(_radial, _tan);", self.html)
        self.assertIn("_m4.makeBasis(_tan, _zc, _radial);", self.html)
        # slow flat-spin is a world-axis premultiply about the radial axis (NOT a body tumble)
        self.assertIn("_quat.premultiply(_qspin.setFromAxisAngle(_radial, state.time * pSpin[i3]))", self.html)
        # degenerate-velocity fallback: any stable tangent perpendicular to the radial
        self.assertIn("_tan.set(0, 0, 1).cross(_radial);", self.html)
        # seedSpin policy: the clear majority get a VISIBLE single-axis flat-spin (~0.08–0.30 rad/s, one
        # turn every ~20–80 s — readable across a flyby); a ~12% minority and the ISS hold steady; axes
        # 1 & 2 are always zero (single-axis flat spin only, never a multi-axis tumble)
        self.assertIn("const steady = iss || rand2(nid, 71) < 0.12;", self.html)
        self.assertIn("pSpin[i * 3]     = steady ? 0 : (0.08 + 0.22 * rand2(nid, 73)) * sg(72);", self.html)
        self.assertIn("pSpin[i * 3 + 1] = 0;", self.html)
        # the LVLH temporaries are preallocated at module scope (zero per-frame heap)
        self.assertIn("const _radial = new THREE.Vector3(), _tan = new THREE.Vector3(), _norm = new THREE.Vector3(), _zc = new THREE.Vector3(), _m4 = new THREE.Matrix4();", self.html)
        # both slot-init paths seed with the iss flag so migrated days keep the right policy
        self.assertIn("seedSpin(i, klass, nid, o.iss);", self.html)        # initSlot (fresh)
        self.assertIn("seedSpin(i, src.klass, nid, o.iss);", self.html)    # adoptSlot (migrate)

    def test_on_orbit_estimated_until_the_exact_split_loads(self):
        # On-orbit = record minus already-re-entered. The exact split comes from the index
        # aggregate or the processed catalog; until then estimate it from the stable on-orbit
        # ratio so the first frame shows a real, decayed-subtracted figure — never the bare
        # total — then snaps to exact. The ratio self-calibrates from each exact split.
        self.assertIn("let onOrbitRatio = 0.507;", self.html)
        # self-calibrates from each exact split, but CLAMPED to a sane band so one broken day (on_orbit=1)
        # can't poison the estimate for every un-loaded year
        self.assertIn("onOrbitRatio = Math.min(0.85, Math.max(0.2, onOrbit / objs.length));", self.html)
        self.assertIn("onOrbit = orb ? orb.onOrbit : Math.round(rec.count * onOrbitRatio)", self.html)
        self.assertIn('$("reentered-count").textContent = fmtNum(orb ? orb.reentered : rec.count - onOrbit);', self.html)
        # never falls back to showing the raw total as "on orbit now"
        self.assertNotIn('$("onorbit-count").textContent = orb ? fmtNum(orb.onOrbit) : fmtNum(rec.count);', self.html)
        # the exact split is read instantly from the live index aggregate when present
        self.assertIn("raw.on_orbit_count", self.html)
        self.assertIn("raw.reentered_count ?? 0", self.html)

    def test_missing_data_degrades_era_correctly(self):
        # When a day's exact figures haven't loaded yet, the estimates must be ERA-correct, not modern:
        # a 1965 scrub reads ~1k objects (a year-curve), not the flat ~68k, and the LEO/MEO/GEO split
        # follows the era proportions (no GEO before '63) rather than today's fixed PROP.bands.
        self.assertIn("const REC_CURVE =", self.html)
        self.assertIn("function estRecordForYear(y)", self.html)
        self.assertIn("estRecordForYear(parseInt(date.slice(0, 4), 10) || 2026)", self.html)
        self.assertNotIn("Math.round(67000 + hashUnit(date) * 1500)", self.html)        # the flat modern fallback is gone
        self.assertIn("b ? b.leo : Math.round(onOrbit * phBandCdf[0])", self.html)       # era band split, not PROP.bands
        self.assertNotIn("Math.round(rec.count * PROP.bands.LEO)", self.html)

    def test_reconstructed_days_are_labelled_but_still_witnessed(self):
        # Pre-archive days are RECONSTRUCTED from Space-Track history; the provenance face says so —
        # but the witness/attestation framing is unchanged (viewers still attest the reconstructed
        # values), so we add a label, we do NOT touch "witnessed days" / "Public Witness".
        self.assertIn('const WITNESS_EPOCH = "2026-04-20";', self.html)
        self.assertIn("const isReconstructed = (date) => date < WITNESS_EPOCH;", self.html)
        self.assertIn("const recon = isReconstructed(rec.date);", self.html)
        self.assertIn('$("fp-prov").textContent = recon ? `Reconstructed · ${prov}` : prov;', self.html)
        # the witness framing is intact — the "witnessed days" label is NOT reframed for reconstructed days
        self.assertIn("witnessed days`", self.html)
        self.assertNotIn("reconstructed days`", self.html)

    def test_lens_change_shows_no_centre_toast(self):
        # The legend title already names the active lens; the centre flash could overlap the
        # inspector, so lens changes no longer flash it. Zen still flashes on entry only.
        self.assertIn("function applyMode() { recolor(); populateLegend();", self.html)
        self.assertNotIn("flashMode(LENSES[state.lens])", self.html)
        self.assertIn('if (on) flashMode("Zen");', self.html)
        # the reload prompt and other status toasts still use flashMode
        self.assertIn("flashMode(RELOAD_MSG)", self.html)

    def test_lens_change_refreshes_an_open_inspector(self):
        # Changing lens while an object is open re-renders the inspector so its name, frame,
        # 3D model and data all follow the NEW lens together (not just the field specks).
        self.assertIn('if (state.selIdx >= 0 && $("inspector").classList.contains("visible")) showInspector(state.selIdx);',
                      self.html)

    def test_legend_swatches_preview_the_luminous_field(self):
        # A field dot is drawn with an additive glow that brightens (and warm-shifts) it; the
        # flat legend chip read a notch more orange. The swatch previews that glow so the key
        # matches the dots — a gentle lift tuned to keep every category distinct.
        self.assertIn("const litStr = (c) => rgbStr(c.map((v) => Math.min(1, v * 1.18) * 0.92 + 0.05));", self.html)
        self.assertIn('style="background:${litStr(c)};color:${litStr(c)}"', self.html)

    def test_tapped_object_is_forced_to_render_solid(self):
        # Selecting an object injects it into the mesh-candidate set at top priority so it
        # always wins a solid slot however far it has drifted, and jumps the 1-bake budget.
        # The ISS shares the top-priority treatment so it is never evicted from the pool.
        self.assertIn("c.px = (i === sel || o.iss) ? Infinity : o.meshPx;", self.html)
        self.assertIn("sel >= 0 && sel < FIELD_N && O[sel]?.meta && !O[sel].meshWanted", self.html)
        self.assertIn("c.i = sel; c.d = O[sel].meshDist || 0; c.px = Infinity;", self.html)
        self.assertIn("(builds >= 1 && wi !== state.selIdx)", self.html)

    def test_operator_legend_and_consistent_prism_gutters(self):
        # Every categorical legend follows aligned names with swatches on the right.
        self.assertIn('const sw = (c, label, shape) => `<div class="lg-row after">', self.html)
        self.assertIn("OPERATORS.map((o) => sw(o.col, o.name))", self.html)
        self.assertIn(".lg-row.after", self.html)
        self.assertIn("padding: 6px 10px 0", self.html)

    def test_live_performance_meter_reports_phase_costs(self):
        self.assertIn('id="perf"', self.html)
        self.assertIn("function togglePerf()", self.html)
        self.assertIn('$("perf").hidden = !state.perfVisible', self.html)
        self.assertIn("function reportPerf(now, cpu, interval)", self.html)
        self.assertIn("PERF.field", self.html)
        self.assertIn("PERF.mesh", self.html)
        self.assertIn("PERF.draw", self.html)
        self.assertIn("PERF.builds", self.html)
        self.assertIn("height: 12px; overflow: hidden; text-align: left", self.html)

    def test_selection_halo_eases_in_and_out(self):
        self.assertIn("haloFade: 0", self.html)
        self.assertIn("if (best !== state.selIdx) state.haloFade = 0", self.html)
        self.assertIn("const haloTarget = state.selIdx >= 0 && state.warpBlend < 0.3 ? 1 : 0", self.html)
        self.assertIn("halo.visible = state.haloFade > 0.01", self.html)

    def test_selection_rides_the_drawn_position_and_persists(self):
        # The halo, the tap hit-test, AND the solid body all read ONE drawn position — every object (sprites
        # AND solids) dead-reckons between strided fixes (the vertex shader's mix), so they stay locked together
        # and the body/ring/tap glide smoothly at any work-stride. The old solid-snaps-to-pPos branch is gone.
        self.assertIn("function drawnPos(i, out)", self.html)
        self.assertNotIn("if (O[i] && O[i].solid) return out.set(pPos[b]", self.html)
        self.assertIn("(state.time - pUpdated[i]) / Math.max(0.008, pStep[i])", self.html)
        self.assertIn("drawnPos(state.selIdx, halo.position)", self.html)
        # the tap hit-test (pickAt, run at pointerdown) reads the DRAWN position too, so a tap lands on the speck
        self.assertIn("drawnPos(i, _proj).project(camera)", self.html)
        # A selection PERSISTS through the whole orbit — including off-screen and back around —
        # so it is NOT retired when the object merely leaves the frame. (No edge/behind-camera
        # auto-dismiss of the halo or inspector.)
        self.assertNotIn("_proj.copy(halo.position).project(camera)", self.html)
        self.assertNotIn("Math.abs(_proj.y) > 1.18) { hideInspector()", self.html)

    def test_solids_dead_reckon_every_frame_not_at_the_stride_rate(self):
        # the BatchedMesh solids used to read the raw strided fix (pPos) and only refresh for the cohort in
        # [start,end], so they stepped at the work-stride rate. Now setSolidMatrix reads the dead-reckoned
        # drawnPos and EVERY active solid updates each frame → smooth body + spin at any stride.
        self.assertIn("drawnPos(s.idx, _bp);", self.html)               # body position is the interpolated draw point
        self.assertNotIn("_bp.set(pPos[i3], pPos[i3 + 1], pPos[i3 + 2]);", self.html)  # not the raw fix
        self.assertIn("setSolidMatrix(s);", self.html)
        self.assertNotIn("if (s.idx < start || s.idx >= end) continue;", self.html)    # no per-cohort gate
        self.assertIn("function updateMeshPool(cands, refresh)", self.html)             # start/end params dropped

    def test_live_catalog_adopts_without_restarting_the_field(self):
        self.assertIn("async function adoptField(objects, token)", self.html)
        self.assertIn("if (!(await adoptField(objs, token))) return;", self.html)
        self.assertNotIn("state.catalogDate = date; assignField(objs)", self.html)
        self.assertIn("assignField([], Math.max(FIELD, Math.round(startRec.orbit ? startRec.orbit.onOrbit : startRec.count * onOrbitRatio)))", self.html)
        # Identity adoption preserves the current frame but continuously migrates every
        # slot into the real object's altitude shell and element-driven plane.
        self.assertIn("function orbitParams(src, band, nid)", self.html)
        self.assertIn("o.orbitTarget = orbitParams(src, src.band, nid)", self.html)
        self.assertIn("settleOrbit(o, objectDt)", self.html)

    def test_day_load_is_strided_and_capability_scaled(self):
        # the heavy ~34k-slot rebuild spreads across frames so a catalog handoff never
        # drops a frame; a capable machine takes bigger strides than a phone.
        self.assertIn("const DAYLOAD_CHUNK = mobile ? 4000 : (navigator.hardwareConcurrency >= 8 ? 20000 : 10000)", self.html)
        self.assertIn("for (let base = 0; base < newN; base += DAYLOAD_CHUNK)", self.html)
        self.assertIn("if (token != null && token !== state.loadToken) return false;", self.html)
        self.assertIn("if (lim < newN) await raf();", self.html)
        self.assertIn("function colorSlot(o)", self.html)   # per-slot recolor, inlined into the chunked adopt

    def test_boots_from_live_index_no_embedded_baseline(self):
        # The as-of-mint embedded baseline was removed — the offline-permanence snapshot is being
        # redesigned for the full 1959->now history. Until then the piece boots from the live
        # Tier-1 index and carries NO inlined baseline blob.
        self.assertNotIn("const BASELINE =", self.html)
        self.assertNotIn("seedFromBaseline", self.html)
        # permanence-first head resolution: the lean Tier-1 index IS the live timeline, the legacy
        # ledger.json a fallback for nodes that lag.
        self.assertIn("async function loadIndex()", self.html)
        self.assertIn("index/manifest.json", self.html)
        self.assertIn("async function loadLedger()", self.html)
        # boots to the LATEST witnessed day
        self.assertIn("if (!state.engaged)", self.html)
        # with no reachable source the state is honest that it's a placeholder, not a real archive
        self.assertIn('"No live source"', self.html)

    def test_year_chunk_cache_is_lru_bounded(self):
        # The full 1959->now archive is ~70 year-chunks; the localStorage cache must NOT keep them all
        # (that would blow the ~5MB origin quota). It is bounded to the most-recently-used IDX_CACHE_MAX
        # years, evicts the oldest, and survives a QuotaExceededError by evicting more and retrying.
        self.assertIn("const IDX_CACHE_PREFIX =", self.html)
        self.assertIn("IDX_CACHE_MAX = 20", self.html)
        self.assertIn("function idxCacheSet(year, value)", self.html)
        self.assertIn("while (lru.length > IDX_CACHE_MAX)", self.html)           # count cap
        self.assertIn("const victim = lru.find((y) => y !== year);", self.html)  # quota -> evict oldest other year
        self.assertIn("idxCacheTouch(year);", self.html)                         # a cache hit bumps recency
        self.assertIn("idxCacheSet(year, JSON.stringify({ sha: want, days }));", self.html)

    def test_adopt_field_tracks_each_days_true_count(self):
        # no frozen FIELD_N: each day recomputes the draw count, so no satellite is
        # duplicated (the old i % objects.length wrap) or silently truncated.
        self.assertIn("const newN = Math.min(objects.length, MAXF), oldN = FIELD_N;", self.html)
        self.assertIn("if (i >= oldN || !o) { initSlot(i, src); colorSlot(O[i]); return; }", self.html)
        self.assertNotIn("objects[i % objects.length]", self.html)
        self.assertIn("function slotBaseSize(klass, band, rcs, nid)", self.html)
        self.assertIn("function initSlot(i, src)", self.html)

    def test_placeholder_river_density_tracks_each_day(self):
        # While scrubbing (before a day's catalog loads) the representative river's SIZE tracks that
        # day's on-orbit count, so the sky thins to a handful in 1959-60 and swells with the Starlink
        # era — driven from the instant index aggregate, not frozen at the last catalog's density.
        self.assertIn("function resizeField(newN)", self.html)
        self.assertIn("for (let i = FIELD_N; i < newN; i++) { initSlot(i, null); colorSlot(O[i]); }", self.html)  # grow inits only the delta
        self.assertIn("function densifyForDay(date, settled)", self.html)
        self.assertIn("const onOrbit = rec.orbit ? rec.orbit.onOrbit : Math.round(rec.count * onOrbitRatio);", self.html)
        self.assertIn("const sd = isoFor(shown); showDay(sd); densifyForDay(sd);", self.html)       # per-frame day-change hook
        self.assertIn("densifyForDay(d, true);", self.html)                                          # settle on arrival
        # never fights a chunked catalog adopt
        self.assertIn("if (state.catalogDate === date || state.adopting) return;", self.html)
        self.assertIn("state.adopting = true; try {", self.html)
        self.assertIn("} finally { if (token == null || token === state.loadToken) state.adopting = false; }", self.html)

    def test_placeholder_river_composition_is_era_correct(self):
        # The representative river's band/class mix tracks the day's aggregates: a 1960s scrub shows
        # no GEO (none existed pre-1963), payload/rocket-body-heavy, debris growing later — not today's
        # 90%-LEO / Starlink mix. The expensive re-roll only fires when the era actually drifts and the
        # field is legible (not mid-warp); otherwise it's a free density resize.
        self.assertIn("let phBandCdf = [PROP.bands.LEO, PROP.bands.LEO + PROP.bands.MEO];", self.html)
        self.assertIn("let phClassCdf = [0.363, 0.46, 0.968, 0.998];", self.html)
        self.assertIn("function compFromRecord(rec)", self.html)
        self.assertIn("const compDrift =", self.html)
        # placeholder slots sample band + class from the era CDFs (not the fixed modern constants)
        self.assertIn("hashUnit(`b${i}`) < phBandCdf[0] ? 0 : hashUnit(`b${i}`) < phBandCdf[1] ? 1 : 2", self.html)
        self.assertIn("r < phClassCdf[0] ? 0 : r < phClassCdf[1] ? 1 : r < phClassCdf[2] ? 2 : r < phClassCdf[3] ? 3 : 4", self.html)
        # mid-hyperspace the field is washed out → skip the per-frame churn entirely (this was the lag).
        self.assertIn("if (!settled && state.warpBlend >= 0.45) return;", self.html)
        # When a real catalog is on screen, NEVER re-roll on a day-cross (that snapped every object back onto a
        # placeholder track before the next catalog re-settled it — the "everything slides on each 1-day step").
        # Resize in place; re-roll only in placeholder mode, and only on real era drift.
        self.assertIn("if (!realShown && (!phComp || compDrift(comp, phComp) > 0.08)) {", self.html)
        self.assertIn("resizeField(newN);                                 // cheap: density only — keeps every object on its track", self.html)

    def test_orbital_track_is_identity_stable_day_to_day(self):
        # An object must hold the SAME orbital track across day-changes. The plane longitude is now seeded by
        # IDENTITY (nid) — the real RA_OF_ASC_NODE regresses ~degrees/day, and using it slid every object
        # sideways on each 1-day step. Inclination is ~constant day-to-day, so a touch of it is kept for variety.
        self.assertIn("g = (rand2(nid, 23) - 0.5) * (band === 0 ? 2.3 : 2.7)", self.html)
        self.assertIn("+ (((src.inc || 65) - 65) / 65) * 0.35", self.html)
        self.assertNotIn("(src.raan || 0) / 360", self.html)          # the precessing element no longer drives the plane
        # phase / anomaly seeded by identity (nid), not the raw slot index
        self.assertIn("o.phase = rand2(nid, 47);", self.html)
        self.assertIn("o.ta = rand2(nid, 53) * 6.2832;", self.html)
        # the mobile sample is identity-stable (same objects each day), not a daily reshuffle keyed on the date
        self.assertIn("sort((a, x) => hashUnit(a.id) - hashUnit(x.id))", self.html)
        self.assertNotIn("hashUnit(`${a.id}:${date}`)", self.html)
        # A persistent identity→slot map keeps each object in the SAME field slot across day-loads. Without it,
        # objects[i]→slot i means one launch/decay shifts every slot after it (measured on the real archive:
        # a 7-day step with 11 launches + 68 decays reshuffled 21,419 of 34,444 slots — 62% — and only 11 move
        # with the map). The NORAD sort now only makes the first adopt / new-object placement deterministic.
        self.assertIn("let slotByNid = new Map();", self.html)
        self.assertIn("const src = objects[k], id = String(src.id), prev = slotByNid.get(id);", self.html)
        self.assertIn("if (prev != null && prev < newN && assign[prev] == null) { assign[prev] = src; nextMap.set(id, prev); }", self.html)
        self.assertIn("slotByNid = nextMap;", self.html)
        self.assertIn("for (let i = base; i < lim; i++) adoptSlot(i, assign[i], oldN);", self.html)
        self.assertIn("objects.sort((a, b) => (parseInt(a.id, 10) || 0) - (parseInt(b.id, 10) || 0));", self.html)
        # and any object that DOES still have to travel to its track fades out while it moves and back in once
        # settled (no visible zip), and isn't promoted to a solid mid-settle.
        self.assertIn("o.settleK = smooth(0.9, 0.9997, o.cg * t.cg + o.sg * t.sg) * (1 - smooth(2, 36, Math.abs(t.R - o.R)));", self.html)
        self.assertIn("* (o.settleK == null ? 1 : o.settleK)", self.html)
        self.assertIn("fadeFar > 0.05 && !o.orbitTarget) {", self.html)

    def test_adaptive_work_stride_escalates_and_relaxes(self):
        # the frame-budget governor raises the stride when frames run hot and lowers it
        # again after a sustained good streak, bounded by MAX_WORK_STRIDE.
        self.assertIn("const MAX_WORK_STRIDE = mobile ? 12 : 24", self.html)
        self.assertIn("avgCpu > 28 || avgInterval > 40", self.html)
        self.assertIn("if (state.workStride < MAX_WORK_STRIDE)", self.html)
        self.assertIn("avgCpu < 6 && avgInterval < 19", self.html)
        self.assertIn("goodReports >= 5 && state.workStride > 1", self.html)

    def test_prism_rotation_and_keys(self):
        # the data prisms rotate a true fraction-of-a-turn per activation, are keyboard
        # operable, and X / C rotate the left / right record from anywhere.
        self.assertIn("angle = 360 / faces.length", self.html)
        self.assertIn("seat(-turns * angle)", self.html)   # a true fraction-of-a-turn, re-seated each time
        self.assertIn('setupPrism("prism-obj", "Archive record")', self.html)
        self.assertIn('prismRotators["prism-obj"]?.()', self.html)
        self.assertIn('prismRotators["prism-witness"]?.()', self.html)
        self.assertIn('e.key === "Enter" || e.key === " " || e.key === "Spacebar"', self.html)

    def test_settings_is_a_real_modal(self):
        self.assertIn('role="dialog" aria-modal="true"', self.html)
        self.assertIn("for (const el of document.body.children) if (el !== settings) el.inert = on;", self.html)
        self.assertIn("settingsLastFocus = document.activeElement", self.html)
        self.assertIn("settingsLastFocus.focus()", self.html)
        # tablist roving focus + arrow navigation
        self.assertIn("el.tabIndex = active ? 0 : -1", self.html)
        self.assertIn('e.key === "ArrowRight" || e.key === "ArrowDown"', self.html)
        self.assertIn('role="tabpanel"', self.html)

    def test_reload_needs_a_confirmed_double_press(self):
        # reload only if the second R lands while the prompt is still on screen; once it
        # fades (or another toast replaces it) R re-prompts instead of reloading.
        self.assertIn("function requestReload()", self.html)
        self.assertIn("if (reloadPrompted) { location.reload(); return; }", self.html)
        self.assertIn('const RELOAD_MSG = "Press R again to reload"', self.html)
        self.assertIn("if (name !== RELOAD_MSG) reloadPrompted = false;", self.html)   # any other toast disarms
        self.assertIn("t.classList.remove(\"show\"); reloadPrompted = false;", self.html)  # fade disarms
        self.assertIn("if (k === \"r\") { requestReload(); e.preventDefault(); return; }", self.html)

    def test_tap_prefers_event_objects_and_prism_reads_as_rotation(self):
        # a rare reentry (near-absolute), then a decay or launch, wins the tap over an
        # ordinary neighbour, so the event objects worth inspecting are reachable in 34k.
        self.assertIn('const w = o.change === "reentry" ? 0.05 : (o.change === "decay" || o.change === "new") ? 0.5 : 1;', self.html)
        self.assertIn("Math.sqrt(dx * dx + dy * dy + dz * dz) * (0.6 + 0.4 * d2 / R2) * w", self.html)
        # the deep eight-face prism needs a near vanishing point or its turn flattens to a slide
        self.assertIn(".prism.eight { perspective: 900px; }", self.html)

    def test_reentry_forecasts_are_always_visible_and_findable(self):
        # The few predicted-reentry objects are pinned into the visible river (real planes
        # could hide them off-screen for the whole session), drift slowly, and read as a
        # notable presence in every lens — so the headline data is actually seen.
        self.assertIn("function pinReentryPhase(o, nid)", self.html)
        self.assertIn('if (o.meta && o.meta.change === "reentry") { o.phase = 0.44 + rand2(nid, 47) * 0.16;', self.html)
        self.assertIn('lapRate: src && src.change === "reentry" ? 1 / 2600 : iss ? 1 / 900 : 1 / LAP_BY_BAND[band]', self.html)
        self.assertIn('if (o.change === "reentry" && !re && state.lens !== 4) { size = Math.max(size, 5.0); aMul = Math.max(aMul, 2.2); }', self.html)
        self.assertIn("pinReentryPhase(o, nid);", self.html)

    def test_perf_hud_defaults_off(self):
        self.assertIn("perfVisible: false", self.html)
        self.assertIn('<div class="perf" id="perf" hidden>', self.html)
        self.assertIn("if (state.perfVisible) $(\"perf\").textContent", self.html)

    def test_witness_prism_counts_match_the_index_shape(self):
        # the four witness faces are computed from the live index: distinct nodes,
        # attestation count, distinct publication locations.
        for el in ('id="witness-nodes"', 'id="witness-attestations"', 'id="witness-sources"', 'id="witness-perm"'):
            self.assertIn(el, self.html)
        self.assertIn("const nodeIds = new Set((rec.events || []).map", self.html)
        self.assertIn("nodes: nodeIds.size || attesters", self.html)
        self.assertIn("attestations: strongest.attestationCount ?? attesters", self.html)
        self.assertIn("sources: locations.length", self.html)


class AttestationIndexContractTest(unittest.TestCase):
    """The exact fields the viewer (and om.pub pages) read from the index."""

    @classmethod
    def setUpClass(cls):
        cls.index = json.loads(INDEX.read_text(encoding="utf-8"))

    def test_chain_metadata(self):
        self.assertTrue(
            re.fullmatch(r"0x[0-9a-fA-F]{40}", self.index["contractAddress"])
        )
        self.assertIsInstance(self.index["chainId"], int)
        self.assertGreaterEqual(self.index["docRefCount"], 1)

    def test_docref_entries_carry_what_the_viewer_parses(self):
        refs = self.index["docRefs"]
        self.assertEqual(len(refs), self.index["docRefCount"])
        for ref, rec in refs.items():
            self.assertRegex(rec["date"], r"^\d{4}-\d{2}-\d{2}$", ref)
            groups = rec.get("agreementGroups")
            self.assertTrue(groups, f"{ref} has no agreement groups")
            for group in groups:
                self.assertIn("blockHash", group)
                self.assertIn("combinedSupportTdh", group)
                self.assertIsInstance(group.get("attesters"), list)
            self.assertTrue(rec.get("blockHashes"), ref)

    def test_dates_are_contiguous_daily(self):
        from datetime import date, timedelta

        dates = sorted(
            date.fromisoformat(rec["date"])
            for rec in self.index["docRefs"].values()
        )
        for previous, current in zip(dates, dates[1:]):
            self.assertEqual(
                current - previous, timedelta(days=1),
                f"gap between {previous} and {current}",
            )


class CardLeanIndexTest(unittest.TestCase):
    """The card boots to the latest day from the lean Tier-1 index, served by a ranked
    fall-through list of nodes, with honest status and a localStorage chunk cache."""

    @classmethod
    def setUpClass(cls):
        cls.html = CARD.read_text(encoding="utf-8")

    def test_boots_to_latest_day_not_a_fixed_anchor(self):
        # opens on "now": the cursor snaps to the last witnessed day unless the visitor flew
        self.assertIn("const li = Math.max(0, witnessDates.length - 1); state.cursor = li;", self.html)

    def test_fetches_lean_index_manifest_and_year_chunk(self):
        self.assertIn("async function loadIndex()", self.html)
        self.assertIn("async function loadIndexChunk(year, meta)", self.html)
        self.assertIn('manifest: (n) => rawUrl(n, n.node, "index/manifest.json")', self.html)
        self.assertIn("chunk: (n, y) => rawUrl(n, n.node, `index/${y}.json`)", self.html)
        self.assertIn("m.latestEntry", self.html)            # inlined head aggregate → exact first frame
        self.assertIn("const ledgerFromIndex = (e) =>", self.html)

    def test_year_chunk_is_cached_in_localstorage_and_hash_validated(self):
        self.assertIn("const key = IDX_CACHE_PREFIX + year", self.html)
        self.assertIn("c.sha === want", self.html)           # validated by the manifest content hash
        self.assertIn("localStorage.setItem(IDX_CACHE_PREFIX + year, value)", self.html)   # LRU-bounded persist

    def test_every_fetch_walks_ranked_nodes_with_ledger_fallback(self):
        self.assertIn("async function fromNodes(urlOf", self.html)
        self.assertIn("for (const n of state.nodes)", self.html)
        self.assertIn("const idx = await loadIndex();", self.html)
        self.assertIn("if (!idx) await loadLedger();", self.html)   # legacy ledger only when a node lags

    def test_status_is_honest_on_bundle_failure(self):
        # never claims "Live record" when the bundle fetch failed; the aggregates stay live, shown
        # as the "Summary only" state (amber)
        self.assertIn('setStatus("offline", state.liveNode ? "Summary only" : "No live source")', self.html)
        self.assertIn(".status-light.offline", self.html)
        self.assertNotIn("Aggregates live · bundle offline", self.html)   # old awkward wording is gone

    def test_status_states_carry_plain_language_tooltips(self):
        # every status word is self-explaining via a hover/focus/tap tooltip + an aria-label
        self.assertIn("const STATUS_TIP =", self.html)
        for label in ("Summary only", "Live record · verified", "No live source", "Downloading archive"):
            self.assertIn(f'"{label}":', self.html)                       # each state has a tip
        self.assertIn('el.setAttribute("data-tip", tip)', self.html)
        self.assertIn('el.setAttribute("aria-label"', self.html)          # screen-reader description
        self.assertIn('<div class="status" id="status" tabindex="0" role="status"', self.html)
        self.assertIn(".status[data-tip]", self.html)                     # styled tooltip on the status

    def test_content_schema_defaults_to_constant_for_lean_index_days(self):
        # the lean index omits the constant schema; the card defaults it so the fingerprint face
        # shows the real schema name, not the generic "core" label
        self.assertIn('const CONTENT_SCHEMA = "rso-core-v1";', self.html)
        self.assertIn("r.content_schema || CONTENT_SCHEMA", self.html)

    def test_annotation_summary_is_consumed_for_instant_legend(self):
        # directory / TIP / decay counts seed from the index aggregate so lens 4 is instant
        self.assertIn("function seedAnnoSummary(date, s)", self.html)
        self.assertIn("seedAnnoSummary(m.latestEntry.date, m.latestEntry.anno_summary)", self.html)

    def test_review_dead_code_removed(self):
        for token in ("raw.delta_summary", "raw.decayed_count", ".readout-block", "fetchJson("):
            self.assertNotIn(token, self.html)


class CardNodeRankTest(unittest.TestCase):
    """The 'index source' setting is a draggable stack-rank of backing nodes: the top one
    serves and any failure falls through. The network's roster extends the list."""

    @classmethod
    def setUpClass(cls):
        cls.html = CARD.read_text(encoding="utf-8")

    def test_default_nodes_lead_with_ompub_and_slider_is_gone(self):
        self.assertIn('{ id: "ompub",', self.html)
        self.assertIn('{ id: "brookr",', self.html)
        self.assertIn('<ol class="node-rank" id="node-rank"', self.html)
        self.assertNotIn('id="set-op"', self.html)
        self.assertNotIn("OP_SOURCES", self.html)

    def test_rank_is_draggable_and_keyboard_movable(self):
        self.assertIn("function renderNodeRank()", self.html)
        self.assertIn("function moveNode(from, to)", self.html)
        self.assertIn('ol.addEventListener("pointerdown"', self.html)
        self.assertIn('ol.addEventListener("pointermove"', self.html)
        self.assertIn("node-mv", self.html)                  # the ▲▼ keyboard / touch fallback

    def test_reorder_repulls_from_the_new_head(self):
        self.assertIn("async function refreshFromNodes()", self.html)
        self.assertIn("nodeOrderManual = true; renderNodeRank(); persistSettings(); scheduleRefresh();", self.html)

    def test_order_persists_and_roster_extends_the_list(self):
        self.assertIn('localStorage.setItem("rso-node-order"', self.html)
        self.assertIn("function applyNodeOrder(order)", self.html)
        self.assertIn("async function loadRoster()", self.html)
        self.assertIn('roster: (n) => rawUrl(n, n.idx, "indexer/generated/nodes.json")', self.html)

    def test_default_rank_is_by_tdh(self):
        # nodes default-sort by on-chain TDH backing (custom-first, then TDH desc), derived from
        # the attestation index's per-node nodeBackingTdh; a manual drag overrides + persists
        self.assertIn("const tdhOf = ", self.html)
        self.assertIn("const nodesByTdh = ", self.html)
        self.assertIn("function autoRankByTdh()", self.html)
        self.assertIn("nodeBackingTdh", self.html)            # honest TDH from the attestation events
        self.assertIn("let nodeOrderManual = false", self.html)
        self.assertIn("else { state.nodes = nodesByTdh(); }", self.html)   # TDH is the default
        self.assertIn('id="node-rank-reset"', self.html)      # reset back to TDH rank
        self.assertIn("function resetNodeRank()", self.html)

    def test_visitor_can_add_an_arbitrary_node(self):
        self.assertIn('id="node-add"', self.html)
        self.assertIn("function addCustomNode(", self.html)
        self.assertIn("function removeCustomNode(", self.html)
        self.assertIn("function parseNodeInput(", self.html)
        self.assertIn('localStorage.setItem("rso-custom-nodes"', self.html)  # custom nodes persist
        self.assertIn("state.nodes.unshift(node)", self.html)               # your node serves first

    def test_node_definitions_are_sanitized_json_only_no_eval(self):
        # social-engineering hardening: a hostile roster / pasted node can only ever add a
        # github.com/<owner>/<repo> fetch target — validated by regex, never eval'd, capped.
        self.assertIn("function sanitizeNode(", self.html)
        self.assertIn("const REPO_RE = ", self.html)
        self.assertIn("const MAX_NODES =", self.html)
        self.assertIn("const n = sanitizeNode(r);", self.html)  # roster entries re-validated on ingest
        self.assertIn("sanitizeNode(c, { custom: true })", self.html)  # stored custom nodes re-validated
        # never evaluate fetched/stored content
        for forbidden in ("eval(", "new Function", "document.write", 'setTimeout("'):
            self.assertNotIn(forbidden, self.html)
        # the only fetch host is GitHub raw — no node field interpolates a scheme/host
        self.assertIn("`https://raw.githubusercontent.com/${n.repo}/${branch}/${path}`", self.html)

    def test_locators_from_node_json_are_host_allowlisted(self):
        # catalog_url + signed Arweave mirrors come from node-served JSON (not built by rawUrl), so
        # they pass a host allowlist (https + raw.githubusercontent.com / arweave gateways) before fetch
        self.assertIn("const safeLocator = ", self.html)
        self.assertIn('LOCATOR_HOSTS = new Set(["raw.githubusercontent.com", "arweave.net", "arweave.dev"])', self.html)
        self.assertIn("safeLocator(led.raw.catalog_url)", self.html)         # index/ledger locator gated
        self.assertIn("locations.map(safeLocator).filter(Boolean)", self.html)  # attestation mirrors gated
        self.assertNotIn('/^ar:\\/\\/|arweave', self.html)                   # the old unanchored-substring regex is gone

    def test_local_dev_source_is_private_host_only_and_never_persisted(self):
        # ?source=http://192.168.x.x:port adds a top-priority LOCAL source for the session, to test a
        # node before deploying. It is gated to private/loopback hosts, never persisted/exported, and
        # never comes from a roster or paste — so it can't be weaponised to make a browser probe hosts.
        self.assertIn("function isPrivateHost(h)", self.html)
        self.assertIn('return a === 127 || a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31) || (a === 169 && b === 254);', self.html)
        self.assertIn("function devSourceNode()", self.html)
        self.assertIn('new URLSearchParams(location.search).get("source")', self.html)
        self.assertIn("if ((u.protocol !== \"http:\" && u.protocol !== \"https:\") || !isPrivateHost(u.hostname)) return null;", self.html)
        self.assertIn("if (devNode) { state.nodes = [devNode];", self.html)          # SOLE node: a local ?source is authoritative (full-span ledger drives the timeline, not a node's live-only index)
        # rawUrl + safeLocator honour the local base/origin (http allowed for the private host)
        self.assertIn("n.base ? `${n.base}/${path}` : `https://raw.githubusercontent.com/", self.html)
        self.assertIn("if (DEV_ORIGIN && x.origin === DEV_ORIGIN) return x.href;", self.html)
        # never persisted into the saved node order, always sorted to the head
        self.assertIn("state.nodes.filter((n) => !n.local).map((n) => n.id)", self.html)
        self.assertIn("(b.local ? 1 : 0) - (a.local ? 1 : 0)", self.html)

    def test_downloads_are_byte_capped_against_bombs(self):
        # a hostile node can't OOM the tab: decompression and every body read are capped
        self.assertIn("const MAX_CATALOG_BYTES =", self.html)
        self.assertIn("async function readCapped(res, max)", self.html)
        self.assertIn("total > MAX_CATALOG_BYTES", self.html)                # gunzip stops past the cap
        self.assertNotIn('return new Response(s).arrayBuffer();', self.html) # old uncapped gunzip gone
        self.assertIn("readCapped(g.res, MAX_JSON_BYTES)", self.html)        # node JSON capped before parse
        self.assertIn("readCapped(r, MAX_GZ_BYTES)", self.html)              # catalog bytes capped
        self.assertIn("MAX_CHUNK_DAYS", self.html)                          # year-chunk entry count bounded

    def test_rerank_is_debounced_and_tdh_key_is_node_backing_only(self):
        self.assertIn("function scheduleRefresh()", self.html)
        self.assertIn("refreshTimer = setTimeout(", self.html)
        self.assertIn("if (seq !== refreshSeq) return;", self.html)          # superseded re-ranks drop out
        self.assertIn("const t = +e.nodeBackingTdh || 0;", self.html)        # group combinedSupportTdh not mis-attributed
        # add/remove must NOT latch a manual order (only an explicit drag does)
        self.assertNotIn("state.nodes.unshift(node);\n      nodeOrderManual = true;", self.html)


if __name__ == "__main__":
    unittest.main()
