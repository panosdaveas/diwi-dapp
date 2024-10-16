import { CustomContext } from "@/app/Context/context";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    IconButton,
    Input
} from "@material-tailwind/react";
import { useContext } from "react";
import { DateTimePicker } from "./dateTimePicker";
import { TextareaCustom } from "./textarea";
import { handleScripts } from "../scripts/handles";
import { ClipboardDefault } from "./clipboard";

export function SignerDashboard() {

    const {
        handleDateTimeChange,
        handleInputChange,
        handleEncrypt,
        handleClearInputSigner,
    } = handleScripts();

    const { data, setData } = useContext(CustomContext);

    return (
        <>
            <Card className="w-full shadow-none border border-borderColor bg-bkg text-content">
                <div className="flex items-center justify-between"></div>
                <CardBody>
                    <div className="grid gap-6">
                        <Input
                            readOnly={true}
                            label="Public Key"
                            name="publicKey"
                            value={data.publicKey}
                            onChange={handleInputChange}
                            className="text-content overflow-hidden overflow-ellipsis"
                            labelProps={{ className: "peer-placeholder-shown:text-content" }}
                        />
                        <DateTimePicker
                            selectedDate={new Date()}
                            onChange={handleDateTimeChange}
                        />
                        <div className="flex grid-cols-2 gap-6">
                        <TextareaCustom
                            label="Message"
                            name="plaintext"
                            value={data.plaintext}
                            onChange={handleInputChange}
                            rows={7}
                        />
                        <TextareaCustom
                            readOnly={true}
                            label="Encrypted message"
                            name="displayMessageEncrypted"
                            value={data.displayMessage}
                            rows={7}
                        />
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="flex w-full justify-between">
                    <ClipboardDefault content={data.displayMessage} />
                    <div className="flex gap-2">
                        <Button variant="text"
                            className="text-content"
                            onClick={handleClearInputSigner}>
                            Clear
                        </Button>
                        <Button variant="gradient"
                            onClick={handleEncrypt}
                        >
                            Encrypt
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
