import { CustomContext } from "@/app/Context/context";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { useContext, useEffect } from "react";
import { encryptWithPublicKey } from "../utils/asymmetricEncryption";
import { timeLockEncryption } from "../utils/timeLockEncrypt";
import { DateTimePicker } from "./dateTimePicker";

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

  const handleCancelInput = () => {
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
      <Card className="w-full shadow-none rounded-none border-b border-r border-t border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark">
        <div className="flex items-center justify-between"></div>
        <CardBody>
          <div className="grid gap-6">
            {data.activeStep === 0 ? <Input
              label="Public Key"
              name="address"
              value={data.publicKey}
              onChange={handleInputChange}
              className="overflow-hidden overflow-ellipsis"
              color={
                typeof window !== 'undefined' ?
                  (localStorage.getItem("darkMode") === "true"
                    ? "white"
                    : "gray"
                  ) : null
              }
            /> : <DateTimePicker
              selectedDate={new Date()}
              onChange={handleDateTimeChange}
              color={localStorage.getItem('darkMode') === 'true' ? "white" : "gray"}
            />}
            {data.activeStep === 0 ? <Textarea
              label="Message"
              name="plaintext"
              value={data.plaintext}
              onChange={handleInputChange}
              rows={7}
              color={
                typeof window !== 'undefined' ?
                  (localStorage.getItem("darkMode") === "true"
                    ? "white"
                    : "gray"
                  ) : null
              }
              className="dark:focus:border-t-0"

            /> : <Textarea
              label="Message"
              name="ciphertext"
              value={data.displayMessage}
              onChange={handleInputChange}
              rows={7}
            />}
          </div>
        </CardBody>
        <CardFooter className="flex w-full justify-between py-1.5">
          <IconButton variant="text" color="blue-gray" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke={
                typeof window !== 'undefined' ?
                  (localStorage.getItem("darkMode") === "true"
                    ? "white"
                    : "gray"
                  ) : null
              }
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
              color={
                typeof window !== 'undefined' ?
                  (localStorage.getItem("darkMode") === "true"
                    ? "white"
                    : "gray"
                  ) : null
              } 
              onClick={handleCancelInput}>
              Cancel
            </Button>
            {data.activeStep === 0 ?
              <Button variant="gradient"
                // color="gray" 
                onClick={handleAsymmetricEncryption}
                color={
                  typeof window !== 'undefined' ?
                    (localStorage.getItem("darkMode") === "true"
                      ? "white"
                      : "gray"
                    ) : null
                }
              >
                Encrypt
              </Button> : <Button variant="gradient"
                // color="gray" 
                color={
                  typeof window !== 'undefined' ?
                    (localStorage.getItem("darkMode") === "true"
                      ? "white"
                      : "gray"
                    ) : null
                }
                onClick={handleTimeLockEncrypt}>
                Encrypt
              </Button>}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
