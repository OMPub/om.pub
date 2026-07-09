#!/usr/bin/env python3
"""Build a fully self-contained RSO Archive card for minting.

The dev `index.html` imports the vendored Three.js relative to its mount point (two files:
three.module.js -> three.core.js). That works on a single host but is two extra fetches and
depends on the files staying co-located. For a permanent NFT we want ONE file with zero
external CODE dependencies, that renders from any Arweave/IPFS gateway or sandboxed iframe.

This inlines both Three.js files into non-executing <script type="text/plain"> blocks. At
runtime loadThree() (in index.html) blob-imports them, rewriting the module's internal
./three.core.js specifier to the core blob URL — so the THREE namespace is identical and
nothing is fetched. The per-day catalog DATA is intentionally NOT inlined: the .html is the
frozen art; the Arweave/GitHub catalogs are the live archive feed (loaded at runtime).

Usage:  python3 build-standalone.py            # -> index.standalone.html
        python3 build-standalone.py --check    # verify only, no write
"""
import re
import sys
import gzip
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "index.html"
CORE = HERE / "three.core.js"
MODULE = HERE / "three.module.js"
OUT = HERE / "index.standalone.html"

MARK = "  <script type=\"module\">"   # the app's module script; inline blocks go right before it


def text_plain_block(elem_id: str, js: str) -> str:
    # </script (any case) inside JS would close the text/plain block early in the HTML parser.
    # Neutralise it as <\/script — valid in every JS context it can legally appear in (string,
    # regex, comment) and recovered verbatim by .textContent at runtime.
    safe = re.sub(r"</script", r"<\\/script", js, flags=re.IGNORECASE)
    return f'<script type="text/plain" id="{elem_id}">\n{safe}\n</script>\n'


def build() -> str:
    html = SRC.read_text()
    if MARK not in html:
        raise SystemExit("could not find the app module <script> insertion point")
    if 'id="three-core-src"' in html:
        raise SystemExit("index.html already appears to contain inline three.js — refusing to double-inline")
    blocks = (
        "  <!-- Inlined Three.js (build-standalone.py) — self-contained, no external code fetch. -->\n  "
        + text_plain_block("three-core-src", CORE.read_text()).replace("\n", "\n  ").rstrip() + "\n  "
        + text_plain_block("three-module-src", MODULE.read_text()).replace("\n", "\n  ").rstrip() + "\n"
    )
    return html.replace(MARK, blocks + MARK, 1)


def verify(out_html: str) -> list:
    problems = []
    # The inline blocks must be present — loadThree() then takes the inline branch and the
    # ./three.module.js dev fallback is never reached (it stays as guarded, unreachable code).
    if 'id="three-core-src"' not in out_html or 'id="three-module-src"' not in out_html:
        problems.append("inline three.js blocks missing")
    # No external CODE refs that would actually fetch: no <script src>, no external stylesheet <link>.
    if re.search(r"<script[^>]+\bsrc=", out_html):
        problems.append("a <script src=...> remains (external code)")
    if re.search(r"<link[^>]+stylesheet", out_html, re.IGNORECASE):
        problems.append("an external stylesheet <link> is present")
    return problems


def main():
    check_only = "--check" in sys.argv
    out_html = build()
    problems = verify(out_html)
    raw = len(out_html.encode())
    gz = len(gzip.compress(out_html.encode(), 9))
    print(f"index.html        {SRC.stat().st_size:>10,} B")
    print(f"three.core.js     {CORE.stat().st_size:>10,} B")
    print(f"three.module.js   {MODULE.stat().st_size:>10,} B")
    print(f"standalone (raw)  {raw:>10,} B")
    print(f"standalone (gzip) {gz:>10,} B  ({gz/1024:.0f} KB over the wire)")
    if problems:
        print("FAIL — not self-contained:")
        for p in problems:
            print("  •", p)
        raise SystemExit(1)
    print("OK — zero external code dependencies (catalog DATA still fetched at runtime by design)")
    if not check_only:
        OUT.write_text(out_html)
        print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
