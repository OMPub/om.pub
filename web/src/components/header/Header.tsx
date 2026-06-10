import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Header.module.scss";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Memes", href: "/memes" },
  { label: "RSO", href: "/rso" },
  { label: "Naka", href: "/naka" },
  { label: "Rep", href: "/rep" },
  { label: "FAQ", href: "/faq" },
];

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handle = () => setOpen(false);
    router.events.on("routeChangeStart", handle);
    return () => router.events.off("routeChangeStart", handle);
  }, [router.events]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={[
          styles.header,
          scrolled ? styles.scrolled : "",
          open ? styles.menuOpen : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.inner}>
          <Logo priority />

          <nav className={styles.nav} aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[styles.link, isActive(item.href) ? styles.linkActive : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <ThemeToggle className={styles.themeToggle} />
            <Link href="/contact" className={`btn btn-primary ${styles.cta}`}>
              Contact
            </Link>
            <button
              className={styles.menuBtn}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={[styles.sheet, open ? styles.sheetOpen : ""]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
      >
        <nav className={styles.sheetNav} aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[styles.sheetLink, isActive(item.href) ? styles.sheetLinkActive : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className={`btn btn-primary ${styles.sheetCta}`}>
            Contact us
          </Link>
        </nav>
      </div>
    </>
  );
}
