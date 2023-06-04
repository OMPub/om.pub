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
                  Welcome to the OM Pub!
                </h3>
                <p>
                  Our future is digital: but what values will we build into the systems that shape it?
                  Closed corporate centralized platforms are not the only option.
                  The path we choose now will determine whether our freedoms are protected or eroded.
                  It's time to opt for values that support human rights and digital sovereignty.
                  These include equitable access, data ownership, global digital rights, and the freedom to transact.
                </p>
              </Row>
              <Row className={`${styles.equitable}`}>
                <h2 className={`${styles.pillar}`}>
                  Equitable Access
                </h2>
              </Row>
              <Row className={`${styles.ownership}`}>
                <h2 className={`${styles.pillar}`}>
                  Data Ownership
                </h2>
              </Row>
              <Row className={`${styles.rights}`}>
                <h2 className={`${styles.pillar}`}>
                  Digital Rights
                </h2>
              </Row>
              <Row className={`${styles.freedom}`}>
                <h2 className={`${styles.pillar}`}>
                  Freedom to Transact
                </h2>
              </Row>
              <article>
                <div className="text-subheading pt-3">Experiments in decentralization</div>

                <h3>
                  It's time.
                </h3>
                <p>
                  We need pathways to an open metaverse that runs on publicly accessible protocols, not corporate servers.
                  Join us, in these experiments of decentralization and sharing a vision of digital ownership and access, open to all.
                </p>
              </article>
            </main>
          </Col>
        </Row>
        <Row>
          <Col
            md={{ span: 3, offset: 1 }}
            className="d-flex justify-content-end">
            <aside
              className="justify-content-center"
              style={{ height: '100%' }}>
              <p>
                OM: Open Metaverse
              </p>
              <p>
                Pub: A place to hang. Also: Public domain (CC0), for all, forever.
              </p>
            </aside>
          </Col>
        </Row>
      </Container >
    </>
  );
}
