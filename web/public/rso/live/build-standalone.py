#!/usr/bin/env python3
"""Build a fully self-contained RSO Archive card for minting.

The dev `index.html` imports the vendored Three.js relative to its mount point (two ES modules:
three.module.js -> three.core.js). That works on a single host but is two extra fetches and
depends on the files staying co-located. For a permanent NFT we want ONE file with zero
external CODE dependencies, that renders from any Arweave/IPFS gateway or sandboxed iframe.

Three.js is inlined as a PLAIN CLASSIC <script> (a pre-built IIFE that assigns the namespace to
window.__THREE_INLINE__), NOT as a blob-imported module. Why: an inline classic script is
governed by the same CSP allowance the card's own inline module script already requires
('unsafe-inline' or equivalent), so it adds NO new policy dependency — whereas a blob: import
requires blob: in script-src, an EXTRA lever a hostile/unknown marketplace CSP can omit. After
this build, blob: is only used for the optional catalog worker (which has a synchronous
fallback); three.js — the render-or-blank dependency — needs nothing beyond inline script.

The IIFE is generated deterministically from the two vendored ES modules (no bundler):
  • three.core.js has no imports and ONE trailing `export {...};` — its body is included
    verbatim, and the module chunk's re-export list is read off that core scope.
  • three.module.js has ONE `import {...} from './three.core.js'` (satisfied by the core
    declarations already in the enclosing scope, so the statement is simply dropped), ONE
    `export {...} from './three.core.js'` (the re-export list), and ONE trailing
    `export {...};` (its own names). Its body runs inside an inner closure so its internal
    helpers can never collide with core's.
  • The returned namespace = re-export list + own list — exactly what
    `import * as THREE from './three.module.js'` yields. ES modules are always strict, so the
    "use strict" IIFEs preserve semantics. Any unexpected structural drift in a future three.js
    (aliases, extra imports, name collisions) fails the build loudly, never silently.

The per-day catalog DATA is intentionally NOT inlined: the .html is the frozen art; the
Arweave/GitHub catalogs are the live archive feed (loaded at runtime).

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

MARK = "  <script type=\"module\">"   # the app's module script; the inline block goes right before it
NS = "__THREE_INLINE__"               # must not appear in the three.js sources (asserted below)

EXPORT_LIST = re.compile(r"^export\s*\{([^}]*)\}\s*;?\s*$", re.MULTILINE)
EXPORT_FROM = re.compile(r"^export\s*\{([^}]*)\}\s*from\s*['\"]\./three\.core\.js['\"]\s*;?\s*$", re.MULTILINE)
IMPORT_FROM = re.compile(r"^import\s*\{[^}]*\}\s*from\s*['\"]\./three\.core\.js['\"]\s*;?\s*$", re.MULTILINE)


def names(list_src: str) -> list:
    out = [n.strip() for n in list_src.split(",") if n.strip()]
    for n in out:
        if not n.isidentifier():
            raise SystemExit(f"unexpected export entry {n!r} (aliases/strings unsupported — three.js layout changed?)")
    return out


def strip_one(pattern: re.Pattern, src: str, what: str) -> tuple:
    """Remove exactly one match of `pattern` from `src`, returning (stripped, captured-name-list)."""
    ms = list(pattern.finditer(src))
    if len(ms) != 1:
        raise SystemExit(f"expected exactly 1 {what}, found {len(ms)} — three.js layout changed, refusing to build")
    m = ms[0]
    return src[: m.start()] + src[m.end():], names(m.group(1))


def build_three_iife() -> str:
    core, module = CORE.read_text(), MODULE.read_text()
    if NS in core or NS in module:
        raise SystemExit(f"{NS} appears in three.js source — pick another namespace name")
    for src, label in ((core, "three.core.js"), (module, "three.module.js")):
        if re.search(r"import\.meta|import\(", src):
            raise SystemExit(f"{label} uses import.meta/dynamic import — transform no longer valid")
    # module first: pull its re-export-from list, drop its import (both resolve against core's scope)
    module, reexports = strip_one(EXPORT_FROM, module, "export..from in three.module.js")
    module = IMPORT_FROM.sub("", module, count=1)
    if IMPORT_FROM.search(module):
        raise SystemExit("multiple core imports in three.module.js — layout changed")
    module, own = strip_one(EXPORT_LIST, module, "trailing export in three.module.js")
    core, core_exports = strip_one(EXPORT_LIST, core, "trailing export in three.core.js")
    missing = [n for n in reexports if n not in set(core_exports)]
    if missing:
        raise SystemExit(f"module re-exports names core does not export: {missing[:5]}...")
    dup = set(reexports) & set(own)
    if dup:
        raise SystemExit(f"names exported by both chunks: {sorted(dup)[:5]}...")
    return (
        f"var {NS} = (function () {{\n\"use strict\";\n"
        + core
        + f"\nconst __ns = {{ {', '.join(reexports)} }};\n"
        + "(function () {\n\"use strict\";\n"
        + module
        + f"\nObject.assign(__ns, {{ {', '.join(own)} }});\n}})();\nreturn __ns;\n}})();\n"
    )


def build() -> str:
    html = SRC.read_text()
    if MARK not in html:
        raise SystemExit("could not find the app module <script> insertion point")
    if f"var {NS}" in html:
        raise SystemExit("index.html already appears to contain inline three.js — refusing to double-inline")
    js = build_three_iife()
    # </script (any case) inside JS would close the block early in the HTML parser. Neutralise it as
    # <\/script — identical in every JS context it can legally appear in (string, regex, comment).
    js = re.sub(r"</script", r"<\\/script", js, flags=re.IGNORECASE)
    block = (
        "  <!-- Inlined Three.js (build-standalone.py) — a plain classic script, self-contained: no external\n"
        "       code fetch AND no blob:/import() dependency, so it runs under any CSP that lets this file's\n"
        "       own inline script run at all. -->\n"
        f"  <script>\n{js}\n  </script>\n"
    )
    return html.replace(MARK, block + MARK, 1)


def verify(out_html: str) -> list:
    problems = []
    # The inline namespace must be present — loadThree() then takes the inline branch and the
    # ./three.module.js dev fallback is never reached (it stays as guarded, unreachable code).
    if f"var {NS} = (function () {{" not in out_html:
        problems.append("inline three.js IIFE missing")
    if f"if (window.{NS}) return window.{NS};" not in out_html:
        problems.append("loadThree() does not prefer the inline namespace")
    # No blob-import of three may remain anywhere (the worker's blob is separate and optional).
    if "three-core-src" in out_html or "three-module-src" in out_html:
        problems.append("old text/plain blob-import machinery still present")
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
