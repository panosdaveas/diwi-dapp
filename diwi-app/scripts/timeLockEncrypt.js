const { timelockEncrypt, roundAt } = require("tlock-js");
const { quicknetClient } = require("drand-client");

plaintext = "blah",
    decryptionTime = Date.now() + 60000;

async function encrypt(client, plaintext, decryptionTime) {
    const chainInfo = await client.chain().info();
    const roundNumber = await roundAt(decryptionTime, chainInfo);
    const ciphertext = await timelockEncrypt(roundNumber, Buffer.from(plaintext), client);
    return {
        plaintext,
        decryptionTime,
        ciphertext
    };
}

async function main() {
    try {
        const quicknet = await quicknetClient(); // Assuming this function exists
        const result = await encrypt(quicknet, plaintext, decryptionTime);
        console.log(result.ciphertext);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();