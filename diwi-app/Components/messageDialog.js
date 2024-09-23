import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Typography
} from "@material-tailwind/react";
import DateTimePicker from "./dateTimePicker"; 

// Assume this is the external script function we want to call
// import { sendMessage } from "./externalScript";

export function MessageDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    dateTime: "",
    message: ""
  });

  const handleOpen = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateTimeChange = (dateTime) => {
    setFormData(prevData => ({
      ...prevData,
      dateTime
    }));
  };

  const handleSubmit = () => {
    // Call the external script function with form data
    // sendMessage(formData);
    console.log(formData);
    handleOpen(); // Close the dialog after submission
  };

  return (
    <>
      <Button onClick={handleOpen}>Message</Button>
      <Dialog open={open} size="xs" handler={handleOpen}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            <Typography className="mb-1" variant="h4">
              New message to @{formData.username}
            </Typography>
          </DialogHeader>
          <svg
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
          </svg>
        </div>
        <DialogBody>
          <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
            Write the message and then click button.
          </Typography>
          <div className="grid gap-6">
            <Typography className="-mb-1" color="blue-gray" variant="h6">
              Username
            </Typography>
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <DateTimePicker onChange={handleDateTimeChange} />
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