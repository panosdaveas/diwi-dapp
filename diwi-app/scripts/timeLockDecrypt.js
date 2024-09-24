import { useContext } from "react";
const { timelockDecrypt, roundAt } = require("tlock-js");
const { quicknetClient } = require("drand-client");
// import { CustomContext } from "@/app/Context/context";

const decrypt = async (client, ciphertext, decryptionTime) => {
        const plaintext = await timelockDecrypt(ciphertext, client);
        return {
            plaintext,
            decryptionTime,
            ciphertext
        };
    };

export default decrypt;
