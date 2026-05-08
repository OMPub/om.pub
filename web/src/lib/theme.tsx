import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "om-pub-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: "dark", setTheme: () => {}, toggleTheme: () => {} };
  }
  return ctx;
}

// Inline script that runs before React hydrates so the right theme paints first frame.
// Honors ?theme=light|dark for previews; otherwise reads localStorage; otherwise dark.
export const noFlashThemeScript = `(() => { try {
  var k='${STORAGE_KEY}';
  var qs=location.search||'';
  var match=qs.match(/[?&]theme=(light|dark)/);
  var saved=localStorage.getItem(k);
  var t = match ? match[1] : (saved === 'light' || saved === 'dark' ? saved : 'dark');
  document.documentElement.setAttribute('data-theme', t);
  document.documentElement.style.colorScheme = t;
} catch(e) { document.documentElement.setAttribute('data-theme','dark'); } })();`;
