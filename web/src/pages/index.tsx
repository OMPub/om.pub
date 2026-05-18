import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { CSSProperties, ElementType, ReactNode } from "react";

import styles from "@/styles/Home.module.scss";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import AutoTyping from "@/components/AutoTyping";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

interface Project {
  href: string;
  title: string;
  blurb: string;
  art: string;
  artPos?: string;
  tag?: string;
  tagGhost?: string;
  size: "xl" | "l" | "m" | "s" | "full";
  external?: boolean;
}

const PROJECTS: Project[] = [
  {
    href: "/memes",
    title: "The Memes",
    blurb:
      "Memetic art for the open metaverse — a CC0 NFT collection by 6529, with 15 seasons of artist collaborations.",
    art: "/the-memes/85-w1500.png",
    artPos: "center 30%",
    tag: "Flagship",
    size: "xl",
  },
  {
    href: "/naka",
    title: "Naka",
    blurb:
      "Tribute to a vision: the Nakamoto memorial, on-chain.",
    art: "/meme-card-images/Season_1/16-ombuidling.png",
    tagGhost: "Tribute",
    size: "l",
  },
  {
    href: "/rep",
    title: "Rep Filter",
    blurb:
      "Browse and filter the 6529 reputation graph by handle, category, and direction.",
    art: "/meme-card-images/Season_1/22-jpegs-are-infinite.png",
    tagGhost: "Tool",
    size: "m",
  },
  {
    href: "/vote",
    title: "Vote",
    blurb:
      "Snapshot-style on-chain polling for the OM community.",
    art: "/meme-card-images/Season_1/21-open-roads-open-metaverse.png",
    tagGhost: "Beta",
    size: "m",
  },
  {
    href: "/contact",
    title: "More on the way",
    blurb:
      "New experiments are brewing. Tell us what to build next.",
    art: "/meme-card-images/Season_8/258-the-memetic-path.png",
    tagGhost: "Soon",
    size: "full",
  },
];

interface Pillar {
  num: string;
  title: string;
  banner: string;
  bannerLabel: string;
  body: ReactNode;
}

const PILLARS: Pillar[] = [
  {
    num: "Pillar 01",
    title: "Equitable Access",
    banner: "/the-memes/74-banner.png",
    bannerLabel: "Meme #74",
    body: (
      <>
        <p>
          The open metaverse must be available to all — without permissioned
          choke points or centralized databases of control. We advocate for
          open protocols that promote universal inclusivity and
          interoperability.
        </p>
        <p>
          Equitable access empowers individuals, and makes the benefits
          transparent, fair, and open to everyone.
        </p>
      </>
    ),
  },
  {
    num: "Pillar 02",
    title: "Data Ownership",
    banner: "/the-memes/67-banner.png",
    bannerLabel: "Meme #67",
    body: (
      <>
        <p>
          Personal ownership of data defines the essence of the open metaverse.
          Individuals control their data — who can access it, how it&rsquo;s
          used, and when it&rsquo;s deleted.
        </p>
        <p>
          With complete data ownership you can make wise choices regarding
          your information, benefit from its value, and ensure your privacy
          is protected.
        </p>
      </>
    ),
  },
  {
    num: "Pillar 03",
    title: "Digital Rights",
    banner: "/the-memes/85-banner.png",
    bannerLabel: "Meme #85",
    body: (
      <>
        <p>
          Digital rights are human rights. The open metaverse must respect and
          protect dignity, privacy, and freedom of expression in the digital
          realm.
        </p>
        <p>
          We support frameworks like the{" "}
          <a
            href="https://digitalrightscharter.org/"
            target="_blank"
            rel="noreferrer"
          >
            Global Digital Rights Charter
          </a>{" "}
          as we navigate the metaverse together.
        </p>
      </>
    ),
  },
  {
    num: "Pillar 04",
    title: "Freedom to Transact",
    banner: "/the-memes/4-banner.png",
    bannerLabel: "Meme #4",
    body: (
      <>
        <p>
          The open metaverse is built on the freedom to transact. The goal is
          to free users from unnecessary permissions or intermediaries that
          could hinder innovation and economic growth.
        </p>
        <p>
          Through permissionless and direct transactions, the open metaverse
          unlocks innovation and economic empowerment.
        </p>
      </>
    ),
  },
];

