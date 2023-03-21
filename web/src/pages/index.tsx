import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

export default function Home(props: Props) {
  return (
    <>
      <Head>
        <title>The OM Pub</title>
        <meta property="og:url" content={`https://om.pub`} />
        <meta
          property="og:title"
          content={`The OM Pub`}
        />
        <meta property="og:image" content={`/logo-fom-500.gif`} />
      </Head>
      <Header />
      <Container className={`${styles.main}`}>
        <Row className="pb-5">
          <Col
            className="font-larger">
            <main>
              <h1>
                Welcome to the OM Pub 🍻 
              </h1>
              <aside>
                <p>
                  OM: Open Metaverse
                </p>
                <p>
                  Pub: A place to hang. Also: Public domain (CC0), for all, forever.
                </p>
              </aside>
              <article>
                <h3>
                  It's time.
                </h3>
                <p>
                  We need pathways to an open metaverse that runs on publicly accessible protocols, not corporate servers. 
                  Join us, in these experiments of decentralization and sharing a vision of the future open to all.
                </p>
                <h4>
                  Projects supported by the OM Pub community
                </h4>
                <ul>
                  <li>The Memes by 6529</li>
                  <li>Rememes by the community</li>
                  <li>OnCyber Metaverse</li>
                </ul>
              </article>
            </main>
          </Col>
        </Row>
      </Container>
    </>
  );
}
