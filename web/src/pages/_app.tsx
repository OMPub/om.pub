import "../styles/globals.scss";
import "../styles/fonts.scss";

import type { AppProps } from "next/app";
import Head from "next/head";

import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, sepolia as goerli } from "viem/chains";
import { metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/lib/theme";
import Footer from "@/components/Footer";

type AppPropsWithOptions = AppProps & {
  Component: AppProps["Component"] & { hideFooter?: boolean };
};

const PROJECT_ID = "afb10f134401c95e32e266f2f343cca3";
const PROJECT_NAME = "The OM Pub";

const config = createConfig({
  chains: [mainnet, goerli],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: PROJECT_ID,
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: PROJECT_NAME,
    }),
  ],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
    [goerli.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppPropsWithOptions) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ThemeProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            {!Component.hideFooter && <Footer />}
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </>
  );
}
