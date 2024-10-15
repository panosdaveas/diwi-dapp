import { CustomContext } from "@/app/Context/context";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Input
} from "@material-tailwind/react";
import { useContext, useEffect } from "react";
import { encryptWithPublicKey } from "../utils/asymmetricEncryption";
import { timeLockEncryption } from "../utils/timeLockEncrypt";
import { DateTimePicker } from "./dateTimePicker";
import { TextareaCustom } from "./textarea";
import { truncate } from "./truncatedText";

export function CardLeftSteps() {

  useEffect(() => {
    localStorage.getItem('darkMode');
  }, []);

  const { data, setData } = useContext(CustomContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClearInput = () => {
    setData((prevData) => ({
      ...prevData,
      message: "",
      publicKey: "",
      plaintext: "",
      dateTime: new Date(),
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
      }));
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  const handleAsymmetricEncryption = async () => {
    //encrypt with public key
    const encrypted = await encryptWithPublicKey(data.publicKey, data.plaintext);
    setData((prevData) => ({
      ...prevData,
      message: encrypted,
      displayMessage: encrypted,
      displayMessageEncrypted: encrypted,
    }));
  };

  return (
    <>
      <Card className="w-full shadow-none rounded-none border border-borderColor bg-bkg text-content">
        <div className="flex items-center justify-between"></div>
        <CardBody>
          <div className="grid gap-6">
            {data.activeStep === 0 ? <Input
              label="Public Key"
              name="publicKey"
              value={data.publicKey}
              onChange={handleInputChange}
              className="text-content overflow-hidden overflow-ellipsis" 
              labelProps={{ className: "peer-placeholder-shown:text-content" }}
            /> : <DateTimePicker
              selectedDate={new Date()}
              onChange={handleDateTimeChange}
            />}
            {data.activeStep === 0 ? <TextareaCustom
              label="Message"
              name="plaintext"
              value={data.plaintext}
              onChange={handleInputChange}
              rows={7}
            /> : <TextareaCustom
              label="Message"
              name="ciphertext"
              value={data.displayMessage}
              onChange={handleInputChange}
              rows={7}
            />}
          </div>
        </CardBody>
        <CardFooter className="flex w-full justify-between">
          <IconButton variant="text" size="sm" className="stroke-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </IconButton>
          <div className="flex gap-2">
            <Button variant="text"
              className="text-content"
              onClick={handleClearInput}>
              Clear
            </Button>
            {data.activeStep === 0 ?
              <Button variant="gradient"
                onClick={handleAsymmetricEncryption}
              >
                Encrypt
              </Button> : <Button variant="gradient"
                onClick={handleTimeLockEncrypt}>
                Encrypt
              </Button>}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
