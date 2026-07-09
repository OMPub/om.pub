"""Runs the EXECUTING unit tests (tests/unit/*.test.mjs) via node's built-in test runner.

Unlike the string-pin contract tests, these extract the card's pure functions (isPrivateHost, rowsOf,
parseJsonNonBlocking, detectStacks) and RUN them with real inputs, asserting real outputs — so a behavioural
regression fails here even when the source string is unchanged. Skips if node is unavailable.
"""
import shutil
import subprocess
import unittest
from pathlib import Path

UNIT_DIR = Path(__file__).resolve().parent / "unit"


class PureUnitTest(unittest.TestCase):
    def test_pure_functions_execute_correctly(self):
        node = shutil.which("node")
        if not node:
            self.skipTest("node not installed — executing unit tests skipped")
        files = sorted(str(p) for p in UNIT_DIR.glob("*.test.mjs"))
        self.assertTrue(files, "no *.test.mjs unit tests found")
        r = subprocess.run([node, "--test", *files], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, f"node --test failed:\n{r.stdout[-4000:]}\n{r.stderr[-2000:]}")


if __name__ == "__main__":
    unittest.main()
