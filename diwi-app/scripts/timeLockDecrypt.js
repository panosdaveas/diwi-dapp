const { timelockDecrypt } = require("tlock-js");
const { quicknetClient, testnetQuicknetClient } = require("drand-client");

const decrypt = async (ciphertext) => {
  const client = await testnetQuicknetClient();
  console.log(client);
  let plaintext = "";
  try {
    plaintext = await timelockDecrypt(ciphertext, client);
    console.log(plaintext);
  } catch (error) {
    console.error("An error occurred during decryption:", error);
  }
  return {
    plaintext,
    ciphertext,
  };
};

export default decrypt;
