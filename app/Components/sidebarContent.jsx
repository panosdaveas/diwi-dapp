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
import { useContractInteraction } from "@/app/scripts/interact";
import { useWallet } from "@/app/Context/WalletContext";

export function SidebarContent() {
    const [openAccordion, setOpenAccordion] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const { walletInfo } = useWallet();

    const {
        logRecipientsAndPublicKeys,
    } = useContractInteraction();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAccordionOpen = (value) => {
        setOpenAccordion(openAccordion === value ? 0 : value);
    };

    const handleLogContractData = async () => {
        const dataUrl = await logRecipientsAndPublicKeys(walletInfo.address);
    };

    return (
        <div className="h-full bg-bkg transition-colors duration-200">
            <List className="p-4 text-content" >
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
                            className="border-b-0 border-borderColor p-3 text-content"
                        >
                            <ListItemPrefix>
                                <DocumentIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            <Typography className="mr-auto font-normal ">
                                Documentation
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1 text-content">
                        <List className="p-0 text-content">
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
                <hr className="my-2 border-borderColor" />
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
                <ListItem onClick={handleLogContractData}>
                    <ListItemPrefix>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Contract Data
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
            <div className="absolute bottom-4 left-4 text-content">
                <a
                    href="https://github.com/panosdaveas/DiWi-DApp.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                >
                    <Typography className="absolute bottom-4 left-4 text-xs border border-borderColor rounded-md px-2 py-1">
                        v0.1.9
                    </Typography>
                </a>
            </div>
        </div>
    );
};