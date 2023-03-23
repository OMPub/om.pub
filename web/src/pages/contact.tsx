import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact | The OM Pub</title>
        <meta
          property="og:url"
          content={`https://om.pub/faq`}
        />
        <meta
          property="og:title"
          content={`Contact | The OM Pub`}
        />
        <meta property="og:image" content={`/logo-fom-500.gif`} />
      </Head>
      <Header />
      <Container className={`${styles.main}`}>
        <Row className="pb-5">
          <Col
            className="font-larger">
              <main>
                <h1>Contact Us</h1>
                <p>
                  <span className="font-grey">Twitter: </span>
                  <a
                    className="black-link"
                    href="https://twitter.com/OM_Pub_"
                    target="_blank"
                    rel="noreferrer">
                    @OM_Pub_
                  </a>
                </p>
                {/* <p>
                  <span className="font-grey">Email: </span>
                  <a
                    className="black-link"
                    href="mailto:info@om.pub"
                    target="_blank"
                    rel="noreferrer">
                    info@om.pub
                  </a>
                </p> */}
                <p>
                  <span className="font-grey">Discord: </span>
                  <a
                    className="black-link"
                    href="https://discord.gg/join-om"
                    target="_blank"
                    rel="noreferrer">
                    https://discord.gg/join-om
                  </a>
                  <br />
                  <span className="font-normal">
                    This is the Open Metaverse Discord. Find us in the main chat.
                  </span>
                </p>
              </main>
          </Col>
        </Row>
      </Container>
    </>
  );
}
