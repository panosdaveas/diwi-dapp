"use client";

import { createContext, useState } from "react";

export const CustomContext = createContext({
  userAddress: "",
  displayMessage: "",
  displayMessageEncrypted: "",
  ciphertext: "",
  plaintext: "",
  client: null,
  dateTime: "",
  address: "",
  decryptionTime: "",
  decryptedMessage: "",
  addressRecipient: "",
  accountAddress: "",
  chainName: "",
  activeStep: 0,
  publicKey: "",
  privateKey: "",
  messageOriginal: "",
  messageEncryptedWithPK: "",
  messageEncryptedWithTL: "",
  dateTime: new Date(),
  decrypted: "",
});

export default function AppProvider({ children }) {
    const [data, setData] = useState({
      userAddress: "",
      message: "",
      ciphertext: "",
      plaintext: "",
      client: null,
      dateTime: "",
      address: "",
      decryptionTime: "",
      decryptedMessage: "",
      addressRecipient: "",
    });

    return (
        <CustomContext.Provider value={{ data, setData }}>
            {children}
        </CustomContext.Provider>
    );
}
