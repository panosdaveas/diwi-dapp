import React, { useState, useEffect, useContext, useCallback } from "react";
import { CustomContext } from "@/app/Context/context";
import Image from "next/image";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  IconButton,
  Drawer,
  Navbar,
  Switch,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { MessageCardLeft } from "@/app/Components/cardLeft";
import { MessageCardRight } from "@/app/Components/cardRight";
import { StepperWithContent } from "./horizontalTimeline";
import { Skeleton } from "./skeleton";
import { ConnectWalletButton } from "./walletButton";
import { CustomConnectWalletButton } from "./customConnectWalletButton";
import { encryptWithPublicKey } from "../utils/encryptionWithPublicKey";

const DashboardLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);
  const { data, setData } = useContext(CustomContext);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function pemToUint8Array(pem) {
    // Remove the header and footer
    const pemContents = pem.replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s/g, '');

    // Decode the base64 using Buffer
    const buffer = Buffer.from(pemContents, 'base64');

    // Convert Buffer to Uint8Array
    return new Uint8Array(buffer);
  }

  // Usage
  const pemPublicKey = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEYAk8b78p6nJFnWEiMukPem6a84Cfrnsx
Yu7Gd5XijPj74eAXEjmw0NW4KWy8zOTO3JonEUesj/y8kBU/nL0LCQ==
-----END PUBLIC KEY-----`;

  const uint8ArrayPublicKey = pemToUint8Array(pemPublicKey);
  console.log(uint8ArrayPublicKey);

  // If you want to see the array contents more clearly:
  console.log(Array.from(uint8ArrayPublicKey));

  const handleEncrypt = async () => {
    const newMessage = "hello";
    const encrypted = await encryptWithPublicKey(pemToUint8Array(pemPublicKey), newMessage);
    console.log("encrypted" + encrypted.toString());
  };

  const handleConnectData = useCallback((data) => {
    setData((prevData) => ({
      ...prevData,
      accountAddress: data,
    }));
    console.log(data);
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleAccordionOpen = (value) => {
    setOpenAccordion(openAccordion === value ? 0 : value);
  };

  const SidebarContent = () => (
    <Card className="h-full w-full max-w-[20rem] bg-gray-100 p-4 shadow-xl shadow-blue-gray-900/5 dark:bg-gray-900">
      <div className="mb-2 p-4">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/DiWi-2.svg"
          alt="Diwi Logo"
          width={100}
          height={35}
          priority
        />
        {/* <Typography variant="h5" color={isDarkMode ? "white" : "blue-gray"}>
          Digital Will
        </Typography> */}
      </div>
      <List>
        <Accordion
          open={openAccordion === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                openAccordion === 1 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={openAccordion === 1}>
            <AccordionHeader
              onClick={() => handleAccordionOpen(1)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Dashboard
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Analytics
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Reporting
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Projects
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <hr className="my-2 border-blue-gray-100 dark:border-gray-800" />
        <ListItem>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
        {/* <ListItem> */}
        <div className="p-3">
        <CustomConnectWalletButton onConnectData={handleConnectData}/>
        </div>
        {/* </ListItem> */}
        {/* <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          <CustomConnectWalletButton />
        </ListItem> */}
        <ListItem>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
      <button onClick={handleEncrypt}>Encrypt</button>
      {/* <ConnectWalletButton /> */}
    </Card>
  );

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      {!isMobile && (
        <aside className="w-64 bg-white dark:bg-gray-900">
          <SidebarContent />
          <a
            href="https://github.com/panosdaveas/DiWi-DApp.git"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <Typography color="gray" className="absolute bottom-4 left-4 text-xs">
              v0.1.9
            </Typography>
          </a>

          {/* <Typography color="gray" 
            className="absolute bottom-4 left-4 text-xs cursor-pointer"
            rel="github"
            href="https://github.com/panosdaveas/DiWi-DApp.git"
            target="_blank">
            ds v0.1.9
          </Typography> */}
        </aside>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isMobile && (
          <Navbar className="mx-auto max-w-screen-xl px-4 py-3">
            <div className="flex items-center justify-between text-blue-gray-900">
              <Typography
                as="a"
                href="#"
                variant="h6"
                className="mr-4 cursor-pointer py-1.5"
              >
                Digital Will
              </Typography>
              <IconButton
                variant="text"
                color="blue-gray"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </IconButton>
            </div>
          </Navbar>
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Additional cards */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 p-6 overflow-hidden">
                  <StepperWithContent />
                {/* Add performance overview content here */}
              </div>
              {/* Main content area */}
              {/* <Card className="col-span-1 md:col-span-2 lg:col-span-3 p-6 align-middle justify-center">  */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 align-middle justify-center"> 
                <div className="grid gap-6 justify-center text-center align-middle lg:max-full lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
                  <MessageCardLeft />
                  <MessageCardRight />
                </div>
                {children}
              </div>
              <Card className="col-span-1 md:col-span-2 lg:col-span-3 p-6 overflow-hidden">
                  <Skeleton />
                {/* Add performance overview content here */}
              </Card>

              {/* Sidebar cards */}
              <div className="col-span-1 space-y-6">
                <Card className="p-6">
                    <Skeleton/>
                </Card>
                <Card className="p-6">
                    <Skeleton/>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
      {isMobile && (
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <div className="mb-2 flex items-center justify-between p-4">
            {/* <Typography variant="h5" color="blue-gray">
              Material Tailwind
            </Typography> */}
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => setIsDrawerOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <SidebarContent />
        </Drawer>
      )}
      {/* <Button
        size="sm"
        color={isDarkMode ? "gray" : "gray"}
        className="!fixed bottom-4 right-4 rounded-full"
        onClick={toggleDarkMode}
      >
        {isDarkMode ? "Light" : "Dark"}
      </Button> */}
      <div className="!fixed bottom-4 right-4 rounded-full">
        <Switch onChange={toggleDarkMode} />
      </div>
    </div>
  );
};

export default DashboardLayout;
