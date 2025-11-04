import "../styles/globals.scss";
import "../styles/fonts.scss";

import type { AppProps } from "next/app";

import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Head from "next/head";

const PROJECT_ID = "afb10f134401c95e32e266f2f343cca3";
const PROJECT_NAME = "The OM Pub";

const CHAIN_ID = parseInt(process.env.CHAIN_ID!);
const chain = CHAIN_ID === 1 ? mainnet : goerli;

// Create wagmi config
const config = createConfig({
  chains: [chain],
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
    [chain.id]: http(`https://eth-${chain.name.toLowerCase()}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
  },
});

// Create a client for React Query
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
