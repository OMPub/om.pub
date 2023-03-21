import { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo-fom-500.gif" />
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
        </footer>
      </body>
    </Html>
  );
}
