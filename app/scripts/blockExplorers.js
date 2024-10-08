// Helper function to get block explorer URL based on chain ID
export function getBlockExplorerUrl(chainId, txHash) {
  const explorers = {
    1: `https://etherscan.io/tx/${txHash}`, // Ethereum Mainnet
    137: `https://polygonscan.com/tx/${txHash}`, // Polygon
    10: `https://optimistic.etherscan.io/tx/${txHash}`, // Optimism
    42161: `https://arbiscan.io/tx/${txHash}`, // Arbitrum
    8453: `https://basescan.org/tx/${txHash}`, // Base
    1337: null, // Ganache (local) - no explorer
    43113: `https://testnet.snowtrace.io/tx/${txHash}`, // Avalanche Fuji Testnet
    11155111: `https://sepolia.etherscan.io/tx/${txHash}`, // Sepolia
  };

  return explorers[chainId] || null;
};

// Helper function to get block explorer URL based on chain ID
export function getContractExplorerUrl(chainId, contractAddress) {
  const explorers = {
    1: `https://etherscan.io/address/${contractAddress}`, // Ethereum Mainnet
    137: `https://polygonscan.com/address/${contractAddress}`, // Polygon
    10: `https://optimistic.etherscan.io/address/${contractAddress}`, // Optimism
    42161: `https://arbiscan.io/address/${contractAddress}`, // Arbitrum
    8453: `https://basescan.org/address/${contractAddress}`, // Base
    1337: null, // Ganache (local) - no explorer
    43113: `https://testnet.snowtrace.io/address/${contractAddress}`, // Avalanche Fuji Testnet
    11155111: `https://sepolia.etherscan.io/address/${contractAddress}`, // Sepolia
  };

  return explorers[chainId] || null;
};
