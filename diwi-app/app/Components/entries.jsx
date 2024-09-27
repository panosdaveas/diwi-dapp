import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  BriefcaseIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";

interface BillingCardPropsType {
  title: string;
  options: string[];
  action: string;
  icon: string;
  detail: string;
}

function BillingCard({ title, options, icon, detail }: BillingCardPropsType) {
  return (
    <Card shadow={false} className="rounded-lg border border-gray-300 p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="border border-gray-200 p-2.5 rounded-lg">{icon}</div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-1 font-bold"
            >
              {title}
            </Typography>
            <Typography className="!text-gray-600 text-xs font-normal">
              {detail}
            </Typography>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button size="sm" variant="text" className="flex items-center gap-2">
            <PencilIcon className="h-4 w-4 text-gray-600" />
            <Typography className="!font-semibold text-xs text-gray-600 md:block hidden">
              Edit
            </Typography>
          </Button>
          <Button
            size="sm"
            variant="text"
            color="red"
            className="flex items-center gap-2"
          >
            <TrashIcon className="h-4 w-4 text-red-500" />
            <Typography className="!font-semibold text-xs text-red-500 md:block hidden">
              delete
            </Typography>
          </Button>
        </div>
      </div>
      <div>
        {options && (
          <div>
            {Object.keys(options).map((label) => (
              <div key={label} className="flex gap-1">
                <Typography className="mb-1 text-xs !font-medium !text-gray-600">
                  {label}:
                </Typography>
                <Typography className="text-xs !font-bold" color="blue-gray">
                  {options[label]}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

const billingCardData = [
  {
    icon: <BriefcaseIcon className="h-6 w-6 text-gray-900" />,
    title: "Burrito Vikings",
    detail: "Company",
    options: {
      Contact: "Emma Roberts",
      "Email Address": "emma@mail.com",
      "VAT Number": "FRB1235476",
    },
  },
  {
    icon: <BriefcaseIcon className="h-6 w-6 text-gray-900" />,
    title: "Stone Tech Zone",
    detail: "Company",
    options: {
      Contact: "Marcel Glock",
      "Email Address": "marcel@mail.com",
      "VAT Number": "FRB1235476",
    },
  },
  {
    icon: <BriefcaseIcon className="h-6 w-6 text-gray-900" />,
    title: "Fiber Notion",
    detail: "Company",
    options: {
      Contact: "Misha Stam",
      "Email Address": "misha@mail.com",
      "VAT Number": "FRB1235476",
    },
  },
];

function Billing3() {
  return (
    <section className="max-w-4xl !mx-auto px-8 py-20 w-full">
      <Card shadow={false}>
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none flex gap-2 flex-col md:flex-row items-start !justify-between"
        >
          <div className="w-full mb-2">
            <Typography className="!font-bold" color="blue-gray">
              Billing Information
            </Typography>
            <Typography
              className="mt-1 !font-normal !text-gray-600"
              variant="small"
            >
              View and update your billing details quickly and easily.
            </Typography>
          </div>
          <div className="w-full">
            <Button
              size="sm"
              variant="outlined"
              color="gray"
              className="flex justify-center gap-3 md:max-w-fit w-full ml-auto"
            >
              <PlusIcon strokeWidth={3} className="h-4 w-4" />
              add new card
            </Button>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 !p-4">
          {billingCardData.map((props, key) => (
            <BillingCard key={key} {...props} />
          ))}
        </CardBody>
      </Card>
    </section>
  );
}

export default Billing3;
