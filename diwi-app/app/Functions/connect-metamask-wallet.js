import Web3 from "web3";

export async function connectWalletHandler() {
  let web3;
  let error = "";

  if (
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined"
  ) {
    console.log("MetaMask is installed!");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      return { web3, error: null };
    } catch (err) {
      console.log(err.message);
      error = err.message;
    }
  } else {
    console.log("MetaMask not installed!");
    error = "MetaMask not installed!";
  }

  return { web3: null, error };
}