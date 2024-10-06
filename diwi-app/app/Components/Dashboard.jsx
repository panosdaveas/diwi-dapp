import React, { useState, useEffect, useContext } from "react";
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
    Navbar,
    Drawer,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
    UserCircleIcon,
    // SunIcon,
    MoonIcon,
    DocumentIcon
} from "@heroicons/react/24/solid";
import { SunIcon } from "@heroicons/react/24/outline";
import {
    ChevronRightIcon,
    ChevronDownIcon,
    Bars3Icon,
} from "@heroicons/react/24/outline";

import { CustomContext } from "@/app/Context/context";
import { StepperWithContent } from "./horizontalTimeline";
import { Skeleton } from "./skeleton";
import { ConnectWalletButton } from "./walletButton";
import { CardLeftSteps } from "./cardLeft";
import { CardRightSteps } from "./cardRight";
import ContractDataTable from "./contractDataTable";

const DashboardLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('darkMode') === 'true'
        }
        return false;
    });
    const [openAccordion, setOpenAccordion] = useState(0);
    const { data, setData } = useContext(CustomContext);

    useEffect(() => {
        if (isDarkMode) {
            // document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
        } else {
            // document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAccordionOpen = (value) => {
        setOpenAccordion(openAccordion === value ? 0 : value);
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        // document.documentElement.classList.toggle("dark");
        document.body.classList.toggle("dark");
    };

    const SidebarContent = () => (
        <div className="h-full bg-background-light dark:bg-background-dark transition-colors duration-200">
            <List className="p-4 text-text-light dark:text-text-dark" >
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
                    <ListItem className="p-0 " selected={openAccordion === 1}>
                        <AccordionHeader
                            onClick={() => handleAccordionOpen(1)}
                            className="border-b-0 p-3 text-text-light dark:text-text-dark"
                        >
                            <ListItemPrefix>
                                <DocumentIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            <Typography className="mr-auto font-normal ">
                                Documentation
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1 ">
                        <List className="p-0 text-text-light dark:text-text-dark">
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
                <hr className="my-2 border-border-light dark:border-border-dark" />
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
                    {isMobile && (
                        <ConnectWalletButton />
                    )}
                </ListItem>
            </List>
            <div className="absolute bottom-4 left-4 text-text-light dark:text-text-dark">
                <a
                    href="https://github.com/panosdaveas/DiWi-DApp.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                >
                    <Typography className="absolute bottom-4 left-4 text-xs border border-gray rounded-md px-2 py-1">
                        v0.1.9
                    </Typography>
                </a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-200">
            <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-6 py-2 lg:px-6 lg:py-4 bg-background-light dark:bg-background-dark border-t-0 border-r-0 border-l-0 border-b-1 border-border-light dark:border-border-dark shadow-none transition-colors duration-200">
                <div className="flex items-center justify-between text-text-light dark:text-text-dark">
                    <div className="flex items-center gap-4">
                        {isMobile && (
                            <IconButton
                                variant="text"
                                className="text-text-light dark:text-text-dark"
                                // color="blue-gray"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                <Bars3Icon className="h-6 w-6" />
                            </IconButton>
                        )}
                        <Image
                            // className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert transition-all duration-200"
                            className="relative dark:invert transition-all duration-200"
                            src="/DiWi-2.png"
                            alt="Diwi Logo"
                            width={80}
                            height={14}
                            priority
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <a href="https://github.com/panosdaveas/DiWi-DApp.git" 
                            aria-label="Diwi on GitHub" 
                            rel="noopener noreferrer" 
                            target="_blank"
                            > 
                            <svg 
                            className="bg-background-light dark:bg-background-dark dark:fill-primary-light"
                            // fill="currentColor" 
                            // stroke="currentColor" 
                            // style={"vertical-align: middle"}
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z">
                                    </path>
                                    </svg>
                                    </a>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 focus:outline-none "
                            >
                                {isDarkMode ? (
                                    <SunIcon className="w-6 h-6 dark:text-text-dark" />
                                ) : (
                                    <MoonIcon className="w-6 h-6 text-text-light dark:text-text-dark" />
                                )}
                            </button>
                            <div className="ml-4">
                            <ConnectWalletButton />
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar>

            {/* Main Content Area */}
            <div className="flex h-[calc(100vh-64px)]">
                {/* Sidebar - Hidden on mobile */}
                {!isMobile && (
                    <aside className="w-64 flex-shrink-0 border-r border-border-light dark:border-border-dark transition-colors duration-200">
                        <SidebarContent />
                    </aside>
                )}

                {/* Main Content */}
                {/* <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200"> */}
                <main className="flex-1 overflow-auto bg-background-light dark:bg-background-dark transition-colors duration-200">
                    <div className="container mx-auto">
                        {children}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="col-span-full" >
                                {/* <div className="h-full w-full overflow-scroll"> */}
                                    <ContractDataTable />
                                {/* </div> */}
                            </div>
                            <div className="col-span-full px-6">
                                <StepperWithContent />
                            </div>
                            <div className="col-span-full grid md:grid-cols-2 gap-6">

                                {/* <div className="w-full border-r border-b border-t border-blue-gray-100 dark:border-gray-700"> */}
                                <CardLeftSteps />
                                {/* </div> */}
                                {/* <div className="w-full border-l border-b border-t border-blue-gray-100 dark:border-gray-700"> */}
                                <CardRightSteps />
                                {/* </div> */}
                            </div>
                            <Card className="col-span-1 md:col-span-2 lg:col-span-3 p-6 overflow-hidden border-b border-t border-border-light dark:border-border-dark shadow-none">
                                <Skeleton />
                                {/* Add performance overview content here */}
                            </Card>
                            <div className="col-span-1 space-y-6">
                                <div className="p-6 border-b border-r border-t border-border-light dark:border-border-dark">
                                    <Skeleton />
                                </div>
                                <Card className="p-6">
                                    <Skeleton />
                                </Card>
                            </div>
                            {/* Your grid content */}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
                className="bg-background-light dark:bg-background-dark">
                    <div className="mb-2 flex items-center justify-between p-4 ">
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
                                // stroke="currentColor"
                                stroke={!isDarkMode ? "currentColor" : "white"}
                                className="h-5 w-5 "
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
        </div>
    );
};

export default DashboardLayout;