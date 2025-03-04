const { timelockEncrypt, roundAt } = require("tlock-js");
const { quicknetClient, testnetQuicknetClient } = require("drand-client");

const timeLockEncryption = async (dateTime, message) => {
  // const plaintext = message;
  const decryptionTime = dateTime.getTime();
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
    Buffer.from(message),
    client
  );
  return {
    // plaintext,
    decryptionTime,
    ciphertext,
    client,
  };
};

export { timeLockEncryption };
