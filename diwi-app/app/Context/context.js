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
  account: [],
  accountAddress: "",
  formattedPublicKey: null,
});

export default function AppProvider({ children }) {
    const [data, setData] = useState({
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
      account: [],
      accountAddress: "",
      formattedPublicKey: null,
    });

    return (
        <CustomContext.Provider value={{ data, setData }}>
            {children}
        </CustomContext.Provider>
    );
}
