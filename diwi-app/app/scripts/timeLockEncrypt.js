const { timelockEncrypt, roundAt, timelockDecrypt } = require("tlock-js");
const { quicknetClient, testnetQuicknetClient } = require("drand-client");

const timeLockEncryption = async (formData) => {
  const plaintext = formData.message;
  // const decryptionTime = formData.dateTime;
  const decryptionTime = Date.now() + 10000;
  let client;
  try {
    client = await quicknetClient();
  } catch (error) {
    console.error("An error occurred:", error);
  }
  const chainInfo = await client.chain().info();
  const roundNumber = await roundAt(decryptionTime, chainInfo);

  const ciphertext = await timelockEncrypt(
    roundNumber,
    Buffer.from(plaintext),
    client
  );
  return {
    plaintext,
    decryptionTime,
    ciphertext,
    client,
  };
};

export default timeLockEncryption;