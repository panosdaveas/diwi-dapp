const { ethers } = require("ethers");

// The private key provided
const privateKey =
  "c9aadf17ad429b64f83546c751e59e22400038a2d0ec341901fbe7ab446a8615";
async function getPublicKey() {
  try {
    // Create a wallet instance from the private key
    const wallet = new ethers.Wallet(privateKey);

    // Get the signer object
    const signer = wallet.connect(ethers.provider);

    // Get the public key
    const publicKey = await signer.signMessage("");
    const expandedPublicKey = ethers.SigningKey.recoverPublicKey(
      ethers.hashMessage(""),
      publicKey
    );

    console.log("Expanded Public Key:", expandedPublicKey);
    console.log("Address:", wallet.address);

    // Verify the relationship between public key and address
    const addressFromPublicKey = ethers.getAddress(
      ethers.keccak256("0x" + expandedPublicKey.slice(4).slice(-40))
    );
    console.log("Address derived from public key:", addressFromPublicKey);
    console.log(
      "Addresses match:",
      wallet.address.toLowerCase() === addressFromPublicKey.toLowerCase()
    );
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

getPublicKey();
