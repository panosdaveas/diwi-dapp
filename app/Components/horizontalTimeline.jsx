import React, { useContext, useEffect } from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import {
  ClockIcon,
  KeyIcon,
  LockOpenIcon
} from "@heroicons/react/24/outline";
import { CustomContext } from "@/app/Context/context";

export function StepperWithContent() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const { data, setData } = useContext(CustomContext);
  // initial data.active step to 0
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      activeStep: 0,
    }))
  }, []);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <div className="w-full lg:px-24 md:px-0">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step onClick={() => {
          setActiveStep(0), setData((prevData) => ({
            ...prevData,
            activeStep: 0,
            displayMessageEncrypted: "",
          }))} }>
          <KeyIcon className="h-5 w-5" />
          {/* <div className="absolute -bottom-[4.5rem] w-max text-center">
            <Typography
              variant="h6"
              color={activeStep === 0 ? "blue-gray" : "gray"}
            >
              Step 1
            </Typography>
            <Typography
              // variant="small"
              color={activeStep === 0 ? "blue-gray" : "gray"}
              className="font-normal"
            >
               }
                Encrypt with public key
            </Typography>
          </div> */}
        </Step>
        <Step onClick={() => {
          setActiveStep(1), setData((prevData) => ({
            ...prevData,
            activeStep: 1,
            displayMessageEncrypted: "",
          }))
        }}>
          <ClockIcon className="h-5 w-5" />
          {/* <div className="absolute -bottom-[4.5rem] w-max text-center">
            <Typography
              variant="h6"
              color={activeStep === 1 ? "blue-gray" : "gray"}
            >
              Step 2
            </Typography>
            <Typography
              color={activeStep === 1 ? "blue-gray" : "gray"}
              className="font-normal"
            >
              Time-lock encryption
            </Typography>
          </div> */}
        </Step>
        <Step onClick={() => {
          setActiveStep(2), setData((prevData) => ({
            ...prevData,
            activeStep: 2,
            displayMessageEncrypted: "",
          }))
        }}>
          <LockOpenIcon className="h-5 w-5" />
          {/* <div className="absolute -bottom-[4.5rem] w-max text-center">
            <Typography
              variant="h6"
              color={activeStep === 2 ? "blue-gray" : "gray"}
            >
              Step 3
            </Typography>
            <Typography
              color={activeStep === 2 ? "blue-gray" : "gray"}
              className="font-normal"
            >
              Decrypt if it's time!
            </Typography>
          </div> */}
        </Step>
      </Stepper>
      {/* <div className="mt-32 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={isLastStep}>
          Next
        </Button>
      </div> */}
    </div>
  );
}
