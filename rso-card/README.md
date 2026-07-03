# RSO Archive Card — development home

The **Orbital Witness** archive card is a single-file, self-contained WebGL
artwork (a first-person flythrough of the daily-tracked space-object catalog).
It is developed **here, in the om.pub repo**.

## Where things live

| Path | What it is |
|------|------------|
| `../web/public/rso/live/index.html` | **The card — source of truth AND the live-served file.** Edit this directly; serving it *is* deploying the om.pub `/rso/live` view. |
| `../web/public/rso/live/three.core.js`, `three.module.js` | Vendored three.js. In the DEV file the card imports `./three.module.js`; the MINT build inlines both (see below). |
| `../web/public/rso/live/build-standalone.py` | **Mint build.** Transforms the two three.js ES modules into one inline classic-script IIFE and writes `index.standalone.html` — a single self-contained file, zero external code fetches, no `blob:`/`import()` dependency. `--check` verifies self-containment (a test runs it). |
| `../web/public/rso/live/build-seed.py` | **Offline-permanence seed.** Encodes the full witnessed-day timeline (every date + its record count, ~39 KB) and seals it between the `__RSO_SEED__` markers in index.html. Run against a source serving the full `ledger.json` before mint and whenever the archive advances: `python3 build-seed.py --source http://localhost:8766 --check`. |
| `../web/public/rso/live/index.standalone.html` | The generated mint artifact (**git-ignored** — regenerate with `build-standalone.py`). This is what gets minted/uploaded to Arweave. |
| `../web/public/rso/live/build-embed-matrix.py` → `embed-matrix/` | **Marketplace-embed test harness.** Builds the real standalone under 10 iframe `sandbox`/CSP combos (seize.io, Zora, OpenSea-class no-`blob:` re-host, worker-blocked, no-network, cross-origin, `data:`/`srcdoc`, inline-blocked) + a probe dashboard grading each cell. Both `embed-matrix/` and the older `nft-preview.html` are dev-only (git-ignored). |
| `../web/public/rso/live/serve.py` | Local CORS preview server, matching production iframe hosting. |
| `rso-card/tests/test_card_viewer.py` | Contract tests pinning the viewer ↔ pipeline/index contracts (and the mint-build/self-containment invariants). |
| `rso-card/tests/fixtures/rso-docchain-index.json` | Frozen snapshot of the RSO indexer output, for the index-contract tests. |
| `rso-card/DATA-ARCHITECTURE.md` | The card's data-layer design notes. |
| `rso-card/index.original.html` | The original pre-generative card, kept for reference. |

Editing `web/public/rso/live/index.html` *is* deploying the live om.pub view (it's a
Next.js static asset). **Minting is separate**: run `python3 build-standalone.py` to
produce the self-contained `index.standalone.html`, and mint/upload THAT file.

### Dev-only affordances (never harmful in the mint, but good to know)

- `?day=<YYYY | YYYYMM | YYYYMMDD>` — open on a specific day instead of the latest (dashes/slashes
  tolerated; snaps to the nearest witnessed day). A deep-history day opens on a light era, e.g.
  `?day=19690420` → Apr 20 1969 (~1.6k objects vs ~34k today) — handy for a fast, low-object load.
- `?source=<private-host-url>` — session-only top-priority local data node (see below).
- `?noworker` — forces the synchronous (worker-less) parse path, so you can exercise
  exactly what a worker-blocking embed (e.g. an OpenSea re-host CSP) does, on any device.
- `?offline` — forces every network fetch to fail instantly (the single `fetchTimed` choke
  point throws), so the offline-permanence path is testable anywhere without unplugging.
- `window.__RSO_CARD__` — a debug handle exposing `{ state, setTarget, recordMeta, isoFor,
  TOTAL, witnessDates, camera, O, pointMat, scene, pool }`. It lives on the NFT's own
  iframe window only (no cross-origin reach) and is kept intentionally — a transparency
  affordance for a data-art piece and the hook the browser tests drive.

## Develop

```bash
# local preview with production-honest CORS headers
cd web/public/rso/live && python3 serve.py        # → http://localhost:8755/
#   the card:    http://localhost:8755/index.html
#   embed kit:   http://localhost:8755/nft-preview.html
```

### Tests (three layers)

```bash
python3 -m pytest rso-card/tests/          # runs ALL of the below
```

- **Contract tests** (`test_card_viewer.py`) — string pins on the source: assert specific code/markup
  is present. Fast, but they check that text *exists*, not that it *works*.
- **Static-analysis gate** (`test_static_analysis.py`) — extracts the card's `<script type="module">`
  and runs ESLint (`tests/tooling/eslint.config.mjs`): undefined refs, dead vars, unreachable code, bad
  assignments. Catches the audit-class defects mechanically. Needs `eslint` on PATH (else it skips).
- **Executing unit tests** (`tests/unit/*.test.mjs`, run via `test_pure_units.py`) — extract the PURE
  functions (`isPrivateHost`, `rowsOf`, `parseJsonNonBlocking`, `detectStacks`) by brace-matching and
  actually RUN them with real inputs. A behavioural regression fails here even if the source text is
  unchanged. Run directly: `node --test rso-card/tests/unit/*.test.mjs`. Needs `node` (else it skips).

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

### Offline permanence (no reachable source)

With no source reachable the piece still boots the full timeline, in three honest layers:

1. **Sealed seed** — the witnessed-day timeline (dates + per-day record counts) lives inside
   the file (`build-seed.py`, ~39 KB). Full 1957→now scrub, era-correct reconstruction,
   status pill `Offline · reconstruction`. Days carry their recorded counts but never an
   invented hash; the timeline extends day-by-day up to the device's current date.
2. **IndexedDB skeleton** — the freshest timeline this device has seen online, refreshed on
   every successful boot and **unioned** with the seed (a short-window node can't shrink the
   archive).
3. **IndexedDB day replay** — the most recent witnessed day this device downloaded: exact
   catalog bytes + the identity directory, replayed offline and **re-hashed against the
   published sha** (`SHA-256 · verified on this device` stays true), status pill
   `Offline · cached record`. The rest of the timeline stays scrubbable as reconstruction.

A storage-blocked sandbox (marketplace iframe) falls 3 → 2 → 1; layer 1 always works.

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
