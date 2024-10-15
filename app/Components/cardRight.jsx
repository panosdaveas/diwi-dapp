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
import { ClipboardDefault } from "./clipboard";
import { handleScripts } from "../scripts/handles";

export function CardRightSteps() {
  const { data, setData } = useContext(CustomContext);

  const {
    handleAsymmetricDecryption,
    handleTimeLockDecryption,
    handleInputChange,
  } = handleScripts();

  const handleClear = () => {
    setData((prevData) => ({
      ...prevData,
      message: "",
      privateKey: "",
      displayMessageEncrypted: "",
    }));
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
              <Button variant="gradient" color="gray" onClick={data.tlEncrypted === "true" ? handleTimeLockDecryption : handleAsymmetricDecryption}>
                Decrypt
              </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
