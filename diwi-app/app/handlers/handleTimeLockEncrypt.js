import timeLockEncryption from "@/app/utils/timeLockEncrypt";

const handleTimeLockEncryption = async (formData) => {
  // const { data, setData } = useContext(CustomContext);
  try {
    const result = await timeLockEncryption(formData);
    setData((prevData) => ({
      ...prevData,
      message: result.ciphertext,
      ciphertext: result.ciphertext,
      plaintext: result.plaintext,
      client: result.client,
      decryptionTime: result.decryptionTime,
      addressRecipient: formData.address,
    }));
  } catch (error) {
    console.error("Error during encryption:", error);
  }
};

export default handleTimeLockEncryption;
