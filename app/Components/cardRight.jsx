import { CustomContext } from "@/app/Context/context";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Textarea,
  Input,
} from "@material-tailwind/react";
import { useContext } from "react";
import { decryptWithPrivateKey } from "../utils/asymmetricEncryption";
import { ClipboardDefault } from "./clipboard";

export function CardRightSteps() {
  const { data, setData } = useContext(CustomContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setData((prevData) => ({
      ...prevData,
      message: "",
      privateKey: "",
      displayMessageEncrypted: "",
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
      <Card className="w-full shadow-none rounded-none border border-borderColor bg-bkg text-content">
        <div className="flex items-center justify-between"></div>
        <CardBody>
          <div className="grid gap-6">
            <Input
              label="Private Key"
              name="privateKey"
              value={data.privateKey}
              onChange={handleInputChange}
              className="text-content overflow-hidden overflow-ellipsis"
              labelProps={{ className: "peer-placeholder-shown:text-content" }}
            />
            <Textarea
              readOnly={true}
              label="Encrypted message"
              name="displayMessageEncrypted"
              value={data.displayMessageEncrypted}
              rows={7}
              className="text-content"
            />
          </div>
        </CardBody>
        <CardFooter className="flex w-full justify-between">
          <ClipboardDefault content={data.displayMessageEncrypted} />
          <div className="flex gap-2">
            <Button variant="text" color="gray" onClick={handleClear} className="text-content">
              Clear
            </Button>
            {data.activeStep === 0 ? <Button variant="gradient" color="gray" onClick={handleAsymmetricDecryption}>
              Decrypt
            </Button> : <Button variant="gradient" color="gray" onClick={handleTimeLockDecryption}>
              Decrypt
            </Button>}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
