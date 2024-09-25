const { timelockDecrypt } = require("tlock-js");

const decrypt = async (client, ciphertext, decryptionTime) => {
  const plaintext = await timelockDecrypt(ciphertext, client);
  return {
    plaintext: plaintext.toString(),
    decryptionTime,
    ciphertext,
  };
};

export default decrypt;
