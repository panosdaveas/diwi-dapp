const crypto = require("crypto");
const { timelockEncrypt, roundAt } = require("tlock-js");
const { DrandHttpClient, roundForTime } = require("drand-client");
const fetch = require("node-fetch"); // For environments without global fetch
const { quicknetClient, testnetQuicknetClient } = require("drand-client");

// Initialize drand client
// const drand = new DrandHttpClient({
//   chainHash: "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971", // Mainnet chain hash
//   urls: ["https://api.drand.sh"], // Mainnet endpoint
//   fetch,
// });

const drandClient = async() => {
      let client;
      try {
        client = await quicknetClient();
      } catch (error) {
        console.error("An error occurred:", error);
      } 
      return client;
};

// Function to perform hybrid encryption
export async function hybridEncrypt(message, publicKey, unlockTime) {
  // 1. Asymmetric Encryption (RSA)
  const bufferMessage = Buffer.from(message, "utf8");
  const rsaPublicKey = crypto.createPublicKey(stripHexPrefix(publicKey));
  const encryptedMessage = crypto.publicEncrypt(
        rsaPublicKey,
        bufferMessage
  );

  // 2. Timelock Encryption of the RSA-encrypted message
  const drand = new drandClient();
  const roundNumber = await roundAt(drand, unlockTime);
  const timelockEncryptedMessage = await timelockEncrypt(
    drand,
    roundNumber,
    encryptedMessage
  );

  // Return the timelock-encrypted message
  return timelockEncryptedMessage.toString("base64");
}

// Strip the prefix "0x" from the public key if present
const stripHexPrefix = (publicKey) => {
  return publicKey.startsWith("0x") ? publicKey.slice(2) : publicKey;
};

// Usage example
// (async () => {
//   const rsaPublicKey = `-----BEGIN PUBLIC KEY-----
//   ...Your RSA Public Key Here...
//   -----END PUBLIC KEY-----`;

//   const message = "This is a secret message.";
//   const unlockTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

//   const encryptedPayload = await hybridEncrypt(
//     message,
//     rsaPublicKey,
//     unlockTime
//   );
//   console.log("Encrypted Payload:", encryptedPayload);
// })();
