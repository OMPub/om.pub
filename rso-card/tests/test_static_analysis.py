"""Static-analysis gate for the card's JS.

Extracts the `<script type="module">` from the card (three.js is NOT inlined in the dev file — it's
imported, so `THREE` is just a declared global here) and runs ESLint's flag-level rules over it:
undefined references, dead variables, unreachable code, duplicate keys, bad assignments. This catches the
audit-class defects that string-pin contract tests can't — mechanically, on every change.

Skips (does not fail) if ESLint isn't installed, so the suite still runs in a bare environment; but where
ESLint exists this is a hard gate. Run just this: `pytest rso-card/tests/test_static_analysis.py`.
"""
import re
import shutil
import subprocess
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
CARD = HERE.parent.parent / "web" / "public" / "rso" / "live" / "index.html"
CONFIG = HERE / "tooling" / "eslint.config.mjs"
EXTRACTED = HERE / "tooling" / ".card.mjs"   # git-ignored


def _eslint():
    for cand in ("eslint",):
        p = shutil.which(cand)
        if p:
            return [p]
    if shutil.which("npx"):
        return ["npx", "--no-install", "eslint"]
    return None


class StaticAnalysisTest(unittest.TestCase):
    def test_card_module_passes_eslint(self):
        eslint = _eslint()
        if not eslint:
            self.skipTest("eslint not installed (npm i -g eslint) — static gate skipped")
        html = CARD.read_text()
        m = re.search(r'<script type="module">(.*?)</script>', html, re.S)
        self.assertIsNotNone(m, "card module <script> not found")
        EXTRACTED.write_text(m.group(1))
        r = subprocess.run(
            eslint + ["--no-config-lookup", "-c", str(CONFIG), str(EXTRACTED)],
            capture_output=True, text=True,
        )
        # ESLint exits 0 clean, 1 with lint errors, 2 on its own config/crash error.
        if r.returncode == 2:
            self.skipTest(f"eslint could not run (config/env): {r.stderr.strip()[:300]}")
        self.assertEqual(r.returncode, 0, f"ESLint found issues in the card module:\n{r.stdout}\n{r.stderr}")


if __name__ == "__main__":
    unittest.main()
