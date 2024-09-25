import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
  Textarea,
  IconButton,
} from "@material-tailwind/react";
import DateTimePicker from "./dateTimePicker";
import encrypt from "../scripts/timeLockEncrypt";
import { CustomContext } from "@/app/Context/context";

export function MessageCardLeft() {
  const { data, setData } = useContext(CustomContext);
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

  const handleCancelInput = () => {
    setFormData((prevData) => ({ ...prevData, message: "", address: ""}));
  };

  const handleDateTimeChange = (dateTime) => {
    setFormData((prevData) => ({
      ...prevData,
      dateTime: dateTime,
    }));
  };

  const handleSubmit = async () => {
    try {
      const result = await encrypt(formData);
      setData([
        result.ciphertext,
        result.plaintext,
        result.client,
        result.decryptionTime,
      ]);
      // console.log(data);
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  return (
    <>
      <Card className="mt-6 w-96">
        <div className="flex items-center justify-between"></div>
        <CardBody>
          <div className="grid gap-6">
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
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
        </CardBody>
        <CardFooter className="flex w-full justify-between py-1.5">
          <IconButton variant="text" color="blue-gray" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
            <Button variant="text" color="gray" onClick={handleCancelInput}>
              Cancel
            </Button>
            <Button variant="gradient" color="gray" onClick={handleSubmit}>
              Encrypt
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
