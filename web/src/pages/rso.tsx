import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

import styles from "@/styles/Home.module.scss";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

// Where the live first-person archive viewer is served (static export in public/rso/live/).
const VIEWER_URL = "/rso/live";
const RSO_REPO = "OMPub/RSO";
const INDEX_URL = `https://raw.githubusercontent.com/${RSO_REPO}/main/indexer/generated/sepolia/rso-docchain-index.json`;
const LEDGER_URL = `https://raw.githubusercontent.com/${RSO_REPO}/node/ledger.json`;

interface LiveStats {
  objects: number;
  days: number;
  attestations: number;
  nodes: number;
  latest: string;
}

// Baked fallbacks (as of 2026-06-10) — replaced by live chain data when reachable.
const FALLBACK: LiveStats = {
  objects: 67917,
  days: 52,
  attestations: 104,
  nodes: 2,
  latest: "2026-06-10",
};

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={[styles.reveal, className || ""].filter(Boolean).join(" ")}
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

const STEPS: { num: string; title: string; body: ReactNode }[] = [
  {
    num: "01",
    title: "Capture",
    body: (
      <>
        Every UTC day, the full public catalog — every satellite, rocket body,
        and piece of debris Space-Track publishes — is snapshotted into
        canonical bytes and fingerprinted with SHA-256. Each day&apos;s record
        chains to the day before it, back to genesis.
      </>
    ),
  },
  {
    num: "02",
    title: "Witness",
    body: (
      <>
        Independent nodes run the same capture and derive the same hash from
        the same public source — then sign it on Ethereum through the{" "}
        <a
          className="black-link"
          href="https://github.com/OMPub/doc-chain"
          target="_blank"
          rel="noreferrer">
          Doc&nbsp;Chain
        </a>{" "}
        contract. When their hashes agree, the record is{" "}
        <em>witnessed, not merely hosted</em>.
      </>
    ),
  },
  {
    num: "03",
    title: "Preserve",
    body: (
      <>
        Daily bundles are stored on Arweave — content-addressed,
        pay-once-store-forever — and mirrored on GitHub. The on-chain event log
        is the permanent index: as long as Ethereum exists, anyone can rebuild
        the entire timeline from the contract alone.
      </>
    ),
  },
  {
    num: "04",
    title: "Verify",
    body: (
      <>
        Don&apos;t trust — recompute. Download any day, hash it yourself,
        compare against the chain. Or go further: a new node joining today can
        re-derive the whole history from Space-Track and land its own
        attestations in a single transaction.
      </>
    ),
  },
];

