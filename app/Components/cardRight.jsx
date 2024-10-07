import { CustomContext } from "@/app/Context/context";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Textarea,
} from "@material-tailwind/react";
import { useContext } from "react";
import { decryptWithPrivateKey } from "../utils/asymmetricEncryption";
import { ClipboardDefault } from "./clipboard";

export function CardRightSteps() {
  const { data, setData } = useContext(CustomContext);

  const handleClear = () => {
    setData((prevData) => ({
      ...prevData,
      message: "",
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
        // console.log(decryptedMessageString.decrypted);
        // console.log(await decryptWithPrivateKey(data.privateKey, decryptedMessageString.decrypted));
        setData((prevState) => ({
          ...prevState,
          message: decryptedMessageString.decrypted,
          displayMessageEncrypted: decrypted,
        })
        );
      }
    } catch (error) {
      console.error("Error during decryption:", error);
      const errorLog =
        "Patience young padawan..." + error;
      setData((prevState) => ({
        ...prevState,
        displayMessageEncrypted: errorLog,
      }));
    }
  };

  return (
    <>
      <Card className="w-full shadow-none rounded-none border-b border-l border-t border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark">
        <div className="flex items-center justify-between"></div>
        <CardBody>
          <div className="grid gap-6">
            <Textarea
              readOnly={true}
              label="Encrypted message"
              name="displayMessageEncrypted"
              value={data.displayMessageEncrypted}
              rows={10}
            />
          </div>
        </CardBody>
        <CardFooter className="flex w-full justify-between py-1.5">
          <ClipboardDefault content={data.displayMessageEncrypted} />
          <div className="flex gap-2">
            <Button variant="text" color="gray" onClick={handleClear}>
              Clear
            </Button>
            {/* //if active step is 0 then onClick handleAsssymetricDecryption else handleTimeLockDecryption  */}
            {data.activeStep === 0 ? <Button variant="gradient" color="gray" onClick={handleAsymmetricDecryption}>
              Decrypt
            </Button> : <Button variant="gradient" color="gray" onClick={handleTimeLockDecryption}>
              Decrypt
            </Button>}
            {/* // <Button variant="gradient" color="gray" onClick={handleDecrypt}> */}
            {/* Decrypt */}
            {/* </Button> */}
            <Button onClick={handleAsymmetricDecryption}>here</Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
