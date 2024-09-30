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
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { StepperWithContent } from "./horizontalTimeline";
import { Skeleton } from "./skeleton";
import { ConnectWalletButton } from "./walletButton";
import { CardLeftSteps } from "./cardLeft";
import { CardRightSteps } from "./cardRight";
import { useWallet } from '@/app/Context/WalletContext';


const DashboardLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);
  const { data, setData } = useContext(CustomContext);
  const { walletInfo } = useWallet();


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleAccordionOpen = (value) => {
    setOpenAccordion(openAccordion === value ? 0 : value);
  };

  const SidebarContent = () => (
    <Card className="h-full w-full max-w-[20rem] bg-white p-4 shadow-xl shadow-blue-gray-900/5 dark:bg-gray-900">
      <div className="mb-0 p-4">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/DiWi-2.svg"
          alt="Diwi Logo"
          width={100}
          height={35}
          priority
        />
      </div>
      <List>
        <Accordion
          open={openAccordion === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${openAccordion === 1 ? "rotate-180" : ""
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
        <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>
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
        <ListItem>
          <ConnectWalletButton />
        </ListItem>
      </List>
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
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {isMobile && (
          <Navbar className="mx-auto max-w-screen-xl px-4 py-3 bg-white">
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Additional cards */}
              <div className="col-span-1 md:col-span-2 sm:col-span-3 lg:col-span-3 p-6 overflow-hidden">
                <StepperWithContent />
                {/* Add performance overview content here */}
              </div>
              {/* Main content area */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 align-middle justify-center">
                <div className="grid gap-6 justify-center text-center align-middle lg:max-full lg:w-full lg:mb-0 lg:grid-cols-2 md:grid-cols-1 lg:text-left">
                  <CardLeftSteps />
                  <CardRightSteps />
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
                  <Skeleton />
                </Card>
                <Card className="p-6">
                  <Skeleton />
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
