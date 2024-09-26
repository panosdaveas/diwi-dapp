import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import DateTimePicker from "./dateTimePicker";
import timeLockEncryption from "../scripts/timeLockEncrypt";

export function MessageDialog() {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    dateTime: new Date(),
    message: "",
  });

  const handleOpen = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (dateTime) => {
    setFormData((prevData) => ({
      ...prevData,
      dateTime: dateTime,
    }));
  };

  const handleSubmit = async () => {
    try {
      const result = await timeLockEncryption(formData);
      console.log("Plaintext:", result.plaintext);
      console.log("Decryption Time:", result.decryptionTime);
      console.log("Ciphertext:", result.ciphertext);
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>Message</Button>
      <Dialog open={open} size="sm" handler={handleOpen}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            <Typography className="mb-1" variant="h4">
              New Message
              {/* New message to @{formData.username} */}
            </Typography>
          </DialogHeader>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleOpen}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg> */}
        </div>
        <DialogBody>
          {/* <Typography className="mb-10 -mt-7" color="gray" variant="lead">
            Write the message and then click button.
          </Typography> */}
          <div className="grid gap-6">
            <Input
              label="Address"
              name="address"
              value={formData.username}
              onChange={handleInputChange}
            />
            {/* <DateTimePicker onChange={handleDateTimeChange} /> */}
            {/* <DateTimePicker onChange={handleDateTimeChange} /> */}

            <DateTimePicker
              selectedDate={formData.dateTime}
              onChange={handleDateTimeChange}
            />

            <Textarea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={handleOpen}>
            Cancel
          </Button>
          <Button variant="gradient" color="gray" onClick={handleSubmit}>
            Send message
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
