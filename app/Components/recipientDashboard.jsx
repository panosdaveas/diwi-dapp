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
import { RecipientTable } from "./RecipientTable";

export function RecipientDashboard() {
  const { data, setData } = useContext(CustomContext);

  const {
    handleAsymmetricDecryption,
    handleTimeLockDecryption,
    handleInputChange,
    handleDecrypt,
    handleRequests,
  } = handleScripts();

  const handleClear = () => {
    setData((prevData) => ({
      ...prevData,
      message: "",
      privateKey: "",
      displayMessage: "",
    }));
  };

  return (
    <>
      <Card className="w-full shadow-none border border-borderColor bg-bkg text-content">
        <RecipientTable />
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
            //   disabled={data.tlEncrypted ? true : false}
            />
            <Textarea
              //   readOnly={true}
              label="Encrypted message"
              name="displayMessage"
              value={data.displayMessage}
              //   value=""
              onChange={handleInputChange}
              rows={7}
              className="text-content"
            />
          </div>
        </CardBody>
        <CardFooter className="flex w-full justify-between">
          <ClipboardDefault content={data.displayMessage} />
          <div className="flex gap-2">
            <Button variant="text" color="gray" onClick={handleClear} className="text-content">
              Clear
            </Button>
            <Button variant="text" color="gray" onClick={handleRequests} className="text-content">
              Requests
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
