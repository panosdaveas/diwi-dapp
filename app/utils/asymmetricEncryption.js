import EthCrypto from "eth-crypto";
import { Configuration } from "@/app/config";

// Encrypt with public key
export async function encryptWithPublicKey(publicKey, message) {
  try {
    const formattedPublicKey = stripHexPrefix(publicKey);
    const encrypted = await EthCrypto.encryptWithPublicKey(
      formattedPublicKey, // hex string
      message // plain text
    );
    return EthCrypto.cipher.stringify(encrypted);
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

// Decrypt with private key
export async function decryptWithPrivateKey(privateKey, encrypted) {
  try {
    const formattedPrivateKey = stripHexPrefix(privateKey);
    const decrypted = await EthCrypto.decryptWithPrivateKey(
      formattedPrivateKey, // hex string
      encrypted // encrypted text
    );
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
}

// Generate key pair
export function generateKeyPair() {
  const identity = EthCrypto.createIdentity();
  console.log("publicKey:", identity.publicKey);
  console.log("privateKey:", identity.privateKey);
  return {
    publicKey: identity.publicKey,
    privateKey: identity.privateKey,
  };
}

// Strip the prefix "0x" from the public key if present
const stripHexPrefix = (publicKey) => {
  return publicKey.startsWith("0x") ? publicKey.slice(2) : publicKey;
};
