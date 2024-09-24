const { timelockEncrypt, roundAt } = require("tlock-js");
const { quicknetClient } = require("drand-client");

// import {timelockEncrypt, roundAt} from "tlock-js";
// import { quicknetClient } from "drand-client";

// plaintext = "blah",
// decryptionTime = Date.now() + 60000;

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
        ciphertext
    };
};

export default encrypt;

// export default function encrypt({formData}) {
//     const plaintext = formData.message;
//     const decryptionTime = formData.dateTime;
//     try {
//         const quicknet = await quicknetClient(); // Assuming this function exists
//         console.log(result.plaintext, '\n', result.ciphertext);
//     } catch (error) {
//         console.error('An error occurred:', error);
//     }
//     const chainInfo = await client.chain().info();
//     const roundNumber = await roundAt(decryptionTime, chainInfo);
//     const timelockEncrypt(roundNumber, Buffer.from(plaintext), client);
//     return {
//         plaintext,
//         decryptionTime,
//         ciphertext
//     };
// }

// async function main() {
//     try {
//         const quicknet = await quicknetClient(); // Assuming this function exists
//         const result = await encrypt(quicknet, plaintext, decryptionTime);
//         console.log(result.plaintext, '\n', result.ciphertext);
//     } catch (error) {
//         console.error('An error occurred:', error);
//     }
// }

// main();