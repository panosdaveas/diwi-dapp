import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import {
  arbitrum,
  avalancheFuji,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

const ganacheChain = {
  // ...ganache,
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

// const avalancheChain = {
//   ...avalanche,
//   id: 43113, // Default Ganache chain ID
//   name: "Avalanche",
//   network: "fuji",
//   nativeCurrency: {
//     decimals: 18,
//     name: "Avalanche",
//     symbol: "AVAX",
//   },
//   rpcUrls: {
//     default: { http: ["https://api.avax-test.network/ext/bc/C/rpc"] },
//     public: { http: ["https://api.avax-test.network/ext/bc/C/rpc"] },
//   },
// };

// const avalanche = {
//   id: 43114,
//   name: 'Avalanche',
//   network: 'fuji',
//   iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
//   iconBackground: '#fff',
//   nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://api.avax-test.network/ext/bc/C/rpc"] },
//   },
//   blockExplorers: {
//     default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io/' },
//   },
//   // contracts: {
//   //   multicall3: {
//   //     address: '0xca11bde05977b3631167028862be2a173976ca11',
//   //     blockCreated: 11_907_934,
//   //   },
//   // },
// };

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
    avalancheFuji,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [sepolia, avalancheFuji]
      : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [ganacheChain.id]: http(),
    [avalancheFuji.id]: http(),
  },
  
});