function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const Element = as;
  return (
    <Element
      className={[styles.reveal, className || ""].filter(Boolean).join(" ")}
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Element>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>OM Pub &mdash; A future that is open</title>
        <meta
          name="description"
          content="OM Pub is a community-built home for the open metaverse: equitable access, data ownership, digital rights, and the freedom to transact."
        />
        <meta property="og:url" content="https://om.pub" />
        <meta property="og:title" content="OM Pub — A future that is open" />
        <meta
          property="og:description"
          content="Welcome to the OM Pub. We're building the open metaverse — together."
        />
        <meta property="og:image" content="/om-pub-logo.png" />
      </Head>

      <Header />

      <main className={styles.page}>
        {/* ───── Hero ───── */}
        <section className={styles.hero} aria-label="Welcome">
          <div className={styles.heroBackdrop} aria-hidden="true">
            <div className={styles.heroBlobA} />
            <div className={styles.heroBlobB} />
            <div className={styles.heroMosaic} />
          </div>

          <div className={styles.heroGrid}>
            <Reveal className={styles.heroCopy}>
              <span className={`eyebrow ${styles.heroEyebrow}`}>
                OM Pub &middot; The Open Metaverse, on tap
              </span>
              <h1 className={styles.heroTitle}>
                A future that is
                <br />
                <span className={styles.typed}>
                  <AutoTyping
                    strings={[
                      "open",
                      "shared",
                      "decentralized",
                      "free",
                      "self-sovereign",
                      "communal",
                      "yours",
                    ]}
                  />
                </span>
              </h1>
              <p className={styles.heroSub}>
                Welcome to the OM Pub. Whether you&rsquo;re a newbie or a maxi,
                pull up a stool. We&rsquo;re building a digital existence that
                runs on public protocols &mdash; not corporate servers.
              </p>
              <div className={styles.heroCtas}>
                <Link href="#projects" className="btn btn-primary">
                  Explore projects
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M3 8h10m-4-4 4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </Link>
                <Link href="#manifesto" className="btn btn-ghost">
                  Read the manifesto
                </Link>
              </div>
              <div className={styles.heroBadges}>
                <span className={styles.heroBadge}>CC0 &middot; for all, forever</span>
                <span className={styles.heroBadge}>Built on Ethereum</span>
                <span className={styles.heroBadge}>15 seasons strong</span>
              </div>
            </Reveal>

            <Reveal delay={140} className={styles.heroVisual}>
              <div className={styles.heroLogoRing} aria-hidden="true" />
              <div className={styles.heroLogoOrb}>
                <Image
                  src="/om-pub-logo.png"
                  alt="OM Pub"
                  width={520}
                  height={520}
                  priority
                  className={styles.heroLogoImg}
                />
              </div>
              <div className={styles.heroOrbit} aria-hidden="true">
                <span className={`${styles.heroChip} ${styles.heroChip1}`}>
                  Open Protocols
                </span>
                <span className={`${styles.heroChip} ${styles.heroChip2}`}>
                  Public Domain
                </span>
                <span className={`${styles.heroChip} ${styles.heroChip3}`}>
                  Self&#8209;Sovereign
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───── Stats strip ───── */}
        <section className={styles.section} aria-label="At a glance">
          <Reveal>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>15</span>
                <span className={styles.statLabel}>Meme Seasons</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>450+</span>
                <span className={styles.statLabel}>CC0 Works of Art</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>Mints per Week</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>∞</span>
                <span className={styles.statLabel}>Open Forever</span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ───── Manifesto ───── */}
        <section
          id="manifesto"
          className={styles.section}
          aria-labelledby="manifesto-title"
        >
          <Reveal>
            <div className={styles.manifesto}>
              <div className={styles.manifestoHead}>
                <span className="eyebrow">The Manifesto</span>
                <h2 id="manifesto-title" className={styles.manifestoQuote}>
                  It&rsquo;s time. We must build the open metaverse.
                </h2>
              </div>
              <div className={styles.manifestoBody}>
                <p>
                  We need a digital existence that runs on publicly accessible
                  protocols, not corporate servers. The Pub explores the
                  pathways to building it &mdash; together.
                </p>
                <p>
                  What does it mean for the metaverse to be open? At a minimum,
                  it means upholding the values of <strong>equitable access</strong>,{" "}
                  <strong>data ownership</strong>, <strong>digital rights</strong>, and the{" "}
                  <strong>freedom to transact</strong>.
                </p>
                <p>
                  This site is dedicated to teaching these values, running
                  community experiments in decentralization, and sharing a
                  vision of the future that is open to all.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ───── Projects ───── */}
        <section
          id="projects"
          className={styles.section}
          aria-labelledby="projects-title"
        >
          <div className={styles.sectionHead}>
            <Reveal>
              <span className="eyebrow">What we&rsquo;re building</span>
              <h2 id="projects-title">
                Tools &amp; experiments,{" "}
                <span className="text-amber-grad">on the house</span>.
              </h2>
              <p className={styles.sectionLede}>
                Every project here is a community experiment in self-sovereign
                tech &mdash; open source, public domain, and free to remix.
              </p>
            </Reveal>
          </div>

          <div className={styles.projects}>
            {PROJECTS.map((p, i) => {
              const sizeClass =
                p.size === "xl"
                  ? styles.projectXL
                  : p.size === "l"
                  ? styles.projectL
                  : p.size === "m"
                  ? styles.projectM
                  : p.size === "full"
                  ? styles.projectFull
                  : styles.projectS;
              return (
                <Reveal key={p.href} delay={i * 70} className={sizeClass}>
                  <Link
                    href={p.href}
                    className={styles.project}
                    style={{ height: "100%" }}
                  >
                    <div
                      className={styles.projectArt}
                      style={{
                        backgroundImage: `url(${p.art})`,
                        backgroundPosition: p.artPos || "center",
                      }}
                      aria-hidden="true"
                    />
                    <div className={styles.projectScrim} aria-hidden="true" />
                    <div className={styles.projectMeta}>
                      {p.tag && <span className={styles.projectTag}>{p.tag}</span>}
                      {p.tagGhost && (
                        <span className={styles.projectTagGhost}>
                          {p.tagGhost}
                        </span>
                      )}
                    </div>
                    <h3 className={styles.projectTitle}>{p.title}</h3>
                    <p className={styles.projectBlurb}>{p.blurb}</p>
                    <span className={styles.projectArrow}>
                      Open
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path
                          d="M3 8h10m-4-4 4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ───── Pillars ───── */}
        <section
          id="pillars"
          className={styles.section}
          aria-labelledby="pillars-title"
        >
          <div className={styles.sectionHead}>
            <Reveal>
              <span className="eyebrow">The Four Pillars</span>
              <h2 id="pillars-title">
                What &ldquo;open&rdquo; <span className="text-amber-grad">actually means</span>.
              </h2>
              <p className={styles.sectionLede}>
                Four non-negotiable values that shape everything we build.
              </p>
            </Reveal>
          </div>

          <div className={styles.pillars}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className={styles.pillar}>
                  <div className={styles.pillarCopy}>
                    <span className={styles.pillarNum}>{p.num}</span>
                    <h3 className={styles.pillarTitle}>{p.title}</h3>
                    <div className={styles.pillarBody}>{p.body}</div>
                  </div>
                  <div className={styles.pillarBanner}>
                    <div
                      className={styles.pillarBannerImg}
                      style={{ backgroundImage: `url(${p.banner})` }}
                      aria-hidden="true"
                    />
                    <div className={styles.pillarBannerScrim} aria-hidden="true" />
                    <span className={styles.pillarBannerLabel}>
                      {p.bannerLabel}
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───── CTA ───── */}
        <section className={styles.section} aria-labelledby="cta-title">
          <Reveal>
            <div className={styles.cta}>
              <span className="eyebrow">Pull up a stool</span>
              <h2 id="cta-title" className={styles.ctaTitle}>
                The open metaverse is{" "}
                <span className="text-amber-grad">a community project</span>.
                Every voice matters.
              </h2>
              <p className={styles.ctaLede}>
                Learn the values, mint a meme, build with us, or just hang out.
                Whatever brings you in &mdash; you&rsquo;re welcome here.
              </p>
              <div className={styles.ctaActions}>
                <Link href="/memes" className="btn btn-primary">
                  Start with The Memes
                </Link>
                <a
                  href="https://twitter.com/om_pub_/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  Follow on X
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
