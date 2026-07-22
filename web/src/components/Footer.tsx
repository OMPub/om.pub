import Link from "next/link";
import Logo from "./Logo";
import styles from "./Footer.module.scss";

const FOOTER_NAV: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: "Projects",
    links: [
      { label: "The Memes", href: "/memes" },
      { label: "Boosted Reactions", href: "/memes/boosted" },
      { label: "Naka", href: "/naka" },
      { label: "Rep Filter", href: "/rep" },
      { label: "Meme Power Rankings", href: "/mpr" },
      { label: "Awards", href: "/awards" },
      { label: "WWOH", href: "/wwoh" },
      { label: "Races", href: "/races" },
      { label: "Vote", href: "/vote" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Manifesto", href: "/#manifesto" },
      { label: "Pillars", href: "/#pillars" },
      {
        label: "Digital Rights Charter",
        href: "https://digitalrightscharter.org/",
        external: true,
      },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "GitHub", href: "https://github.com/ompub", external: true },
      { label: "Twitter / X", href: "https://twitter.com/om_pub_/", external: true },
      { label: "Instagram", href: "https://instagram.com/the.om.pub/", external: true },
      { label: "Shop IRL", href: "https://www.shop.om.pub/", external: true },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo size={44} />
            <p className={styles.tagline}>
              <span className={styles.serif}>OM</span> &mdash; Open Metaverse.{" "}
              <span className={styles.serif}>Pub</span> &mdash; a place to hang.
              Public domain (CC0), for all, forever.
            </p>
            <div className={styles.socials}>
              <a
                href="https://github.com/ompub"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <SocialIcon icon="github" />
              </a>
              <a
                href="https://twitter.com/om_pub_/"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
              >
                <SocialIcon icon="x" />
              </a>
              <a
                href="https://instagram.com/the.om.pub/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <SocialIcon icon="instagram" />
              </a>
              <a
                href="https://www.shop.om.pub/"
                target="_blank"
                rel="noreferrer"
                aria-label="Shop"
              >
                <SocialIcon icon="shop" />
              </a>
            </div>
          </div>

          <div className={styles.cols}>
            {FOOTER_NAV.map((col) => (
              <div key={col.heading} className={styles.col}>
                <h4 className={styles.heading}>{col.heading}</h4>
                <ul>
                  {col.links.map((l) =>
                    l.external ? (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.link}
                        >
                          {l.label}
                          <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
                            <path
                              d="M3.5 2.5h6v6M3 9l6-6"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        </a>
                      </li>
                    ) : (
                      <li key={l.label}>
                        <Link href={l.href} className={styles.link}>
                          {l.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.fine}>
            &copy; {year} OM Pub. Released to the public domain (CC0).
          </p>
          <p className={styles.fine}>
            Built by the open metaverse, for the open metaverse.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: "github" | "x" | "instagram" | "shop" }) {
  const common = { width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.6 } as const;
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path
          d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.3-3.3-1.3-.4-1-1-1.3-1-1.3-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.6-.3.9 0 1.8.1 2.6.3 2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  }
  if (icon === "x") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M3 3l8 10.5L3.4 21h2.1l6.4-6.7L17.5 21H21l-8.4-11L20.4 3h-2.1l-5.9 6.2L7.4 3H3z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M4 8h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8z" />
      <path d="M8 8V6a4 4 0 1 1 8 0v2" />
    </svg>
  );
}
