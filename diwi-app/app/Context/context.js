"use client";

import { createContext, useState } from "react";

export const CustomContext = createContext({
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
