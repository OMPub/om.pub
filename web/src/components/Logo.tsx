import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.scss";

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  href?: string | null;
  priority?: boolean;
  className?: string;
}

export default function Logo({
  size = 36,
  withWordmark = true,
  href = "/",
  priority = false,
  className,
}: LogoProps) {
  const inner = (
    <span className={[styles.logo, className].filter(Boolean).join(" ")}>
      <span className={styles.mark} style={{ width: size, height: size }}>
        <Image
          src="/om-pub-logo.png"
          alt="OM Pub logo"
          width={size}
          height={size}
          priority={priority}
          className={styles.markImg}
        />
      </span>
      {withWordmark && (
        <span className={styles.wordmark}>
          <span className={styles.om}>OM</span>
          <span className={styles.dot}>.</span>
          <span className={styles.pub}>PUB</span>
        </span>
      )}
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} className={styles.link} aria-label="OM Pub home">
      {inner}
    </Link>
  );
}
