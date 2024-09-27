import Web3 from "web3";

let web3;
const connectWalletHandler = async () => {
  let account;
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];
      // const balance = await web3.eth.getBalance(account);
      // const balanceinEth = web3.utils.fromWei(balance, "ether");
    //   console.log("Connected account:", account);
      //   const myaccount = web3.eth.accounts.encrypt()
    } catch (err) {
      console.log(err.message);
    }
  } else {
    alert("MetaMask not installed!");
    console.log("MetaMask not installed!");
  }
  return (
    account
  );
};

export default connectWalletHandler;
