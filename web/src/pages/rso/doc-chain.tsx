import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row, Table } from "react-bootstrap";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

const Header = dynamic(() => import("../../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

const RSO_REPO = "OMPub/RSO";
const INDEX_V2_URL = `https://raw.githubusercontent.com/${RSO_REPO}/main/indexer/generated/sepolia/rso-docchain-index-v2.json`;
const INDEX_V1_URL = `https://raw.githubusercontent.com/${RSO_REPO}/main/indexer/generated/sepolia/rso-docchain-index.json`;

const V1_CONTRACT = "0x1133895b7b8C4A0A8aae0b5d40B96C652192F5DA";
const V2_CONTRACT = "0x2c66585E7b60A20563a3fd2B7a4D75Ae5baa5437";
const V1_DOC_CHAIN_ID =
  "0x8621c2851714436d60da45cf0e11253114a4f2002f73ddc159b4dc88fea5611d";
const V2_DOC_CHAIN_ID =
  "0x7c5d6ad47ba584ce3f34ec8f94b08d17d4828c1d5ee6fbaecb4dfcb986efbc40";
const V1_HEAD_BLOCK_HASH =
  "0xf6b2b68ed73a5327c1d5d0725edef9dc3d1a875aee29d0fc75579f49abd92ca4";

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
  const [v2, setV2] = useState<ChainIndex | null>(null);
  const [v1, setV1] = useState<ChainIndex | null>(null);
  const [annotations, setAnnotations] = useState<DayAnnotations | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [v2Response, v1Response] = await Promise.all([
          fetch(INDEX_V2_URL),
          fetch(INDEX_V1_URL),
        ]);
        const v2Index = v2Response.ok ? await v2Response.json() : null;
        const v1Index = v1Response.ok ? await v1Response.json() : null;
        if (cancelled) return;
        setV2(v2Index);
        setV1(v1Index);
        const dates = v2Index
          ? Object.values(v2Index.docRefs as Record<string, DocRefEntry>)
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

  const v2Days = v2
    ? Object.values(v2.docRefs)
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : -1))
    : [];
  const v2Latest = v2Days[0];
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
          content="The RSO archive's attestation chains: v1 (frozen) and v2 (active), with live agreement status from Ethereum."
        />
        <meta property="og:url" content={`https://om.pub/rso/doc-chain`} />
        <meta property="og:title" content={`RSO Doc Chain | The OM Pub`} />
        <meta
          property="og:description"
          content="The RSO archive's attestation chains: v1 (frozen) and v2 (active), with live agreement status from Ethereum."
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
                Two chains, one archive: how the orbital record is witnessed on
                Ethereum.
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
                contract on Sepolia. Independent nodes derive the same daily
                hash from Space-Track and sign it; when their block hashes
                agree, the record is witnessed, not merely hosted.
              </p>

              <h3 className="pt-4">Live status — v2 (active)</h3>
              {error && <p className="font-grey">{error}</p>}
              {!v2 && !error && <p className="font-grey">Loading chain data…</p>}
              {v2 && (
                <>
                  <p>
                    <span className="fw-bold">{v2.docRefCount}</span> days
                    attested &nbsp;·&nbsp;{" "}
                    <span className="fw-bold">{v2.eventCount}</span>{" "}
                    attestations &nbsp;·&nbsp; latest day{" "}
                    <span className="fw-bold">{v2Latest?.date ?? "—"}</span>
                    {v2Latest?.leadingAgreementGroup && (
                      <>
                        {" "}
                        &nbsp;·&nbsp; leading block{" "}
                        <code>
                          {shortHash(v2Latest.leadingAgreementGroup.blockHash)}
                        </code>{" "}
                        agreed by{" "}
                        <span className="fw-bold">
                          {v2Latest.leadingAgreementGroup.attestationCount}
                        </span>{" "}
                        node(s)
                        {v2Latest.leadingAgreementGroup.backedNodeIds?.length ? (
                          <>
                            {" "}
                            (
                            {v2Latest.leadingAgreementGroup.backedNodeIds.join(
                              ", "
                            )}
                            )
                          </>
                        ) : null}
                      </>
                    )}
                  </p>
                  <p className="small font-grey">
                    Indexed {v2.indexedAt} from contract{" "}
                    <a
                      className="black-link"
                      href={`https://sepolia.etherscan.io/address/${V2_CONTRACT}`}
                      target="_blank"
                      rel="noreferrer">
                      {shortHash(V2_CONTRACT)}
                    </a>
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

              <h3 className="pt-4">The two chain profiles</h3>
              <Table className="pt-2">
                <tbody>
                  <tr>
                    <td className="fw-bold">v2 — active</td>
                    <td>
                      Consensus hash covers only the elset-intrinsic core (30
                      fields). The nine mutable object-directory fields
                      (decay dates, names, sizes…) live in per-day, per-node
                      annotations: Space-Track back-patches them on published
                      rows, so they are recorded as observations with
                      timestamps instead of being hashed into consensus.
                      <br />
                      <span className="small font-grey">
                        profile{" "}
                        <code>https://om.pub/rso/doc-chain/v2</code> · chain id{" "}
                        <code>{shortHash(V2_DOC_CHAIN_ID)}</code> · contract{" "}
                        <a
                          className="black-link"
                          href={`https://sepolia.etherscan.io/address/${V2_CONTRACT}`}
                          target="_blank"
                          rel="noreferrer">
                          <code>{shortHash(V2_CONTRACT)}</code>
                        </a>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">v1 — frozen</td>
                    <td>
                      The original chain hashed all 39 fields per record; a
                      50-window measurement showed Space-Track mutates
                      directory fields in place, so no v1 day hash can be
                      re-derived from a fresh query. v1 remains on chain,
                      unmodified, as the true record of what was published —
                      head block{" "}
                      <code>{shortHash(V1_HEAD_BLOCK_HASH)}</code>, attested
                      identically by both nodes
                      {v1 ? ` (${v1.eventCount} attestations indexed)` : ""}.
                      <br />
                      <span className="small font-grey">
                        profile{" "}
                        <code>https://om.pub/rso/doc-chain/v1</code> · chain id{" "}
                        <code>{shortHash(V1_DOC_CHAIN_ID)}</code> · contract{" "}
                        <a
                          className="black-link"
                          href={`https://sepolia.etherscan.io/address/${V1_CONTRACT}`}
                          target="_blank"
                          rel="noreferrer">
                          <code>{shortHash(V1_CONTRACT)}</code>
                        </a>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>

              <p>
                The supersession is itself on chain: the v2 genesis block&apos;s
                parent hash is the agreed v1 head, so the two chains form one
                continuous, verifiable history.
              </p>

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
                ; the measurements behind the v2 design are in{" "}
                <a
                  className="black-link"
                  href="https://github.com/OMPub/RSO/blob/main/docs/chain-v2.md"
                  target="_blank"
                  rel="noreferrer">
                  docs/chain-v2.md
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
