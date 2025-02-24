import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Input,
} from "@material-tailwind/react";
import { useState } from "react";
import { useContractInteraction } from "@/app/scripts/interact";

export function DialogDefault() {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(!open);

    const [targetAddress, setTargetAddress] = useState("");
    const [message, setMessage] = useState("");
    const [resultNotification, setResult] = useState("");

    const {
        requestPublicKey,
    } = useContractInteraction();

    const handleRequestPublicKey = async () => {
        if (!targetAddress || !message) return;
        const result = await requestPublicKey(targetAddress, message);
        setResult(result);
        if (result.success) {
            handleOpen();
        }
    };

    return (
        <>
            <Button onClick={handleOpen} variant="gradient">
                New Request
            </Button>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>New request</DialogHeader>
                <DialogBody>
                    <Typography variant="h6" color="blue-gray" className="mb-6">
                        Request the public key from a recipient
                    </Typography>
                    Please type the recipient's address and a short message to them asking for their public key.
                    <div className="flex flex-col gap-4 pt-8">
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
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" className="flex-shrink-0"
                        onClick={handleRequestPublicKey}
                    >
                        Submit
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
