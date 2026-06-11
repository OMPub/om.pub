import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

const Header = dynamic(() => import("../../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

const RSO_REPO = "OMPub/RSO";
const INDEX_URL = `https://raw.githubusercontent.com/${RSO_REPO}/main/indexer/generated/sepolia/rso-docchain-index.json`;

const DOCCHAIN_CONTRACT = "0x867FcC4f0339009043E9F6e554DD516Bcf1bcaa9";
const PROFILE_URI = "https://om.pub/rso/doc-chain";
const DOC_CHAIN_ID =
  "0x6011620b5a3faa23f8078c2af0bb1a87bb85a68f784abdf3dbae67939c399bea";

interface ChainIndex {
  docRefCount: number;
  eventCount: number;
  indexedAt: string;
  contractAddress: string;
  docRefs: Record<string, DocRefEntry>;
}

interface DocRefEntry {
  date: string;
  candidateCount: number;
  leadingAgreementGroup?: {
    blockHash?: string;
    attestationCount?: number;
    backedNodeIds?: string[];
    combinedSupportTdh?: number;
  };
}

interface DayAnnotations {
  date: string;
  observed_at_utc: string;
  catalog_changes: { norad_cat_id: string; field: string; current: string | null }[];
  decay_messages: { NORAD_CAT_ID?: string; OBJECT_NAME?: string; DECAY_EPOCH?: string }[];
}

function shortHash(value?: string) {
  if (!value) return "—";
  return `${value.slice(0, 10)}…${value.slice(-6)}`;
}

function annotationsUrl(date: string) {
  const [year, month, day] = date.split("-");
  return `https://raw.githubusercontent.com/${RSO_REPO}/node/data/${year}/${month}/${day}/annotations.json`;
}

export default function RsoDocChain() {
  const [index, setIndex] = useState<ChainIndex | null>(null);
  const [annotations, setAnnotations] = useState<DayAnnotations | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(INDEX_URL);
        const chainIndex = response.ok ? await response.json() : null;
        if (cancelled) return;
        setIndex(chainIndex);
        const dates = chainIndex
          ? Object.values(chainIndex.docRefs as Record<string, DocRefEntry>)
              .map((entry) => entry.date)
              .sort()
          : [];
        const latest = dates[dates.length - 1];
        if (latest) {
          const annotationsResponse = await fetch(annotationsUrl(latest));
          if (!cancelled && annotationsResponse.ok) {
            setAnnotations(await annotationsResponse.json());
          }
        }
      } catch {
        if (!cancelled) {
          setError("Live chain data is temporarily unavailable.");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const days = index
    ? Object.values(index.docRefs)
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : -1))
    : [];
  const latest = days[0];
  const recentDecays = annotations?.decay_messages?.slice(0, 5) ?? [];
  const recentNames =
    annotations?.catalog_changes
      ?.filter((change) => change.field === "OBJECT_NAME" && change.current)
      .slice(0, 5) ?? [];

  return (
    <>
      <Head>
        <title>RSO Doc Chain | The OM Pub</title>
        <meta
          name="description"
          content="The RSO archive's attestation chain: live agreement status from Ethereum, and what the archive just learned about orbit."
        />
        <meta property="og:url" content={`https://om.pub/rso/doc-chain`} />
        <meta property="og:title" content={`RSO Doc Chain | The OM Pub`} />
        <meta
          property="og:description"
          content="The RSO archive's attestation chain: live agreement status from Ethereum, and what the archive just learned about orbit."
        />
        <meta property="og:image" content={`/logo-fom-500.gif`} />
      </Head>
      <Header />
      <Container className={`${styles.main}`}>
        <Row className="pb-5">
          <Col className="font-larger">
            <main>
              <h1>RSO Doc Chain</h1>
              <div className="text-subheading pt-3">
                Chain profile and live status — this page is the document the
                chain&apos;s identity resolves to.
              </div>

              <p className="pt-4">
                Every archived day is hashed and attested through the{" "}
                <a
                  className="black-link"
                  href="https://github.com/OMPub/doc-chain"
                  target="_blank"
                  rel="noreferrer">
                  Doc&nbsp;Chain
                </a>{" "}
                contract. Independent nodes derive the same daily hash from
                Space-Track and sign it; when their block hashes agree, the
                record is witnessed, not merely hosted.
              </p>

              <p>
                The consensus hash covers the <em>orbital core</em> of every
                record — the published element sets, which never change. The
                directory facts that Space-Track edits after the fact (decay
                dates, names, size classes) are excluded from consensus and
                recorded instead as <em>observations</em>: each day, every
                node logs what it learned and when. One archive, two kinds of
                truth — and both verifiable.
              </p>

              <h3 className="pt-4">Profile (normative)</h3>
              <p>
                <span className="fw-bold">Identity.</span> The chain&apos;s
                permanent id is{" "}
                <code>docChainId = keccak256(&quot;{PROFILE_URI}&quot;)</code>{" "}
                = <code>{shortHash(DOC_CHAIN_ID)}</code>. The URI is
                deliberately unversioned: protocol revisions live in metadata
                (the schema registry below and each day&apos;s manifest), never
                in the identifier. Contract and network are bindings recorded
                in the{" "}
                <a
                  className="black-link"
                  href="https://github.com/OMPub/doc-chain/tree/main/deployments"
                  target="_blank"
                  rel="noreferrer">
                  deployments registry
                </a>
                , not identity.
              </p>
              <p>
                <span className="fw-bold">Documents.</span> One per UTC day:
                docRef <code>YYYYMMDD000000</code>, parentHash = the previous
                day&apos;s blockHash, genesis 2026-04-20 with a zero parent.
                The contentHash is the SHA-256 of the canonical catalog with
                the fields named by the day&apos;s{" "}
                <code>content_schema</code> removed from each record — under
                the current schema <code>rso-core-v1</code>, the nine mutable
                object-directory fields. Raw catalogs always keep every field,
                so any past or future projection can be recomputed from the
                original bytes.
              </p>
              <p>
                <span className="fw-bold">Evolution.</span> A protocol
                revision adds a schema row with an effective date and applies
                to new days only: same chain id, unbroken parent chain,
                historical attestations untouched. The full normative text —
                capture rule, canonicalization, schema registry, locator
                format, verification procedures — is maintained at{" "}
                <a
                  className="black-link"
                  href="https://github.com/OMPub/RSO/blob/main/docs/profile.md"
                  target="_blank"
                  rel="noreferrer">
                  docs/profile.md
                </a>{" "}
                (profile revision 3, 2026-06-11), which this page mirrors.
              </p>

              <h3 className="pt-4">Live status</h3>
              {error && <p className="font-grey">{error}</p>}
              {!index && !error && <p className="font-grey">Loading chain data…</p>}
              {index && (
                <>
                  <p>
                    <span className="fw-bold">{index.docRefCount}</span> days
                    attested &nbsp;·&nbsp;{" "}
                    <span className="fw-bold">{index.eventCount}</span>{" "}
                    attestations &nbsp;·&nbsp; latest day{" "}
                    <span className="fw-bold">{latest?.date ?? "—"}</span>
                    {latest?.leadingAgreementGroup && (
                      <>
                        {" "}
                        &nbsp;·&nbsp; leading block{" "}
                        <code>
                          {shortHash(latest.leadingAgreementGroup.blockHash)}
                        </code>{" "}
                        agreed by{" "}
                        <span className="fw-bold">
                          {latest.leadingAgreementGroup.attestationCount}
                        </span>{" "}
                        node(s)
                        {latest.leadingAgreementGroup.backedNodeIds?.length ? (
                          <>
                            {" "}
                            (
                            {latest.leadingAgreementGroup.backedNodeIds.join(
                              ", "
                            )}
                            )
                          </>
                        ) : null}
                      </>
                    )}
                  </p>
                  <p className="small font-grey">
                    Indexed {index.indexedAt} from contract{" "}
                    <a
                      className="black-link"
                      href={`https://sepolia.etherscan.io/address/${DOCCHAIN_CONTRACT}`}
                      target="_blank"
                      rel="noreferrer">
                      {shortHash(DOCCHAIN_CONTRACT)}
                    </a>{" "}
                    · chain id <code>{shortHash(DOC_CHAIN_ID)}</code> ={" "}
                    keccak256(<code>{PROFILE_URI}</code>)
                  </p>
                </>
              )}

              {(recentDecays.length > 0 || recentNames.length > 0) && (
                <>
                  <h3 className="pt-4">What the archive just learned</h3>
                  <p className="small font-grey">
                    The observation log: knowledge about orbiting objects that
                    arrives after their data was first published — recorded
                    with the time we learned it
                    {annotations?.observed_at_utc
                      ? ` (as of ${annotations.observed_at_utc})`
                      : ""}
                    .
                  </p>
                  {recentDecays.length > 0 && (
                    <p>
                      <span className="fw-bold">Recent reentries:</span>{" "}
                      {recentDecays
                        .map(
                          (decay) =>
                            `${decay.OBJECT_NAME ?? decay.NORAD_CAT_ID} (${
                              decay.DECAY_EPOCH ?? "decayed"
                            })`
                        )
                        .join(" · ")}
                    </p>
                  )}
                  {recentNames.length > 0 && (
                    <p>
                      <span className="fw-bold">Newly designated:</span>{" "}
                      {recentNames
                        .map(
                          (change) =>
                            `${change.current} (#${change.norad_cat_id})`
                        )
                        .join(" · ")}
                    </p>
                  )}
                </>
              )}

              <h3 className="pt-4">Verify it yourself</h3>
              <p>
                The whole point: you don&apos;t have to trust any of this. A
                node joining today can re-derive every daily hash from
                Space-Track and land its own attestations for the entire
                history in a single transaction. The runbook lives in{" "}
                <a
                  className="black-link"
                  href="https://github.com/OMPub/RSO/blob/main/docs/late-join.md"
                  target="_blank"
                  rel="noreferrer">
                  docs/late-join.md
                </a>
                ; the measurements behind the consensus design are in{" "}
                <a
                  className="black-link"
                  href="https://github.com/OMPub/RSO/blob/main/docs/chain.md"
                  target="_blank"
                  rel="noreferrer">
                  docs/chain.md
                </a>
                .
              </p>
            </main>
          </Col>
        </Row>
      </Container>
    </>
  );
}
