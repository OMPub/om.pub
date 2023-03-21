import "../styles/globals.scss";
import "../styles/fonts.scss";

import type { AppProps } from "next/app";
import SSRProvider from "react-bootstrap/SSRProvider";

import { alchemyProvider } from "wagmi/providers/alchemy";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { mainnet, goerli } from "wagmi/chains";
import { configureChains, createClient, WagmiConfig } from "wagmi";

import Head from "next/head";

const PROJECT_ID = "afb10f134401c95e32e266f2f343cca3";
const PROJECT_NAME = "The OM Pub";

const CHAIN_ID = parseInt(process.env.CHAIN_ID!);
let chain = null;
if (CHAIN_ID == 1) {
  chain = mainnet;
} else if (CHAIN_ID == 5) {
  chain = goerli;
}

const { chains, provider } = configureChains(
  [chain!],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY! })]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: PROJECT_ID,
        showQrModal: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: PROJECT_NAME,
      },
    }),
  ],
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  pageProps.provider = provider;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SSRProvider>
        <WagmiConfig client={client}>
          <Component {...pageProps} />
        </WagmiConfig>
      </SSRProvider>
    </>
  );
}
