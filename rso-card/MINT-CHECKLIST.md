# Mint checklist — The RSO Archive · The Orbital Witness

Everything between "the card is done" and "the card is on Arweave and in front of 6529
voters." **There is nothing post-mint — we lock it in at mint time.** Work top to bottom;
don't skip the verifies. Items marked ⚠ BLOCKER must be true before the freeze step.

---

## 0 · Current blockers (data layer, not card code)

- [ ] ⚠ **Publish the FULL history to the node branch.** As of 2026-07-03 the production
  node branch (`OMPub/RSO@node`, `brookr/RSO@node`) carries only ~75 days
  (2026-04-20 → today): one `index/2026.json` chunk, **no** `index/1959…2025.json`, and
  `manifest.json` has an **empty `days` list**. A card minted against this shows 2.5
  months, not 1957→now. The full archive currently lives only on EchoBase
  (`/Users/Shared/Backups/rso/cardfull`, verified current). Needed on the node branch:
  - [ ] `index/<year>.json` for every year 1957→now (per-day aggregates)
  - [ ] `index/manifest.json` with the **complete ordered `days` list** (~25k dates —
        the card's whole-timeline scrub depends on it; see README "Index manifest contract")
  - [ ] `ledger.json` spanning genesis → today (legacy fallback path)
  - [ ] deep-history per-day `catalog.json.gz` reachable via each day's `catalog_url`
        locator (Arweave bundles and/or node-branch data paths)
- [ ] ⚠ **Arweave data permanence (publish-range).** Fund the Arweave wallet (~5.5 AR
  estimated) and run publish-range so witnessed days have independent permanent copies —
  the attestation locators the card's "permanent copies" panel reads. *(Needs Brook:
  wallet + funding + go.)*
- [ ] ⚠ **On-chain attestation current.** Contract `0x867FcC…` (clean v1 chain, hash-only
  tier): verify the docchain index (`indexer/generated/…`) is published on the `main`
  branch and recent days are attested — the minted card should boot to a day that can
  show the attested tier, not "awaiting attestation" forever.
- [ ] **Verify against production, not the tunnel:** open the card with NO `?source` and
  confirm it boots to today, full timeline length, "Live · OMPub", correct attested tier.

## 1 · Freeze the artifact (order matters — seed before standalone)

- [ ] **Re-seal the offline seed on mint day** (it must reach the mint date):
  ```
  cd web/public/rso/live
  python3 build-seed.py --source <full-current-ledger-source> --check
  ```
  Confirm the printed range ends on the mint date and round-trip says OK.
  (`http://localhost:8766` only if EchoBase was re-synced that day — `live_fetch.py` on
  EchoBase — otherwise point at wherever the full current `ledger.json` is served.)
- [ ] **Full test suite green:** `python3 -m pytest rso-card/tests/` (contract pins +
  ESLint gate + executing units, incl. sealed-seed invariants).
- [ ] **Freeze the dev file:** final commit of `web/public/rso/live/index.html`; no edits
  after this point without restarting section 1.
- [ ] **Build the standalone (inlines three.js — the ONLY time it enters the file):**
  ```
  python3 build-standalone.py && python3 build-standalone.py --check
  ```
- [ ] **Embed matrix against the FINAL standalone:** `python3 build-embed-matrix.py`,
  serve, and confirm the dashboard grades green across all cells (seize.io sandbox,
  Zora, OpenSea-class no-blob re-host, worker-blocked, no-network, cross-origin,
  `data:`/`srcdoc`, inline-blocked). Spot-check by hand:
  - [ ] `?noworker` (sync parse path) boots and scrubs
  - [ ] `?offline` fresh (seed reconstruction pill) and after one online boot (cached-
        record replay pill, "verified on this device")
  - [ ] mobile viewport (≤760px) boots on the sampled field
- [ ] **Record the artifact hash — this is the identity of the work:**
  ```
  shasum -a 256 index.standalone.html
  ```
  Write the hash + file size + git commit into the mint record (below) BEFORE uploading.
- [ ] **Tag the repo:** `git tag rso-card-mint-<date>` on the freeze commit.

## 2 · Write to Arweave

- [ ] Upload `index.standalone.html` with `Content-Type: text/html` (single file, no
  bundle-relative assets — self-containment was verified above).
- [ ] ⚠ **Verify the BYTES, not the address.** Arweave tx ids are signature-derived, not
  content-derived — a fetched payload is only trustworthy against our recorded hash:
  ```
  curl -s https://arweave.net/<txid> | shasum -a 256   # must equal the recorded hash
  ```
  - [ ] repeat via a second gateway (`arweave.dev`) — same hash
- [ ] **Load it for real from the gateway** (not a local copy): boots to today, timeline
  full, day loads + verifies, finder works, settings open.
- [ ] **Gateway + iframe check:** load the gateway URL inside a seize.io-style sandboxed
  iframe (the embed-matrix seize cell config) — render path, no CSP violations.
- [ ] **Mint record** (commit to repo, e.g. `rso-card/MINT-RECORD.md`): artifact sha256,
  byte size, Arweave txid, upload timestamp, gateway-verified ✓, git tag, seed range
  (first/last day), data-source state (manifest latest, chunk count, attested-through).

## 3 · Token metadata + 6529 Main Stage submission

- [ ] **Metadata JSON** (mirror the honesty language the card itself uses):
  - `name` — *The RSO Archive — The Orbital Witness*
  - `animation_url` — the Arweave URL (decide `ar://<txid>` vs gateway URL per the
    submission form's requirements)
  - `image` — a static preview capture (use the card's camera button on a strong day —
    a dense modern day or a deep-history one; export ~2000px)
  - `description` — the piece + the data honesty story: live-witnessed archive, on-chain
    attestation tiers, and the offline behavior: *"With no network the piece replays the
    most recent day this device witnessed (hash-verified) atop its sealed 1957→now
    timeline reconstruction — clearly labelled."*
  - attributes worth surfacing: genesis day 1957-10-04 · witnessed days at mint ·
    objects on orbit at mint · contract `0x867FcC…` · data schema `rso-core-v1`
  - license per The Memes (CC0)
- [ ] **Dry-run the marketplace render:** paste the animation_url into seize.io's
  preview/test surface and confirm boot + interaction inside their exact iframe.
- [ ] **Submit to Main Stage** with artist statement + links (om.pub/rso landing,
  rso-verify repo for the clean-room verifiers, Etherscan contract). *(Needs Brook:
  submission account/wallet.)*
- [ ] Screenshot/record a 30–60s interaction capture for the submission/socials
  (scrub 1957→now hyperspace, a day-stop verify, the finder).

## 4 · After submission (monitoring, no artifact changes possible)

- [ ] Nodes keep publishing daily (GH Actions) — the minted card's "today" keeps moving.
- [ ] Keep at least two node-branch publishers healthy (OMPub + brookr) — the card's
  fallback chain is only as good as the roster.
- [ ] Re-run `live_fetch.py` on EchoBase whenever a local full-history mirror is needed;
  it is NOT a dependency of the minted card (loopback-only `?source` guard).
- [ ] Any future card improvements land in `web/public/rso/live/index.html` for the
  om.pub live view only — the mint is sealed; do not regenerate the standalone
  expecting it to change the token.

---

**Needs Brook specifically:** Arweave wallet + ~5.5 AR funding + publish-range go ·
on-chain attestation go · 6529 submission account · final "freeze now" call.
