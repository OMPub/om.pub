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
          Tip your server? ompub.eth
        </footer>
      </body>
    </Html>
  );
}
