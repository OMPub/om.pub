#!/usr/bin/env python3
"""Build the marketplace-embed test matrix for the RSO Archive card.

Generates embed-matrix/ (git-ignored, dev tooling): one copy of the REAL mint artifact
(index.standalone.html) per marketplace-like context, plus a dashboard that embeds them all and
shows a live pass/fail readout. The point: prove the card never comes up BLANK in the iframe
sandbox + CSP combinations that real marketplaces and gateways impose.

Each variant is the standalone build with two injections:
  • an optional <meta http-equiv="Content-Security-Policy"> — simulating a server-imposed CSP
    (for script-src / worker-src / connect-src enforcement a meta policy behaves like the header);
  • a small PROBE (inline classic script, so it lives under the same CSP as the card itself) that
    posts a heartbeat to the parent: THREE loaded? card booted? object count? status label? any
    uncaught errors? and — the good part — every `securitypolicyviolation` event, so the dashboard
    shows exactly which policy rule fired (e.g. worker-src blocking the blob worker → the card must
    then be running on the synchronous fallback).

The dashboard (embed-matrix/index.html) embeds each variant with the marketplace-accurate iframe
`sandbox` attribute, listens for heartbeats, and grades each cell against its expectation. One
variant ("inline-blocked") is EXPECTED to stay blank — no single-file HTML NFT can run under
script-src 'none'; its pass condition is inverted (no heartbeat = correctly documented limit).

Usage:  python3 build-standalone.py && python3 build-embed-matrix.py
        python3 -m http.server 5599  →  http://localhost:5599/embed-matrix/
Serve the same directory on a SECOND port (e.g. 8780) for the true cross-origin variant.
"""
import base64
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
STANDALONE = HERE / "index.standalone.html"
OUT = HERE / "embed-matrix"

