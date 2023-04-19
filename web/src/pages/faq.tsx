import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

export default function FAQ() {
  return (
    <>
      <Head>
        <title>About | The OM Pub</title>
        <meta
          property="og:url"
          content={`https://om.pub/faq`}
        />
        <meta
          property="og:title"
          content={`About | The OM Pub`}
        />
        <meta property="og:image" content={`/om-pub-logo.webp`} />
      </Head>
      <Header />
      <Container className={`${styles.main}`}>
        <Row className="pb-5">
          <Col
            className="font-larger">
            <main>
              <h1>
                Questions?
              </h1>
              <div className="text-subheading pt-3">The Open Metaverse: Building a sufficiently decentralized future </div>
              <h3>What can I do here?</h3>
              <p className="question-answer">Not much yet, hang tight.</p>
              <h3>Wen useful?</h3>
              <p className="question-answer">Soon.</p>
              <h3>Where'd this page come from?</h3>
              <p className="question-answer">Layout and structure is heavily borrowed from the GDRC project, a CC0 codebase.</p>
            </main>
          </Col>
        </Row>
      </Container>
    </>
  );
}
