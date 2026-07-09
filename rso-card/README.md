# RSO Archive Card — development home

The **Orbital Witness** archive card is a single-file, self-contained WebGL
artwork (a first-person flythrough of the daily-tracked space-object catalog).
It is developed **here, in the om.pub repo**.

## Where things live

| Path | What it is |
|------|------------|
| `../web/public/rso/live/index.html` | **The card — source of truth AND the served file.** Edit this directly; there is no separate build/copy step. |
| `../web/public/rso/live/three.core.js`, `three.module.js` | Vendored three.js (the card imports `./three.module.js`). |
| `../web/public/rso/live/nft-preview.html` | Embed test kit (sandboxed-iframe previews), co-located so it ships beside the card. |
| `../web/public/rso/live/serve.py` | Local CORS preview server, matching production iframe hosting. |
| `rso-card/tests/test_card_viewer.py` | Contract tests pinning the viewer ↔ pipeline/index contracts. |
| `rso-card/tests/fixtures/rso-docchain-index.json` | Frozen snapshot of the RSO indexer output, for the index-contract tests. |
| `rso-card/DATA-ARCHITECTURE.md` | The card's data-layer design notes. |
| `rso-card/index.original.html` | The original pre-generative card, kept for reference. |

The card is served live from `web/public/rso/live/index.html` (a Next.js static
asset), so editing that file *is* deploying it — no source/deploy copy to keep
in sync.

## Develop

```bash
# local preview with production-honest CORS headers
cd web/public/rso/live && python3 serve.py        # → http://localhost:8755/
#   the card:    http://localhost:8755/index.html
#   embed kit:   http://localhost:8755/nft-preview.html
```

### Point the card at a local index/archive (before deploying)

To test a node's output before publishing it to GitHub/Arweave, serve the node-branch
tree from a box on your LAN (it must send `Access-Control-Allow-Origin: *` and expose
`index/manifest.json`, `index/<year>.json`, `ledger.json`, `indexer/generated/…`, and
`data/<y>/<m>/<d>/…`), then add it as a **session-only** top-priority source via the
`?source=` query param:

```
http://localhost:8755/index.html?source=http://192.168.1.50:8080
```

The card prepends it as the head node (tagged `local · dev` in the source list) and
falls through to the normal GitHub/Arweave nodes if it can't be reached. Safety: the
URL is restricted to **private/loopback hosts only** (192.168/10/172.16-31/127/169.254,
`localhost`, `*.local`, IPv6 ULA/link-local), it is **never persisted, exported, or
accepted from a roster or paste** — only your own URL can add it — so a deployed/shared
card can never be tricked into probing arbitrary hosts. Drop the param to go back to
the published sources.

### Index manifest contract (REQUIRED for full-history scrub)

The lean Tier-1 index makes the **whole** archive scrubbable at boot while loading per-day
aggregates lazily — but only if `index/manifest.json` carries the complete ordered list of
witnessed dates:

```jsonc
{
  "latest": "2026-06-25",
  "latestEntry": { "date": "2026-06-25", /* …full aggregate… */ },
  "chunks": [ { "year": 1959, "sha256": "…" }, /* … */ { "year": 2026, "sha256": "…" } ],
  "days":   [ "1959-01-11", "1959-01-12", /* …every witnessed date, sorted… */ "2026-06-25" ]
}
```

The card builds `witnessDates` from `manifest.days` (so day 1 = 1959 is reachable
immediately), then pulls each `index/<year>.json` chunk on demand as the cursor scrubs
into that year. **Without `days`, the card can only show the boot year** (it falls back to
the loaded chunk's dates). The list is ~24k entries ≈ 350 KB raw / ~58 KB gzipped — fine
for a once-at-boot fetch. (The legacy whole-timeline `ledger.json` still works as a
fallback, but loads the entire archive at once — slower boot.)

## Test

```bash
python3 -m pytest rso-card/tests/test_card_viewer.py -q
```

The tests are pure string/JSON-contract checks (no browser, no network), so they
run in well under a second.

## Provenance

The card and these tests previously lived in the `OMPub/RSO` repo under `card/`
and `tests/`. Development moved here so the RSO repo carries only the archive
pipeline. The index-contract fixture is a snapshot of RSO indexer output — refresh
it from `OMPub/RSO:indexer/generated/sepolia/rso-docchain-index.json` if the
index schema changes.
