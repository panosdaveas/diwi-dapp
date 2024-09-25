"use client";

import { createContext, useState } from "react";

export const CustomContext = createContext({
  message: "",
  ciphertext: "",
  plaintext: "",
  client: null,
  decryptionTime: "",
  decryptedMessage: ""
});

export default function AppProvider({ children }) {
    const [data, setData] = useState({
      ciphertext: "",
      plaintext: "",
      client: null,
      decryptionTime: ""
    });

    return (
        <CustomContext.Provider value={{ data, setData }}>
            {children}
        </CustomContext.Provider>
    );
}
