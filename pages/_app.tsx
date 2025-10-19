import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import "@/styles/globals.css";

const APP_THEMES = ["light", "dark", "sepia"];

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.dataset.mode = document.documentElement.dataset.mode || "";
  }, []);

  return (
    <ThemeProvider
      attribute="data-mode"
      enableSystem
      defaultTheme="light"
      themes={APP_THEMES}
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
