import EthCrypto from "eth-crypto";
import { Main } from "next/document";

export async function encryptWithPublicKey(publicKey, message) {
  try {
    const encrypted = await EthCrypto.encryptWithPublicKey(
      publicKey, // hex string
      message // plain text
    );
    return EthCrypto.cipher.stringify(encrypted);
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}
//decrypt with private key
export async function decryptWithPrivateKey(privateKey, encrypted) {
  try {
    const decrypted = await EthCrypto.decryptWithPrivateKey(
      privateKey, // hex string
      encrypted // encrypted text
    );
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
}
// In utils/encryption.js
export function generateKeyPair() {
  const identity = EthCrypto.createIdentity();
  return {
    publicKey: identity.publicKey,
    privateKey: identity.privateKey
  };
}

