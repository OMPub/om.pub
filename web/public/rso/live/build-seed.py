#!/usr/bin/env python3
"""Seal the offline-permanence SEED into index.html.

The seed is the witnessed-day timeline — every date and its per-day record count — compactly
encoded and spliced between the /*__RSO_SEED__*/ ... /*__RSO_SEED_END__*/ markers. With no
reachable source the card decodes it (decodeSeed) and keeps the full 1957→now scrub alive as
an honestly-labelled reconstruction. Run against a source serving the FULL ledger.json before
mint/publish (and whenever the archive advances):

    python3 build-seed.py [--source http://localhost:8766] [--check]

Format v1 (mirrors decodeSeed in index.html — keep them in lockstep):
    "1|<runs>|<counts>"
    runs:   comma-separated consecutive-day spans "YYYYMMDD*len"
    counts: comma-separated base36 DELTAS from the previous day's count; "d.r" = delta d
            repeated r days; the first token is the absolute genesis count (delta from 0).

--check decodes the spliced seed back and verifies it reproduces the ledger exactly.
"""
import argparse
import json
import re
import sys
import urllib.request
from datetime import date, timedelta

HERE = __file__.rsplit("/", 1)[0]
CARD = f"{HERE}/index.html"
MARK = re.compile(r"/\*__RSO_SEED__\*/\"[^\"]*\"/\*__RSO_SEED_END__\*/")
B36 = "0123456789abcdefghijklmnopqrstuvwxyz"


def b36(n):
    if n == 0:
        return "0"
    neg, n, s = n < 0, abs(n), ""
    while n:
        s = B36[n % 36] + s
        n //= 36
    return ("-" if neg else "") + s


def encode(days, counts):
    runs, i = [], 0
    ords = [date.fromisoformat(d).toordinal() for d in days]
    while i < len(days):
        j = i
        while j + 1 < len(days) and ords[j + 1] - ords[j] == 1:
            j += 1
        runs.append(f"{days[i].replace('-', '')}*{j - i + 1}")
        i = j + 1
    deltas = [c - p for c, p in zip(counts, [0] + counts[:-1])]
    toks, k = [], 0
    while k < len(deltas):
        j = k
        while j + 1 < len(deltas) and deltas[j + 1] == deltas[k]:
            j += 1
        n = j - k + 1
        toks.append(b36(deltas[k]) if n == 1 else f"{b36(deltas[k])}.{n}")
        k = j + 1
    return "1|" + ",".join(runs) + "|" + ",".join(toks)


def decode(seed):  # mirror of the card's decodeSeed, for --check
    ver, runs_txt, counts_txt = seed.split("|")
    assert ver == "1"
    days = []
    for r in runs_txt.split(","):
        m = re.fullmatch(r"(\d{4})(\d{2})(\d{2})\*(\d+)", r)
        d = date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        for k in range(int(m.group(4))):
            days.append((d + timedelta(days=k)).isoformat())
    counts, cur = [], 0
    for tok in counts_txt.split(","):
        d, _, r = tok.partition(".")
        cur0 = int(d, 36)
        for _ in range(int(r or "1")):
            cur += cur0
            counts.append(cur)
    return days, counts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", default="http://localhost:8766", help="base URL serving ledger.json")
    ap.add_argument("--check", action="store_true", help="decode back and verify round-trip")
    args = ap.parse_args()

    with urllib.request.urlopen(f"{args.source}/ledger.json", timeout=120) as r:
        ledger = json.load(r)
    by_date = {}
    for e in ledger:
        d, c = e.get("date"), e.get("object_count")
        if isinstance(d, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", d) and isinstance(c, int) and c > 0:
            by_date[d] = c
    days = sorted(by_date)
    counts = [by_date[d] for d in days]
    if not days:
        sys.exit("ledger yielded no usable days")

    seed = encode(days, counts)
    if args.check:
        d2, c2 = decode(seed)
        assert d2 == days and c2 == counts, "round-trip mismatch"

    html = open(CARD, encoding="utf-8").read()
    if len(MARK.findall(html)) != 1:
        sys.exit("expected exactly one __RSO_SEED__ marker block in index.html")
    html = MARK.sub(lambda _: f'/*__RSO_SEED__*/"{seed}"/*__RSO_SEED_END__*/', html)
    open(CARD, "w", encoding="utf-8").write(html)
    print(f"sealed: {len(days)} days {days[0]} → {days[-1]}, "
          f"{len(seed):,} bytes ({len(seed) / 1024:.1f} KB){' · round-trip OK' if args.check else ''}")


if __name__ == "__main__":
    main()
