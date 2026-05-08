import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";
import styles from "./ThemeToggle.module.scss";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={[styles.toggle, mounted ? styles.mounted : "", className]
        .filter(Boolean)
        .join(" ")}
      data-theme={theme}
    >
      <span className={styles.track}>
        <span className={styles.thumb}>
          {/* Sun (light) */}
          <svg className={styles.sun} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="12" y1="2.5" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="21.5" />
              <line x1="2.5" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="21.5" y2="12" />
              <line x1="5" y1="5" x2="6.8" y2="6.8" />
              <line x1="17.2" y1="17.2" x2="19" y2="19" />
              <line x1="5" y1="19" x2="6.8" y2="17.2" />
              <line x1="17.2" y1="6.8" x2="19" y2="5" />
            </g>
          </svg>
          {/* Moon (dark) */}
          <svg className={styles.moon} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20.5 14.2A8 8 0 0 1 9.8 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15a.6.6 0 0 0-.7-.8z"
              fill="currentColor"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
