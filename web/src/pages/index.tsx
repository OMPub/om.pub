import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

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
        <meta property="og:image" content={`/logo-fom-500.gif`} />
      </Head>
      <Header />
      <Container className={`${styles.main}`}>
        <Row 
          className="d-flex align-items-center pb-5">
          <Col
            md={8}
            className="font-larger">
            <main>
              <div className="pt-5 pb-5">
                <h1>The OM Pub</h1>
                <div className="text-subheading pt-3">Experiments in decentralization</div>
              </div>
              <article>
                <h3>
                  It's time.
                </h3>
                <p>
                  We need pathways to an open metaverse that runs on publicly accessible protocols, not corporate servers. 
                  Join us, in these experiments of decentralization and sharing a vision of the future open to all.
                </p>
                <h4>
                  Projects discussed at the OM Pub:
                </h4>
                <ul>
                  <li>The Memes by 6529</li>
                  <li>Rememes by the community</li>
                  <li>OnCyber Metaverse</li>
                </ul>
              </article>
            </main>
          </Col>
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
      </Container>
    </>
  );
}
