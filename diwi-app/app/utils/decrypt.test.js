const {
  timelockEncrypt,
  timelockDecrypt,
  roundAt,
} = require("tlock-js");

const {
  ChainClient, quicknetClient,
  testnetQuicknetClient,
  HttpChainClient,
} = require("drand-client");
const { setTimeout } = require("timers/promises");

const encryptionForm = {
  plaintext: "blah",
  decryptionTime: Date.now(),
};

async function encrypt(client, plaintext, decryptionTime) {
  const chainInfo = await client.chain().info();
  const roundNumber = await roundAt(decryptionTime, chainInfo);
  const ciphertext = await timelockEncrypt(
    roundNumber,
    Buffer.from(plaintext),
    client
  );
  return {
    client,
    plaintext,
    decryptionTime,
    ciphertext,
  };
}

async function decrypt(client, ciphertext, decryptionTime) {
  const plaintext = await timelockDecrypt(
    ciphertext,
    client
  );
  return {
    plaintext: plaintext.toString(),
    decryptionTime,
    ciphertext
  };
}

async function main() {
  try {
    const client = new quicknetClient();
    const result = await encrypt(
      client,
      encryptionForm.plaintext,
      encryptionForm.decryptionTime
    );
    console.log(result.ciphertext);
    const decrypted = await decrypt(result.client, result.ciphertext);
    console.log(decrypted.plaintext);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
