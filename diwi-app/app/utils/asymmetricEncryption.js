import EthCrypto from "eth-crypto";

//encrypt with public key
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
//generate key pair
export function generateKeyPair() {
  const identity = EthCrypto.createIdentity();
  console.log("publicKey:", identity.publicKey);  
  console.log("privateKey:", identity.privateKey);  
  return {
    publicKey: identity.publicKey,
    privateKey: identity.privateKey
  };
}

