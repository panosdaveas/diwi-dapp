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
    Tooltip,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { ConnectWalletButton } from "./walletButton";
import { useContractInteraction } from "@/app/scripts/interact";
import { useWallet } from "@/app/Context/WalletContext";
import { SignersTable } from "./SignersTable";
import { RecipientTable } from "./RecipientTable";
import { MarkdownComponent } from "./MarkdownComponent";

const SidebarContent = ({ setActiveComponent }) => {
    const [openAccordion, setOpenAccordion] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const { walletInfo } = useWallet();

    const {
        getAllWills,
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
        const dataUrl = await getAllWills();
    };

    const handleOpenSignerDashboard = () => {
        setActiveComponent(<SignersTable />); // Update Dashboard state
    };

    const handleOpenRecipientDashboard = () => {
        setActiveComponent(<RecipientTable />); // Update Dashboard state
    }

    const handleOpenDocumentation = () => {
        setActiveComponent(<MarkdownComponent />); // Update Dashboard state
    }

    return (
        <div className="h-full bg-bkg transition-colors duration-200">
            <List className="p-4 text-content text-sm" >
                <Accordion
                className="text-sm"
                    open={openAccordion === 1}
                    icon={
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${openAccordion === 1 ? "rotate-180" : ""
                                }`}
                        />
                    }
                >
                    <ListItem className="p-0 text-sm" selected={openAccordion === 1}>
                        <AccordionHeader
                            onClick={() => handleAccordionOpen(1)}
                            className="border-b-0 border-borderColor p-3 text-content text-sm mr-auto font-normal"
                        >
                            <ListItemPrefix>
                                <DocumentIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            {/* <Typography className="mr-auto font-normal text-sm"> */}
                                Documentation
                            {/* </Typography> */}
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1 text-content">
                        <List className="p-0 text-content">
                <ListItem onClick={handleOpenDocumentation} className="text-sm">
                    <ListItemPrefix>
                    <div className="max-w-full animate-pulse">
                        <div className="block w-3 h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-content rounded-full text-inherit">
                            &nbsp;
                        </div>
                        </div>
                    </ListItemPrefix>
                    Notes
                </ListItem>
                <ListItem>
                    <ListItemPrefix>
                    <div className="max-w-full animate-pulse">
                        <div className="block w-3 h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-content rounded-full text-inherit">
                            &nbsp;
                        </div>
                        </div>
                    </ListItemPrefix>
                    <div className="max-w-full animate-pulse">
                        <div className="block w-28 h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-content rounded-full text-inherit">
                            &nbsp;
                        </div>
                        </div>
                            </ListItem>
                            {/* <ListItem>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                Analytics
                            </ListItem> */}
                            {/* <ListItem>
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
                            </ListItem> */}
                        </List>
                    </AccordionBody>
                </Accordion>
                <hr className="my-2 border-borderColor" />
                {/* <ListItem>
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
                </ListItem> */}
                <ListItem onClick={handleOpenSignerDashboard}>
                    <ListItemPrefix>
                        {/* <UserCircleIcon className="h-5 w-5" /> */}
                    <div className="max-w-full animate-pulse">
                        <div className="block w-3 h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-content rounded-full text-content">
                            &nbsp;
                        </div>
                        </div>
                    </ListItemPrefix>
                    Signer Dashboard
                </ListItem>
                <ListItem onClick={handleOpenRecipientDashboard}>
                    <ListItemPrefix >
                        {/* <UserCircleIcon className="h-5 w-5" /> */}
                    <div className="max-w-full animate-pulse">
                        <div className="block w-3 h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-content rounded-full text-content">
                            &nbsp;
                        </div>
                        </div>
                    </ListItemPrefix>
                    Recipient Dashboard
                </ListItem>
                <ListItem>
                    <ListItemPrefix>
                        {/* <UserCircleIcon className="h-5 w-5" /> */}
                    <div className="max-w-full animate-pulse">
                        <div className="block w-3 h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-content rounded-full text-content">
                            &nbsp;
                        </div>
                        </div>
                    </ListItemPrefix>
                    <div className="max-w-full animate-pulse">
                        <div className="block w-28 h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-content rounded-full text-inherit">
                            &nbsp;
                        </div>
                        </div>
                    {/* Profile */}
                </ListItem>
                <ListItem>
                    <ListItemPrefix>
                        {/* <UserCircleIcon className="h-5 w-5" /> */}
                    <div className="max-w-full animate-pulse">
                        <div className="block w-3 h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-content rounded-full text-inherit">
                            &nbsp;
                        </div>
                        </div>
                    </ListItemPrefix>
                    <div className="max-w-full animate-pulse">
                        <div className="block w-28 h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-content rounded-full text-inherit">
                            &nbsp;
                        </div>
                        </div>
                    {/* Profile */}
                </ListItem>
                <ListItem onClick={handleLogContractData}>
                    <ListItemPrefix>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Contract Data
                </ListItem>
                {/* <ListItem>
                    <ListItemPrefix>
                        <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Log Out
                </ListItem> */}
                <ListItem>
                    {isMobile && (
                        <ConnectWalletButton />
                    )}
                </ListItem>
            </List>
            <div className="absolute bottom-4 left-4 text-content">
                <a href="#buttons-with-link">
                    <Tooltip size="sm" content="buy us a coffee" placement="top-start" >
                    <IconButton variant="outlined">
                        <i className="fas fa-heart" />
                    </IconButton>
                    </Tooltip>
                </a>
                {/* <a
                    href="https://github.com/panosdaveas/DiWi-DApp.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                >
                    <Typography className="absolute bottom-4 left-4 text-xs border border-borderColor rounded-md px-2 py-1">
                        v0.1.9
                    </Typography>
                </a> */}
            </div>
        </div>
    );
};

export { SidebarContent };