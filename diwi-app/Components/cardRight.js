import React, { useContext, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Textarea,
  IconButton,
} from "@material-tailwind/react";
import decrypt from "@/scripts/timeLockDecrypt";
import { CustomContext } from "@/app/Context/context";
import { NextResponse } from "next/server";

export function MessageCardRight() {
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

  const handleDecrypt = async () => {
    let decrypted;
    try {
      const response = await fetch("./api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Decryption failed");
      }
      decrypted = await response.json();
    } catch (error) {
        console.error("Error during encryption:", error);
    //   setData({
    //     message: error,
    //   });
    }
    //   setData({ 
    //     decryptedMessage: decrypted,
    //     message: JSON.stringify(decrypted)
    //   });
  };

  return (
    <>
      <Card className="mt-6 w-96">
        <div className="flex items-center justify-between"></div>
        <CardBody>
          {/* <CustomContext.Provider value={data[0]}>
                    <h1></h1>
                    </CustomContext.Provider> */}
          <div className="grid gap-6">
            {/* <CustomContext.Provider value={data.ciphertext}> */}
            <Textarea
              label="Message"
              name="message"
              value={data.message}
              // value={ciphertext}
              onChange={handleInputChange}
              rows={10}
            />
            {/* </CustomContext.Provider> */}
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
            <Button variant="text" color="gray" onClick={handleOpen}>
              Cancel
            </Button>
            <Button variant="gradient" color="gray" onClick={handleDecrypt}>
              Decrypt
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
