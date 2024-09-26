import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Textarea,
} from "@material-tailwind/react";
import { CustomContext } from "@/app/Context/context";
import { ClipboardDefault } from "./clipboard";

export function MessageCardRight() {
  const { data, setData } = useContext(CustomContext);

  const handleDecrypt = async () => {
    try {
      const response = await fetch("./api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Decryption failed");
      } else {
        const message = JSON.stringify(await response.json()); 
        setData((prevState) => ({
        ...prevState,
        message: message
      }));
      }
    } catch (error) {
      console.error("Error during decryption:", error);
      const errorLog =
        "Patience young padawan..." + error;
      setData((prevState) => ({
        ...prevState,
        message: errorLog,
      }));
    }
  };

  return (
    <>
      <Card className="mt-6 w-96">
        <div className="flex items-center justify-between"></div>
        <CardBody>
          <div className="grid gap-6">
            <Textarea
              readOnly={true}
              label="Encrypted message"
              name="message"
              value={data.message}
              rows={10}
            />
          </div>
        </CardBody>
        <CardFooter className="flex w-full justify-between py-1.5">
          <ClipboardDefault content={data.message}/>
          <div className="flex gap-2">
            {/* <Button variant="text" color="gray" onClick={handleOpen}>
              Cancel
            </Button> */}
            <Button variant="gradient" color="gray" onClick={handleDecrypt}>
              Decrypt
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