export default function RSO() {
  const [live, setLive] = useState<LiveStats>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const next = { ...FALLBACK };
      try {
        const idx = await (await fetch(INDEX_URL)).json();
        if (idx?.docRefCount) {
          next.days = idx.docRefCount;
          next.attestations = idx.eventCount ?? next.attestations;
          const entries = Object.values(
            idx.docRefs ?? {}
          ) as { date?: string; leadingAgreementGroup?: { attestationCount?: number } }[];
          const dates = entries.map((e) => e.date ?? "").sort();
          next.latest = dates[dates.length - 1] || next.latest;
          const latestEntry = entries.find((e) => e.date === next.latest);
          next.nodes =
            latestEntry?.leadingAgreementGroup?.attestationCount ?? next.nodes;
        }
      } catch {
        /* keep fallbacks */
      }
      try {
        const ledger = await (await fetch(LEDGER_URL)).json();
        if (Array.isArray(ledger) && ledger.length) {
          next.objects = ledger[ledger.length - 1].object_count ?? next.objects;
        }
      } catch {
        /* keep fallbacks */
      }
      if (!cancelled) setLive(next);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Head>
        <title>RSO Archive — Public memory for orbit | OM Pub</title>
        <meta
          name="description"
          content="A forever, public record of everything humanity is tracking in orbit — snapshotted daily, witnessed on Ethereum by independent nodes, preserved on Arweave."
        />
        <meta property="og:url" content="https://om.pub/rso" />
        <meta property="og:title" content="RSO Archive — Public memory for orbit" />
        <meta
          property="og:description"
          content="A forever, public record of everything humanity is tracking in orbit — snapshotted daily, witnessed on Ethereum, preserved on Arweave."
        />
        <meta property="og:image" content="/logo-fom-500.gif" />
      </Head>

      <Header />

      <main className={styles.page}>
        {/* ───── Hero ───── */}
        <section className={styles.hero} aria-label="RSO Archive">
          <div className={styles.heroGrid}>
            <Reveal className={styles.heroCopy}>
              <span className={`eyebrow ${styles.heroEyebrow}`}>
                RSO Archive &middot; The Orbital Witness
              </span>
              <h1 className={styles.heroTitle}>
                Public memory
                <br />
                <span className="text-amber-grad">for orbit</span>.
              </h1>
              <p className={styles.heroSub}>
                Every day, humanity&apos;s public catalog of{" "}
                <strong>{live.objects.toLocaleString("en-US")} orbital objects</strong>{" "}
                is snapshotted, fingerprinted, chained to the day before, and
                witnessed on Ethereum by independent nodes &mdash; then preserved
                on Arweave, forever. No single party owns the record. Anyone can
                verify it. Anyone can fly it.
              </p>
              <div className={styles.heroCtas}>
                <a href={VIEWER_URL} className="btn btn-primary">
                  Fly the record
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M3 8h10m-4-4 4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </a>
                <Link href="/rso/doc-chain" className="btn btn-ghost">
                  Chain status
                </Link>
              </div>
              <div className={styles.heroBadges}>
                <span className={styles.heroBadge}>
                  {live.days} days witnessed
                </span>
                <span className={styles.heroBadge}>
                  {live.nodes} independent nodes in agreement
                </span>
                <span className={styles.heroBadge}>Ethereum + Arweave</span>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <a
                href={VIEWER_URL}
                aria-label="Enter the live archive viewer"
                style={{
                  display: "block",
                  position: "relative",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 178, 56, 0.25)",
                  boxShadow:
                    "0 24px 80px rgba(0,0,0,0.55), 0 0 40px rgba(255,178,56,0.06)",
                  aspectRatio: "16 / 11",
                  background: "#020506",
                }}>
                <iframe
                  src={VIEWER_URL}
                  title="RSO Archive — live orbital flythrough"
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: 0,
                    pointerEvents: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    bottom: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "rgba(2,5,6,0.72)",
                    border: "1px solid rgba(255,178,56,0.35)",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#46e3b7",
                      boxShadow: "0 0 8px #46e3b7",
                    }}
                  />
                  Live &mdash; enter the archive
                </span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ───── Live stats ───── */}
        <section className={styles.section} aria-label="The record at a glance">
          <Reveal>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  {live.objects.toLocaleString("en-US")}
                </span>
                <span className={styles.statLabel}>Objects in the record</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{live.days}</span>
                <span className={styles.statLabel}>Days witnessed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{live.attestations}</span>
                <span className={styles.statLabel}>On-chain attestations</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>∞</span>
                <span className={styles.statLabel}>Days it must last</span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ───── Why ───── */}
        <section className={styles.section} aria-labelledby="why-title">
          <Reveal>
            <div className={styles.manifesto}>
              <div className={styles.manifestoHead}>
                <span className="eyebrow">Why this exists</span>
                <h2 id="why-title" className={styles.manifestoQuote}>
                  Public access is not public memory.
                </h2>
              </div>
              <div className={styles.manifestoBody}>
                <p>
                  The catalog of Resident Space Objects &mdash; active
                  satellites, spent rocket bodies, debris &mdash; is published
                  daily by the U.S. Space Force on{" "}
                  <a
                    className="black-link"
                    href="https://www.space-track.org"
                    target="_blank"
                    rel="noreferrer">
                    Space-Track.org
                  </a>
                  . Operators, researchers, journalists, and policymakers all
                  rely on it to understand what is happening above Earth. But
                  access today does not guarantee a record tomorrow: if someone
                  in 2035 asks what the public catalog said on 2026-05-22, the
                  answer shouldn&apos;t depend on whether an old API still
                  answers the same way.
                </p>
                <p>
                  RSO Archive turns service responses into{" "}
                  <strong>stable public artifacts</strong>: daily files,
                  fingerprints, manifests, and verification rules that can be
                  cited, mirrored, checked, and preserved independently &mdash;
                  the way Certificate Transparency made certificate issuance
                  auditable, and the Internet Archive gave the web a memory.
                </p>
                <p>
                  It does not track satellites, improve orbits, or replace
                  Space-Track,{" "}
                  <a
                    className="black-link"
                    href="https://celestrak.org"
                    target="_blank"
                    rel="noreferrer">
                    CelesTrak
                  </a>
                  , or{" "}
                  <a
                    className="black-link"
                    href="https://keeptrack.space"
                    target="_blank"
                    rel="noreferrer">
                    KeepTrack
                  </a>
                  . It preserves public evidence &mdash; so the shared record of
                  orbit never depends on a single service being its only memory.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ───── How it works ───── */}
        <section className={styles.section} aria-labelledby="how-title">
          <div className={styles.sectionHead}>
            <Reveal>
              <span className="eyebrow">How it works</span>
              <h2 id="how-title">
                Snapshot. Witness.{" "}
                <span className="text-amber-grad">Forever.</span>
              </h2>
              <p className={styles.sectionLede}>
                A daily pipeline anyone can run, a hash chain anyone can check,
                and an on-chain witness log no one can quietly rewrite.
              </p>
            </Reveal>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 80}>
                <article
                  style={{
                    height: "100%",
                    padding: "1.5rem 1.5rem 1.25rem",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(255,178,56,0.05), rgba(255,255,255,0.015))",
                  }}>
                  <span className="eyebrow">Step {s.num}</span>
                  <h3 style={{ margin: "0.5rem 0 0.6rem", fontSize: "1.3rem" }}>
                    {s.title}
                  </h3>
                  <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.65 }}>
                    {s.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───── The card ───── */}
        <section className={styles.section} aria-labelledby="card-title">
          <Reveal>
            <div className={styles.manifesto}>
              <div className={styles.manifestoHead}>
                <span className="eyebrow">The Orbital Witness card</span>
                <h2 id="card-title" className={styles.manifestoQuote}>
                  The art funds the archive &mdash; and lets you stand watch.
                </h2>
              </div>
              <div className={styles.manifestoBody}>
                <p>
                  <a className="black-link" href={VIEWER_URL}>
                    The Orbital Witness
                  </a>{" "}
                  is a living artwork: a first-person flight through the real,
                  daily archive. Park above low Earth orbit while the day&apos;s
                  catalog streams past &mdash; every dot a real tracked object
                  &mdash; then scrub backward through witnessed time in a
                  directional wormhole. When a day turns cyan, you are looking
                  at on-chain agreement between independent nodes.
                </p>
                <p>
                  The card is the archive&apos;s public interface and its
                  funding engine. Card holders can put their{" "}
                  <strong>card-specific TDH</strong> behind the nodes that keep
                  the record: TDH-backed nodes are the ones the indexer trusts,
                  so holding the card and backing a node literally strengthens
                  the witness. Opening the card is not full verification &mdash;
                  but it makes the archive visible, monitorable, and viscerally
                  real to anyone.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ───── CTA ───── */}
        <section className={styles.section} aria-labelledby="cta-title">
          <Reveal>
            <div className={styles.cta}>
              <span className="eyebrow">Don&apos;t trust &mdash; verify</span>
              <h2 id="cta-title" className={styles.ctaTitle}>
                The record is strongest when{" "}
                <span className="text-amber-grad">you check it yourself</span>.
              </h2>
              <p className={styles.ctaLede}>
                Fly the archive, audit the chain, or run a node and add your own
                attestations &mdash; the entire history can be re-derived and
                witnessed in a single transaction.
              </p>
              <div className={styles.ctaActions}>
                <a href={VIEWER_URL} className="btn btn-primary">
                  Enter the live archive
                </a>
                <Link href="/rso/doc-chain" className="btn btn-ghost">
                  Live chain status
                </Link>
                <a
                  href={`https://github.com/${RSO_REPO}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost">
                  Run a node
                </a>
              </div>
              <p className="pt-4 small" style={{ opacity: 0.6 }}>
                Latest witnessed day: {live.latest} &middot; source data by{" "}
                <a
                  className="black-link"
                  href="https://www.space-track.org"
                  target="_blank"
                  rel="noreferrer">
                  Space-Track.org
                </a>{" "}
                &middot; with thanks to{" "}
                <a
                  className="black-link"
                  href="https://celestrak.org"
                  target="_blank"
                  rel="noreferrer">
                  CelesTrak
                </a>{" "}
                and{" "}
                <a
                  className="black-link"
                  href="https://keeptrack.space"
                  target="_blank"
                  rel="noreferrer">
                  KeepTrack.space
                </a>{" "}
                &middot; docs in{" "}
                <a
                  className="black-link"
                  href={`https://github.com/${RSO_REPO}/tree/main/docs`}
                  target="_blank"
                  rel="noreferrer">
                  OMPub/RSO
                </a>
              </p>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