# ── the variants ──────────────────────────────────────────────────────────
# sandbox: the iframe sandbox attribute (None = unsandboxed).
# csp:     a CSP injected INTO the child document (None = none imposed).
# expect:  "render" (heartbeat + THREE + card must appear) or "blank" (no heartbeat expected).
# Sources for the sandbox strings: seize.io SandboxedExternalIframe (allow-scripts only),
# BeyondNFT/sandbox Viewer.svelte, Zora's docs-published embed, plus policy shapes from the
# 2026-07-01 marketplace-CSP research (OpenSea re-hosts under a CSP the creator can't see).
VARIANTS = [
    {
        "name": "baseline-tab",
        "label": "Direct gateway tab (no sandbox, no CSP)",
        "note": "arweave.net / ipfs.io serve NFT HTML with no CSP — the plain-browser-tab path.",
        "sandbox": None, "csp": None, "expect": "render",
    },
    {
        "name": "seize-io",
        "label": 'seize.io — sandbox="allow-scripts", no CSP',
        "note": "Matches seize.io's SandboxedExternalIframe: opaque origin, scripts allowed, no injected CSP.",
        "sandbox": "allow-scripts", "csp": None, "expect": "render",
    },
    {
        "name": "beyondnft-srcdoc",
        "label": "srcdoc embedder (BeyondNFT-style sandbox)",
        "note": "srcdoc + allow-scripts allow-pointer-lock allow-popups allow-downloads; opaque origin. "
                "A srcdoc document also INHERITS the parent page's CSP — the dashboard itself sets none.",
        "sandbox": "allow-scripts allow-pointer-lock allow-popups allow-downloads",
        "csp": None, "expect": "render", "srcdoc": True,
    },
    {
        "name": "zora-like",
        "label": "Zora-like — allow-same-origin + CSP permitting blob:",
        "note": "sandbox per Zora docs; child CSP allows blob: in script/worker (zora.co's production CSP does).",
        "sandbox": "allow-pointer-lock allow-same-origin allow-scripts allow-popups",
        "csp": "default-src 'self' blob: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; "
               "worker-src blob:; connect-src *; img-src * data: blob:; style-src 'unsafe-inline'; font-src * data:",
        "expect": "render",
    },
    {
        "name": "worker-blocked",
        "label": "CSP allows blob: scripts but worker-src 'none'",
        "note": "The one policy shape that kills ONLY the worker. The card must render via the "
                "non-freezing synchronous fallback; expect a worker-src violation event as proof.",
        "sandbox": "allow-scripts",
        "csp": "script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src 'none'; connect-src *; "
               "img-src * data: blob:; style-src 'unsafe-inline'; font-src * data:",
        "expect": "render",
    },
    {
        "name": "no-blob-strict",
        "label": "Strict CSP — NO blob: anywhere (OpenSea-class re-host)",
        "note": "Before the classic-script three.js inline (2e23df2) this variant was a BLANK CARD "
                "(blob three import blocked). Now three runs inline; only the worker is blocked.",
        "sandbox": "allow-scripts",
        "csp": "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; connect-src *; "
               "img-src data:; style-src 'unsafe-inline'; font-src data:",
        "expect": "render",
    },
    {
        "name": "no-network",
        "label": "CSP blocks ALL network (connect-src 'none')",
        "note": "No catalog can load. The card must still render its placeholder river with the "
                "honest 'No live source' state — degraded, never blank.",
        "sandbox": "allow-scripts",
        "csp": "script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'; "
               "img-src data: blob:; style-src 'unsafe-inline'; font-src data:",
        "expect": "render",
    },
    {
        "name": "cross-origin",
        "label": "True cross-origin embed (second port) + allow-same-origin",
        "note": "iframe src on http://localhost:8791 while the dashboard runs on :5599 — a real "
                "cross-origin marketplace embed. Needs the card dir served on 8791.",
        "sandbox": "allow-scripts allow-same-origin",
        "csp": None, "expect": "render", "cross_origin_port": 8791,
    },
    {
        "name": "data-uri",
        "label": "data: URI iframe — EXPECTED BLANK in Chromium (URL cap)",
        "note": "The 2.3 MB artifact is ~3.1 MB as base64 — over Chromium's 2 MB URL limit, so the "
                "iframe navigation silently no-ops. A platform embedding on-chain HTML must use "
                "srcdoc (see the srcdoc cell, which passes) or a real URL. Firefox's higher cap would render this.",
        "sandbox": "allow-scripts", "csp": None, "expect": "blank", "data_uri": True,
        "blank_reason": "no heartbeat — artifact exceeds Chromium's 2 MB data:-URL cap (use srcdoc or a URL for on-chain embeds)",
    },
    {
        "name": "inline-blocked",
        "label": "script-src 'none' — EXPECTED BLANK (documented limit)",
        "note": "No inline script may run, so NO single-file HTML NFT can render here (2022-era "
                "OpenSea cached files did this). Pass condition inverted: silence is correct.",
        "sandbox": "allow-scripts",
        "csp": "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'",
        "expect": "blank",
    },
]

PROBE = """<script>
/* embed-matrix probe — dev tooling only, injected by build-embed-matrix.py (never in the mint). */
(function () {
  var V = "@VARIANT@";
  var errors = [], violations = [], rafTicks = 0, t0 = Date.now();
  window.addEventListener("error", function (e) { errors.push(String((e.error && e.error.stack) || e.message || e.type).slice(0, 400)); });
  window.addEventListener("unhandledrejection", function (e) { errors.push("rejection: " + String((e.reason && e.reason.message) || e.reason).slice(0, 180)); });
  document.addEventListener("securitypolicyviolation", function (e) {
    var v = e.effectiveDirective + " blocked " + (e.blockedURI || "inline");
    if (violations.indexOf(v) < 0) violations.push(v);
  });
  (function raf() { rafTicks++; requestAnimationFrame(raf); })();
  setInterval(function () {
    var C = window.__RSO_CARD__ || null, statusEl = document.getElementById("status-label");
    var canvas = document.querySelector("#scene");
    var report = {
      __rsoProbe: V, upMs: Date.now() - t0,
      threeInline: !!window.__THREE_INLINE__,
      cardReady: !!C,
      objs: C ? C.state.objects.length : -1,
      day: C ? C.state.catalogDate : null,
      statusLabel: statusEl ? statusEl.textContent : null,
      canvas: !!canvas, rafTicks: rafTicks,
      errors: errors.slice(0, 6), violations: violations.slice(0, 8),
    };
    try { parent.postMessage(report, "*"); } catch (e) {}
  }, 800);
})();
</script>"""

