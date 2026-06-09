import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

// Where the live first-person archive viewer is served. The interactive card
// (RSO/card/index.html) is deployed here; update if the path changes.
const VIEWER_URL = "/rso/live";

export default function RSO() {
  return (
    <>
      <Head>
        <title>RSO Archive | The OM Pub</title>
        <meta name="description" content="A forever, public record of everything humanity is tracking in orbit — daily snapshots, witnessed on Ethereum." />
        <meta property="og:url" content={`https://om.pub/rso`} />
        <meta property="og:title" content={`RSO Archive | The OM Pub`} />
        <meta property="og:description" content="A forever, public record of everything humanity is tracking in orbit — daily snapshots, witnessed on Ethereum." />
        <meta property="og:image" content={`/logo-fom-500.gif`} />
      </Head>
      <Header />
      <Container className={`${styles.main}`}>
        <Row className="pb-5">
          <Col className="font-larger">
            <main>
              <h1>RSO Archive</h1>
              <div className="text-subheading pt-3">
                The Orbital Witness — a forever, public record of everything
                humanity is tracking in orbit.
              </div>

              <p className="pt-4">
                Every day, the public catalog of{" "}
                <span className="fw-bold">Resident Space Objects</span>{" "}
                — active satellites, spent rocket bodies, and debris — published
                by the US Space Force on{" "}
                <a className="black-link" href="https://www.space-track.org" target="_blank" rel="noreferrer">
                  Space-Track.org
                </a>{" "}
                is snapshotted, hashed, and chained to the day before it. The
                day&apos;s fingerprint is then{" "}
                <span className="fw-bold">witnessed on Ethereum</span>{" "}
                through the{" "}
                <a className="black-link" href="https://github.com/OMPub/RSO" target="_blank" rel="noreferrer">
                  Doc&nbsp;Chain
                </a>
                , and the full archive is preserved on Arweave. No single party
                owns it; anyone can verify it, and anyone can run a node and
                witness it themselves.
              </p>

              <p>
                The result is a wayback machine for orbit — fly through the
                stream of objects, scrub backward and forward through time, and
                watch the record become permanent.
              </p>

              <p className="pt-3">
                <a className="black-link fw-bold" href={VIEWER_URL}>
                  Enter the live archive&nbsp;→
                </a>
              </p>

              <p className="pt-4 small font-grey">
                <span className="fw-bold">67,915</span> objects in the record
                &nbsp;·&nbsp; <span className="fw-bold">~34,400</span> still on
                orbit &nbsp;·&nbsp; <span className="fw-bold">~33,500</span>{" "}
                re-entered &nbsp;·&nbsp; one snapshot every UTC day, witnessed
                forever on Ethereum.
              </p>

              <p className="pt-3">
                <span className="font-grey">Source &amp; nodes: </span>
                <a className="black-link" href="https://github.com/OMPub/RSO" target="_blank" rel="noreferrer">
                  github.com/OMPub/RSO
                </a>
                &nbsp;&middot;&nbsp;
                <span className="font-grey">Chain status: </span>
                <a className="black-link" href="/rso/doc-chain">
                  om.pub/rso/doc-chain
                </a>
              </p>
            </main>
          </Col>
        </Row>
      </Container>
    </>
  );
}
