import {
    ChevronDownIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
    Cog6ToothIcon,
    DocumentIcon,
    InboxIcon,
    PowerIcon,
    UserCircleIcon
} from "@heroicons/react/24/solid";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Chip,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { ConnectWalletButton } from "./walletButton";

export function SidebarContent() {
    const [openAccordion, setOpenAccordion] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAccordionOpen = (value) => {
        setOpenAccordion(openAccordion === value ? 0 : value);
    };

    return (
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
};