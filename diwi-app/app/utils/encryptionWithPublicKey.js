import EthCrypto from "eth-crypto";

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
// In utils/encryption.js
export function generateKeyPair() {
  const identity = EthCrypto.createIdentity();
  return {
    publicKey: identity.publicKey,
    privateKey: identity.privateKey
  };
}