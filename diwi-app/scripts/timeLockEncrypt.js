const { timelockEncrypt, roundAt } = require("tlock-js");
const { quicknetClient } = require("drand-client");

const encrypt = async (formData) => {
    const plaintext = formData.message;
    // const decryptionTime = formData.dateTime;
    const decryptionTime = Date.now() + 60000;
    let client;
    try {
        client = await quicknetClient();
    } catch (error) {
        console.error('An error occurred:', error);
    }
    const chainInfo = await client.chain().info();
    const roundNumber = await roundAt(decryptionTime, chainInfo);

    const ciphertext = await timelockEncrypt(roundNumber, Buffer.from(plaintext), client);
    return {
        plaintext,
        decryptionTime,
        ciphertext,
        client
    };
};

export default encrypt;
