import {
    card,
    cardBody,
    cardHeader,
    table,
    td,
    tdHead,
    tdLast,
    tr
} from "@/app/scripts/classesCustomization";
import { useContractInteraction } from "@/app/scripts/interact";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
    Spinner,
    Typography,
    Badge,
    Alert,
    Chip,
    Tooltip,
    IconButton,
    Collapse,
    Textarea,
} from "@material-tailwind/react";
import { EnvelopeIcon, EnvelopeOpenIcon } from "@heroicons/react/24/solid";
import { useCopyToClipboard } from "usehooks-ts";
import { DateTimePicker } from "./dateTimePicker";
import { TextareaCustom } from "./textarea";
import { useContext, useEffect, useState } from "react";
import { useWallet } from "@/app/Context/WalletContext";
import { ClipboardDefault } from "./clipboard";
import { handleScripts } from "../scripts/handles";
import { CustomContext } from "@/app/Context/context";
import { NewWillPopOver } from "./NewWillPopOver";

export function SignersTable() {
    const { walletInfo } = useWallet();
    const [isMobile, setIsMobile] = useState(false);
    const [targetSubmitPK, setTargetSubmitPK] = useState("");
    const [willMessage, setWillMessage] = useState("");
    const [dateTime, setDateTime] = useState(new Date());
    const [value, copy] = useCopyToClipboard();
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const toggleOpen = () => setOpen((cur) => !cur);

    const {
        loading,
        error,
        submitPublicKey,
        getWillsBySigner,
        getMessageByUniqueId,
    } = useContractInteraction();

    const {
        handleEncrypt,
        handleInputChange,
        handleDateTimeChange,
        handleEncryptWill,
        handleNewWill,
    } = handleScripts();

    const [tableData, setTableData] = useState([]);
    const { data, setData } = useContext(CustomContext);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const truncate = (str, length = 10) => {
        if (str.length <= length) return str;
        const partLength = Math.floor(length / 2);
        return `${str.slice(0, partLength)}...${str.slice(-partLength)}`;
    };

    const handleSubmitWill = () => async () => {
        await handleEncryptWill(selectedRow.uniqueId, selectedRow.publicKey, willMessage);
    };

    const handlePollPublicKeyRequests = async () => {
        const requests = await getWillsBySigner(walletInfo.address);
        if (requests && requests.length > 0) {
            const formattedRequests = requests.map(request => ({
                uniqueId: request.uniqueId || '-',
                recipient: request.recipient || '-',
                fulfilled: request.fulfilled ? 'Fulfilled' : 'Pending',
                publicKey: request.publicKey || '-',
                blockNumber: request.blockNumber ? request.blockNumber.toString() : '-',
                messageHash: request.messageHash || '-',
                txHash: request.txHash || '-',
            }));
            setTableData(formattedRequests);
        }
    };

    const handleIconButtonClick = async (row) => {
        setSelectedRow(row);
        toggleOpen();
    };

    const TABLE_HEAD = ["Id", "To", "Status", "Public Key", "Block Number", "msgHash", ""];

    return (

        <Card className="w-full shadow-none border border-borderColor bg-bkg text-content">
            {/* <Card className={card}> */}
            <CardHeader className={cardHeader}>
                <div>
                    <Typography variant="h5" className="mt-1 mb-4">
                        Signer Dashboard
                    </Typography>
                    <Typography>
                        Make requests and send messages
                    </Typography>
                </div>
            </CardHeader>
            <CardBody className={cardBody}>
                <table className={table}>
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className={tdHead}>
                                    <Typography variant="small" className="font-bold leading-none opacity-100">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => {
                            const isLast = index === tableData.length - 1;
                            const tdClass = isLast ? tdLast : td;
                            return (
                                <tr key={index} className={tr}>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(row.uniqueId);
                                            setCopied(true);
                                        }}
                                    >
                                        <Typography
                                            variant="small">
                                            {truncate(row.uniqueId, 8)}
                                        </Typography>
                                    </td>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(row.recipient);
                                            setCopied(true);
                                        }}
                                    >
                                        <Typography
                                            variant="small">
                                            {truncate(row.recipient, 8)}
                                        </Typography>
                                    </td>
                                    <td className={tdClass}>
                                        <Chip variant="ghost" size="sm" value={row.fulfilled} color={row.fulfilled === "Fulfilled" ? "green" : "blue-gray"}>
                                        </Chip>
                                    </td>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(row.publicKey, 8);
                                            setCopied(true);
                                        }}
                                    >
                                        <Typography
                                            variant="small">
                                            {truncate(row.publicKey, 8)}
                                        </Typography>
                                    </td>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(row.blockNumber, 8);
                                            setCopied(true);
                                        }}
                                    >
                                        <Typography
                                            variant="small">
                                            {truncate(row.blockNumber, 8)}
                                        </Typography>
                                    </td>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(row.messageHash, 8);
                                            setCopied(true);
                                        }}
                                    >
                                        <Typography
                                            variant="small">
                                            {truncate(row.messageHash, 8)}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Tooltip content="Send Will">
                                            <IconButton variant="text"
                                                onClick={() => handleIconButtonClick(row)}
                                            >
                                                {selectedRow === row && open ? <EnvelopeOpenIcon className="h-4 w-4" /> : <EnvelopeIcon className="h-4 w-4" />}
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Collapse open={open}>
                    {selectedRow && (
                        <Card className="w-full shadow-none border border-borderColor bg-bkg text-content">
                            <CardBody>
                                <div className="grid gap-6">
                                    <DateTimePicker
                                        selectedDate={new Date()}
                                        onChange={handleDateTimeChange}
                                        // onChange={(e) => setDateTime(e.target.value)}
                                    />
                                    <TextareaCustom
                                        label="Will Message"
                                        name="displayMessage"
                                        value={willMessage}
                                        onChange={(e) => setWillMessage(e.target.value)}
                                        rows={7}
                                    />
                                </div>
                            </CardBody>
                            <CardFooter className="flex w-full justify-between">
                                <ClipboardDefault content={data.displayMessage} />
                                <div className="flex gap-2">
                                    <Button variant="gradient" color="gray" onClick={handleSubmitWill()}>
                                        Encrypt
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    )}
                </Collapse>
            </CardBody>
            <CardFooter className="flex w-full justify-between">
                <div className="flex gap-8">
                <Badge content={tableData.length} className={tableData.length === 0 ? "invisible" : ""}>
                    <Button variant="gradient" onClick={handlePollPublicKeyRequests}>
                        Requests
                    </Button>
                </Badge>
                    <NewWillPopOver />
                    {/* <Button variant="gradient" onClick={handleNewWill}>
                        New Will
                    </Button> */}
                </div>
            </CardFooter>
        </Card>
    );
}