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
        <meta property="og:image" content={`/om-pub-logo.webp`} />
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
                  Currently brewing at the OM Pub...
                </h4>
                <h5>The Memes by 6529: Prememes</h5>
                <ul>
                  <li>Season 3</li>
                  <ul>
                    <li>Artist Preview: <a href="/memes/97/artist">Meme Artist 97 - Matt Doogue</a></li>
                    <li>Artist Preview: <a href="/memes/96/artist">Meme Artist 96 - Billy Dinh</a></li>
                    <li>Artist Preview: <a href="/memes/95/artist">Meme Artist 95 - Andreas Preis</a></li>
                    <li>Artist Preview: <a href="/memes/94/artist">Meme Artist 94 - Jeff Soto</a></li>
                    <li>Artist Preview: <a href="/memes/93/artist">Meme Artist 93 - mbsjq</a></li>
                    <li>Artist Preview: <a href="/memes/92/artist">Meme Artist 92 - Angela Nikolau</a></li>
                    <li>Artist Preview: <a href="/memes/90/artist">Meme Artist 90 - Meg Thorpe</a></li>
                    <li>Artist Preview: <a href="/memes/89/artist">Meme Artist 89 - CyptoClimates: Made by Megan</a></li>
                    <li>Artist Preview: <a href="/memes/88/artist">Meme Artist 88 - Ryan Koopmans</a></li>
                    <li>Artist Preview: <a href="/memes/87/artist">Meme Artist 87 - DeeKay Motion</a></li>
                  </ul>
                  <li>Season 2</li>
                  <ul>
                    <li>Artist Preview: <a href="/memes/86/artist">Meme Artist 86 - Pop Wonder</a></li>
                    <li>Artist Preview: <a href="/memes/85/artist">Meme Artist 85 - 6529er</a></li>
                    <li>Artist Preview: <a href="/memes/83/artist">Meme Artist 83 - Luna Leonis</a></li>
                  </ul>
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
