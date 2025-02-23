import {
    Popover,
    PopoverHandler,
    PopoverContent,
    Button,
    Input,
    Typography,
    Textarea,
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { useContractInteraction } from "@/app/scripts/interact";

export function NewWillPopOver() {
    const [targetAddress, setTargetAddress] = useState("");
    const [message, setMessage] = useState("");
    const [resultNotification, setResult] = useState("");

    const {
        requestPublicKey,
    } = useContractInteraction();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleRequestPublicKey = async () => {
        if (!targetAddress || !message) return;
        const result = await requestPublicKey(targetAddress, message);
        setResult(result);
        // if (result.success) {
        //     setIsPopoverOpen(false);
        // }
    };

    return (
        <Popover placement="bottom-start" open={isPopoverOpen} handler={setIsPopoverOpen}>
            <PopoverHandler>
                <Button variant="gradient" onClick={() => setIsPopoverOpen(true)}>New Request</Button>
            </PopoverHandler>
            <PopoverContent className="w-200">
                <Typography variant="h6" color="blue-gray" className="mb-6">
                    Request the public key from a recipient
                </Typography>
                <div className="flex flex-col gap-4">
                    <Input
                        variant="standard"
                        placeholder="Enter target address"
                        label="Target Address"
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    <Input
                        variant="standard"
                        placeholder="Enter your message"
                        label="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                </div>
                <div className="pt-20">
                    <Button variant="gradient" className="flex-shrink-0"
                    onClick={handleRequestPublicKey}
                    >
                        Submit
                    </Button>
                    {resultNotification.success ?
                    <a className="pl-4" href={resultNotification.blockExplorerUrl} target="_blank" rel="noopener noreferrer">
                        View in block explorer
                    </a> :
                    <a> {resultNotification.error} </a>}
                </div>
            </PopoverContent>
        </Popover>
    );
}
