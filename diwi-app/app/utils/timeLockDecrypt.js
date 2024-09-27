const { timelockDecrypt } = require("tlock-js");

const decrypt = async (data) => {
  const client = data.client;
  const ciphertext = data.ciphertext;
  const decryptionTime = data.decryptionTime;
  const plaintext = await timelockDecrypt(ciphertext, client);
  return {
    plaintext: plaintext.toString(),
    decryptionTime,
    ciphertext,
  };
};

export default decrypt;
