import { CustomContext } from "@/app/Context/context";
import { useContext } from "react";
import { encryptWithPublicKey } from "../utils/asymmetricEncryption";
import { timeLockEncryption } from "../utils/timeLockEncrypt";
import { decryptWithPrivateKey } from "../utils/asymmetricEncryption";

export function handleScripts() {

  const { data, setData } = useContext(CustomContext);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

  const handleDateTimeChange = (dateTime) => {
    setData((prevData) => ({
      ...prevData,
      dateTime: dateTime,
    }));
  };

  const handleTimeLockEncrypt = async () => {
    try {
      const result = await timeLockEncryption(data.dateTime, data.message);
      setData((prevData) => ({
        ...prevData,
        message: result.ciphertext,
        client: result.client,
        decryptionTime: result.decryptionTime,
        displayMessageEncrypted: result.ciphertext,
        tlEncrypted: "true",
      }));
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  const handleAsymmetricEncryption = async () => {
    //encrypt with public key
    const encrypted = await encryptWithPublicKey(
      data.publicKey,
      data.plaintext
    );
    setData((prevData) => ({
      ...prevData,
      message: encrypted,
      displayMessage: encrypted,
      displayMessageEncrypted: encrypted,
    }));
  };

  const handleAsymmetricDecryption = async () => {
    const message = await decryptWithPrivateKey(data.privateKey, data.message);
    setData((prevData) => ({
      ...prevData,
      displayMessageEncrypted: message,
      ciphertext: message,
    }));
  };

  const handleTimeLockDecryption = async () => {
    try {
      const response = await fetch("./api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Decryption failed");
      } else {
        const decrypted = JSON.stringify(await response.json());
        const decryptedMessageString = JSON.parse(decrypted);
        setData((prevState) => ({
          ...prevState,
          message: decryptedMessageString.decrypted,
          displayMessageEncrypted: decrypted,
          tlEncrypted: "false",
        }));
      }
    } catch (error) {
      console.error("Error during decryption:", error);
      const errorLog = "Patience young padawan..." + error;
      setData((prevState) => ({
        ...prevState,
        displayMessageEncrypted: errorLog,
      }));
    }
  };


  return {
    handleAsymmetricDecryption,
    handleTimeLockDecryption,
    handleAsymmetricEncryption,
    handleTimeLockEncrypt,
    handleDateTimeChange,
    handleInputChange,
  };
}
