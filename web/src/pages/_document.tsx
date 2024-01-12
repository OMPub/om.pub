import { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <footer
          id="footer"
          className="d-flex align-items-center justify-content-center flex-wrap">
          <p>
            <a
              href="https://github.com/ompub"
              target="_blank"
              rel="noreferrer">
              <Image
                loading={"lazy"}
                width="20"
                height="20"
                src="/github.png"
                alt="GitHub"
              />{" "}
              GitHub
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a
              href="https:/twitter.com/om_pub_/"
              target="_blank"
              rel="noreferrer">
              <Image
                loading={"lazy"}
                width="20"
                height="20"
                src="/twitter.png"
                alt="Twitter"
              />{" "}
              Twitter
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;          <a
              href="https:/instagram.com/the.om.pub/"
              target="_blank"
              rel="noreferrer">
              <Image
                loading={"lazy"}
                width="20"
                height="20"
                src="/instagram.png"
                alt="Instagram"
              />{" "}
              Instagram
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            {/* Add link to shop.om.pub: */}
            <a
              href="https://www.shop.om.pub/"
              target="_blank"
              rel="noreferrer">
            Shop now for Memes IRL: shop.om.pub
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
          </p>
          <p>
            OM: Open Metaverse
            &nbsp;&nbsp;|&nbsp;&nbsp;
            Pub: A place to hang. Also: Public domain (CC0), for all, forever.
          </p>
        </footer>
      </body>
    </Html>
  );
}
