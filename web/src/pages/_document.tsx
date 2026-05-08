import { Html, Head, Main, NextScript } from "next/document";
import { noFlashThemeScript } from "@/lib/theme";

export default function Document() {
  return (
    <Html lang="en" data-theme="dark">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffb000" />
        <meta name="msapplication-TileColor" content="#09090b" />
        <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fbf6ee" media="(prefers-color-scheme: light)" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Paint the right theme on the very first frame */}
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
