import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";

import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import styles from "@/styles/Memes.module.scss";
import prememes from "@/data/prememes.json";

const Header = dynamic(() => import("../../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

interface Prememe {
  tokenId: number;
  poster: string;
  name: string;
}

const PREMEMES = prememes as Prememe[];

function isVideoPoster(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src);
}

function PrememeTile({ p }: { p: Prememe }) {
  const href = `/memes/${p.tokenId}/artist`;
  const ariaLabel = `Prememe ${p.tokenId} — ${p.name}`;
  return (
    <Link href={href} className={styles.tile} aria-label={ariaLabel}>
      <span className={styles.tileToken_chip}>#{p.tokenId}</span>
      {isVideoPoster(p.poster) ? (
        <video
          src={p.poster}
          className={styles.tileMedia}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.poster}
          alt={ariaLabel}
          className={styles.tileMedia}
          loading="lazy"
          decoding="async"
        />
      )}
      <span className={styles.tileGradient} aria-hidden="true" />
      <span className={styles.tileMeta}>
        <span className={styles.tileMetaLeft}>
          <span className={styles.tileToken}>Meme #{p.tokenId}</span>
          <span className={styles.tileName}>{p.name}</span>
        </span>
        <span className={styles.tileBadge} aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path
              d="M3 8h10m-4-4 4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
      </span>
    </Link>
  );
}

export default function Memes() {
  return (
    <>
      <Head>
        <title>The Memes by 6529 &mdash; OM Pub</title>
        <meta
          name="description"
          content="The Memes by 6529 is a CC0 NFT collection advocating for the open metaverse. Browse the prememe museum — the full archive of artist previews by @Wintermute."
        />
        <meta property="og:url" content="https://om.pub/memes" />
        <meta property="og:title" content="The Memes by 6529 — OM Pub" />
        <meta
          property="og:description"
          content="A digital revolution unfurls. Plus the prememe museum — every prememe by @Wintermute, in one place."
        />
        <meta property="og:image" content="/om-pub-logo.png" />
      </Head>

      <Header />

      <main className={styles.page}>
        {/* ───── Hero ───── */}
        <section className={styles.hero} aria-label="The Memes">
          <div className={styles.heroBackdrop} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className="eyebrow">The Memes &middot; by 6529</span>
              <h1 className={styles.heroTitle}>
                A digital revolution{" "}
                <span className={styles.heroAccent}>unfurls</span>.
              </h1>
              <p className={styles.heroSub}>
                A CC0 NFT collection by{" "}
                <a
                  href="https://twitter.com/punk6529"
                  target="_blank"
                  rel="noreferrer"
                >
                  Punk6529
                </a>{" "}
                and{" "}
                <a
                  href="https://twitter.com/6529er"
                  target="_blank"
                  rel="noreferrer"
                >
                  6529er
                </a>
                . Memetic art on Ethereum, designed for mass adoption of the
                open metaverse.
              </p>
              <div className={styles.heroActions}>
                <a
                  href="https://6529.io/the-memes"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Browse on 6529.io
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 2.5h6v6M3 9l6-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </a>
                <Link href="#museum" className="btn btn-ghost">
                  Visit the prememe museum
                </Link>
                <Link href="/memes/boosted" className="btn btn-ghost">
                  Make a boosted reaction
                </Link>
              </div>
            </div>

            <div className={styles.heroFacts}>
              <div className={styles.heroFact}>
                <span className={styles.heroFactValue}>15</span>
                <span className={styles.heroFactLabel}>Seasons</span>
              </div>
              <div className={styles.heroFact}>
                <span className={styles.heroFactValue}>{PREMEMES.length}+</span>
                <span className={styles.heroFactLabel}>Artists</span>
              </div>
              <div className={styles.heroFact}>
                <span className={styles.heroFactValue}>CC0</span>
                <span className={styles.heroFactLabel}>Forever</span>
              </div>
              <div className={styles.heroFact}>
                <span className={styles.heroFactValue}>ERC&#8209;1155</span>
                <span className={styles.heroFactLabel}>On Ethereum</span>
              </div>
            </div>
          </div>
        </section>

        {/* ───── Explainer ───── */}
        <section className={styles.section} aria-labelledby="about-the-memes">
          <div className={styles.sectionHead}>
            <span className="eyebrow">About</span>
            <h2 id="about-the-memes">
              Not just an NFT collection.{" "}
              <span className={styles.heroAccent}>A movement.</span>
            </h2>
          </div>

          <div className={styles.explainer}>
            <div>
              <h3>What is The Memes?</h3>
              <p>
                The Memes by 6529 is a digital insurgency &mdash; an array of
                meme-themed ERC-1155 NFTs minted on a standalone Manifold
                contract, with the art preserved in the globally distributed
                vault of Arweave.
              </p>
              <p>
                The collection is more than art. It&rsquo;s a long-term effort
                to spread awareness and ownership of the open metaverse: a
                digital existence that runs on public protocols, not corporate
                servers.
              </p>
            </div>
            <div>
              <h3>Why does it matter?</h3>
              <p>
                Every meme is CC0. When it&rsquo;s minted, it&rsquo;s released
                into the public domain &mdash; free to use, remix, and share.
                Permission granted: you don&rsquo;t need to ask.
              </p>
              <p>
                Read more at{" "}
                <a
                  href="https://6529.io/about/faq"
                  target="_blank"
                  rel="noreferrer"
                >
                  6529.io
                </a>
                , or browse all artists who have contributed via the{" "}
                <Link href="/memes/artists">artist directory</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* ───── Prememe Museum ───── */}
        <section
          id="museum"
          className={styles.section}
          aria-labelledby="museum-title"
        >
          <div className={styles.sectionHead}>
            <span className="eyebrow">The Prememe Museum</span>
            <h2 id="museum-title">
              The full archive of{" "}
              <span className={styles.heroAccent}>prememes</span>.
            </h2>
            <p className={styles.sectionLede}>
              For several seasons of The Memes, we made a prememe for each artist 
              before their card minted &mdash; an introduction to their style and a 
              glimpse of what was to come. The practice has wound down. What remains 
              is an archive: an exhibition of every prememe ever made, all in one place.
            </p>
          </div>

          <aside className={styles.wintermuteCard} aria-label="Artist credit">
            <span className={styles.wintermuteAvatar} aria-hidden="true">
              W
            </span>
            <div className={styles.wintermuteText}>
              <span className={styles.wintermuteLabel}>All prememes by</span>
              <span className={styles.wintermuteName}>@Wintermute</span>
              <p className={styles.wintermuteBlurb}>
                Every poster you&rsquo;ll see below was created by Wintermute
                &mdash; the resident prememe artist for The Memes by 6529.
              </p>
            </div>
            <a
              href="https://twitter.com/wintermute_art"
              target="_blank"
              rel="noreferrer"
              className={styles.wintermuteLink}
            >
              Follow @Wintermute
              <svg
                width="14"
                height="14"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path
                  d="M3.5 2.5h6v6M3 9l6-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </a>
          </aside>

          <div className={styles.gallery}>
            {PREMEMES.map((p) => (
              <PrememeTile key={p.tokenId} p={p} />
            ))}
          </div>

          <div className={styles.museumFooter}>
            <p>
              {PREMEMES.length} prememes &middot; one artist &middot; one open
              metaverse
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
