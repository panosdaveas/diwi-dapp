const { timelockDecrypt } = require("tlock-js");

const decrypt = async (client, ciphertext, decryptionTime) => {
  // console.log(client, ciphertext, decryptionTime);
  const plaintext = await timelockDecrypt(ciphertext, client);
  // console.log(plaintext);
  return {
    plaintext: plaintext.toString(),
    decryptionTime,
    ciphertext,
  };
};

export default decrypt;
