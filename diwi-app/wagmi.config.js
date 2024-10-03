import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  ganache,
} from "wagmi/chains";
import { http } from "wagmi";

const ganacheChain = {
  ...ganache,
  id: 1337, // Default Ganache chain ID
  name: "Ganache",
  network: "ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ganache Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://localhost:7545"] },
    public: { http: ["http://localhost:7545"] },
  },
};

export const config = getDefaultConfig({
  appName: "Diwi-Dapp",
  projectId: "9a117cc974f81a5a30b917bd3d567019",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ganacheChain,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [ganacheChain.id]: http(),
    },
  ssr: true,
});
