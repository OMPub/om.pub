import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import AutoTyping from "@/components/AutoTyping";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>The OM Pub 🍻</title>
        <meta property="og:url" content={`https://om.pub`} />
        <meta
          property="og:title"
          content={`The OM Pub`}
        />
        <meta property="og:image" content={`/om-pub-logo.webp`} />
      </Head>
      <Header />
      <Container className={`${styles.main}`}>
        <Row
          className="d-flex align-items-center pb-5">
          <Col
            className="font-larger">
            <main>
              <Row className={`${styles.hero}`}>
                <h1>
                  A future that is<br />{' '}
                  <AutoTyping strings={['digital', 'open', 'shared', 'decentralized', 'free', 'self-sovereign', 'communal']} />
                </h1>
              </Row>
              <Row className={`${styles.welcome}`}>
                <h3>
                  It's time. We must build the open metaverse.
                </h3>
                <p>
                  Welcome to the OM Pub. Whether you are a newbie or a maxi, you are welcome here.
                </p>
                <p>
                  We need a digital existence that runs on publicly accessible protocols, not corporate servers.
                  Explore with us the pathways to building the open metaverse.
                </p>
                <p>
                  What does it mean for the metaverse to be open? At a minimum, it means upholding the values of equitable access, data ownership, digital rights, and the freedom to transact.
                </p>
                <p>
                  This site is dedicated to teaching these values, community experiments in decentralization, and sharing a vision of the future that is open to all.
                </p>
              </Row>
              <Row className={`${styles.equitable}`}>
                <h2 className={`${styles.pillar}`}>
                  Equitable Access
                </h2>
              </Row>
              <Row className={`${styles.text}`}>
                <p>
                  The open metaverse requires equitable access.
                </p>
                <p>
                  We must ensure that the metaverse is available to all individuals, without permissioned choke points or centralized databases of control.
                </p>
                <p>
                  This pillar advocates for the adoption of open protocols that promote universal inclusivity and interoperability.
                </p>
                <p>
                  Equitable access empowers individuals, and makes the benefits transparent, fair, and open to everyone.
                </p>
              </Row>
              <Row className={`${styles.ownership}`}>
                <h2 className={`${styles.pillar}`}>
                  Data Ownership
                </h2>
              </Row>
              <Row className={`${styles.text}`}>
                <p>
                  Personal ownership of data defines the essence of the open metaverse.
                </p>
                <p>
                  Individuals control their data, including the ability to determine who can access it, how it is used, and when it's deleted.
                </p>
                <p>
                  With complete data ownership you can make wise choices regarding your personal information, benefit from its value, and ensure your privacy is protected.
                </p>
              </Row>
              <Row className={`${styles.rights}`}>
                <h2 className={`${styles.pillar}`}>
                  Digital Rights
                </h2>
              </Row>
              <Row className={`${styles.text}`}>
                <p>
                  Digital rights are human rights. The open metaverse must respect and protect these rights.
                </p>
                <p>
                  Individual rights extend into the digital realm, thus safeguarding dignity, privacy, and freedom of expression.
                </p>
                <p>
                  The open metaverse supports and advocates for the adoption of digital rights frameworks like the <a href="https://digitalrightscharter.org/">Global Digital Rights Charter</a>, as they can guide navigation through the metaverse while protecting user rights and endorsing a digital environment that respects and upholds human values.
                </p>
              </Row>
              <Row className={`${styles.freedom}`}>
                <h2 className={`${styles.pillar}`}>
                  Freedom to Transact
                </h2>
              </Row>
              <Row className={`${styles.text}`}>
                <p>
                  The open metaverse is build on a foundation of freedom to transact.
                </p>
                <p>
                  The goal: free users from unnecessary permissions or intermediaries that could hinder innovation and economic growth.
                </p>
                <p>
                  By operating well-grounded in decentralized transactions, the open metaverse aims to leverage innovation and stimulate economic empowerment.
                </p>
                <p>
                  The full potential of the open metaverse becomes realized through embracing permissionless and direct transactions... the freedom to transact.
                </p>
              </Row>
            </main>
          </Col>
        </Row>
        <Row>
          <Col
            md={{ span: 3, offset: 1 }}
            className="d-flex justify-content-end">

          </Col>
        </Row>
      </Container >
    </>
  );
}