CHARSET_MARK = '<meta charset="utf-8">'


def build_variant(html, v):
    inject = ""
    if v.get("csp"):
        inject += '\n  <meta http-equiv="Content-Security-Policy" content="' + v["csp"] + '">'
    inject += "\n  " + PROBE.replace("@VARIANT@", v["name"])
    assert CHARSET_MARK in html, "charset meta not found in standalone"
    return html.replace(CHARSET_MARK, CHARSET_MARK + inject, 1)


def dashboard(variants):
    VER = int(STANDALONE.stat().st_mtime)   # cache-buster: forces the browser to refetch variants after every rebuild
    cells = []
    for v in variants:
        sandbox = f' sandbox="{v["sandbox"]}"' if v["sandbox"] else ""
        if v.get("data_uri"):
            src_attr = f'data-datauri="variant-{v["name"]}.html?v={VER}"'
        elif v.get("srcdoc"):
            src_attr = f'data-srcdoc="variant-{v["name"]}.html?v={VER}"'
        elif v.get("cross_origin_port"):
            src_attr = f'src="http://localhost:{v["cross_origin_port"]}/embed-matrix/variant-{v["name"]}.html?v={VER}"'
        else:
            src_attr = f'src="variant-{v["name"]}.html?v={VER}"'
        blank_reason = v.get("blank_reason", "no heartbeat — inline script correctly blocked (no HTML NFT can run here)")
        cells.append(f"""
    <div class="cell" id="cell-{v['name']}" data-expect="{v['expect']}" data-blankreason="{blank_reason}">
      <div class="head">
        <span class="grade" id="grade-{v['name']}">…</span>
        <b>{v['label']}</b>
      </div>
      <div class="note">{v['note']}</div>
      <div class="stat" id="stat-{v['name']}">waiting for first heartbeat…</div>
      <iframe {src_attr}{sandbox} loading="eager" title="{v['name']}"></iframe>
    </div>""")
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>RSO Archive — marketplace embed matrix (dev tooling)</title>
<style>
  body {{ background: #06090a; color: #e8f0ee; font: 13px/1.45 ui-monospace, Menlo, monospace; margin: 18px; }}
  h1 {{ font-size: 16px; }} .sub {{ color: #8a9b98; max-width: 72em; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(430px, 1fr)); gap: 14px; margin-top: 14px; }}
  .cell {{ border: 1px solid #22312e; border-radius: 8px; padding: 10px; background: #0a0f10; }}
  .cell iframe {{ width: 100%; height: 280px; border: 1px solid #1a2422; border-radius: 4px; background: #000; margin-top: 8px; }}
  .head b {{ font-weight: 600; }}
  .note {{ color: #71837f; font-size: 11.5px; margin-top: 3px; }}
  .stat {{ margin-top: 6px; font-size: 11.5px; color: #a9bab6; white-space: pre-wrap; }}
  .grade {{ display: inline-block; min-width: 52px; text-align: center; border-radius: 4px; padding: 1px 7px; margin-right: 7px; background: #223; }}
  .grade.pass {{ background: #0c3a26; color: #7dffc0; }} .grade.fail {{ background: #47101d; color: #ff8fa3; }}
  .grade.warn {{ background: #4a3a10; color: #ffd97d; }}
</style>
</head>
<body>
<h1>RSO Archive — marketplace embed matrix</h1>
<p class="sub">Each cell embeds the REAL mint artifact (index.standalone.html) under a marketplace-accurate iframe
sandbox and, where noted, a simulated server-imposed CSP. A probe inside each copy heartbeats boot state and CSP
violations back here. Every cell must render (placeholder or live record) — except "inline-blocked", which documents
the one policy no single-file HTML NFT can survive. Data loads from the card's real production nodes.</p>
<div class="grid">{''.join(cells)}</div>
<script>
const seen = Object.create(null);
window.addEventListener("message", (e) => {{
  const d = e.data; if (!d || !d.__rsoProbe) return;
  const v = d.__rsoProbe; seen[v] = d;
  const stat = document.getElementById("stat-" + v), grade = document.getElementById("grade-" + v);
  const cell = document.getElementById("cell-" + v); if (!stat || !cell) return;
  const ok = d.threeInline && d.cardReady && d.errors.length === 0;
  const dataOk = d.objs > 0 || (d.statusLabel && d.statusLabel.length);
  stat.textContent =
    "THREE " + (d.threeInline ? "ok" : "MISSING") + " · card " + (d.cardReady ? "ok" : "MISSING") +
    " · objs " + d.objs + (d.day ? " · " + d.day : "") +
    " · status: " + (d.statusLabel || "—") + " · raf " + d.rafTicks +
    (d.violations.length ? "\\nCSP: " + d.violations.join(" | ") : "") +
    (d.errors.length ? "\\nERRORS: " + d.errors.join(" | ") : "");
  if (cell.dataset.expect === "blank") {{ grade.textContent = "UNEXPECTED"; grade.className = "grade fail"; return; }}
  grade.textContent = ok && dataOk ? "PASS" : ok ? "BOOTING" : "FAIL";
  grade.className = "grade " + (ok && dataOk ? "pass" : ok ? "warn" : "fail");
}});
// blank-expected cells: silence for 20s = correct
setTimeout(() => {{
  document.querySelectorAll('.cell[data-expect="blank"]').forEach((cell) => {{
    const v = cell.id.slice(5);
    if (!seen[v]) {{
      document.getElementById("grade-" + v).textContent = "BLANK ✓";
      document.getElementById("grade-" + v).className = "grade pass";
      document.getElementById("stat-" + v).textContent = cell.dataset.blankreason;
    }}
  }});
  document.querySelectorAll('.cell[data-expect="render"]').forEach((cell) => {{
    const v = cell.id.slice(5);
    if (!seen[v]) {{
      document.getElementById("grade-" + v).textContent = "SILENT";
      document.getElementById("grade-" + v).className = "grade fail";
      document.getElementById("stat-" + v).textContent = "no heartbeat after 20s — investigate (blank card?)";
    }}
  }});
}}, 20000);
// srcdoc + data: variants load their document text at runtime (no attribute-escaping games)
document.querySelectorAll("iframe[data-srcdoc]").forEach(async (f) => {{
  const r = await fetch(f.dataset.srcdoc); f.srcdoc = await r.text();
}});
document.querySelectorAll("iframe[data-datauri]").forEach(async (f) => {{
  const r = await fetch(f.dataset.datauri); const t = await r.text();
  const b64 = await new Promise((res) => {{ const rd = new FileReader(); rd.onload = () => res(rd.result.split(",")[1]); rd.readAsDataURL(new Blob([t], {{ type: "text/html" }})); }});
  f.src = "data:text/html;base64," + b64;
}});
</script>
</body>
</html>"""


def main():
    if not STANDALONE.is_file():
        raise SystemExit("index.standalone.html missing — run build-standalone.py first")
    html = STANDALONE.read_text()
    OUT.mkdir(exist_ok=True)
    for v in VARIANTS:
        (OUT / f"variant-{v['name']}.html").write_text(build_variant(html, v))
    (OUT / "index.html").write_text(dashboard(VARIANTS))
    sizes = sum(f.stat().st_size for f in OUT.iterdir())
    print(f"wrote {len(VARIANTS)} variants + dashboard to {OUT}  ({sizes/1e6:.1f} MB, git-ignored)")
    print("open:  http://localhost:5599/embed-matrix/   (serve this dir on :8791 too for the cross-origin cell)")


if __name__ == "__main__":
    main()
