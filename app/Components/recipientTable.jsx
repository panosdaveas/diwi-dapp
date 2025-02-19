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
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { useCopyToClipboard } from "usehooks-ts";
import { useContext, useEffect, useState } from "react";
import { useWallet } from "@/app/Context/WalletContext";
import { ClipboardDefault } from "./clipboard";
import { ethers } from "ethers";

export function RecipientTable() {
    const { walletInfo } = useWallet();
    const [isMobile, setIsMobile] = useState(false);
    const [targetSubmitPK, setTargetSubmitPK] = useState("");
    const [value, copy] = useCopyToClipboard();
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(0);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);

    const {
        loading,
        error,
        submitPublicKey,
        getWillsByRecipient
    } = useContractInteraction();

    const [tableData, setTableData] = useState([]);

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

    const handleSubmitPublicKey = async (uniqueId) => {
        const result = await submitPublicKey(uniqueId, targetSubmitPK);
        console.log(result);
        setTableData(prev =>
            prev.map(row =>
                row.uniqueId === uniqueId
                    ? {
                        ...row,
                        requestStatusSubmitPK: result.success
                            ? <a href={result.blockExplorerUrl} target="_blank" rel="noopener noreferrer">View in block explorer</a>
                            : "Request failed"
                    }
                    : row
            )
        );
    };

    const handlePollPublicKeyRequests = async () => {
        const requests = await getWillsByRecipient(walletInfo.address);
        if (requests && requests.length > 0) {
            const formattedRequests = requests.map(request => ({
                uniqueId: request.uniqueId || '-',
                signer: request.signer || '-',
                fulfilled: request.fulfilled ? 'Fulfilled' : 'Pending',
                publicKey: request.publicKey || '-',
                blockNumber: request.blockNumber ? request.blockNumber.toString() : '-',
                messageHash: request.messageHash || '-',
            }));
            setTableData(formattedRequests);
        }
    };

    const TABLE_HEAD = ["Id", "From", "Status", "Method", "Public Key", "Block Number", "msgHash", ""];

    return (
        <Card className={card}>
            <CardHeader className={cardHeader}>
                <div>
                    <Typography variant="h5" className="mt-1 mb-4">
                        Recipient Dashboard
                    </Typography>
                    <Typography>
                        Manage public key requests and messages
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
                        {tableData.map(({ uniqueId, signer, fulfilled, publicKey, blockNumber, messageHash }, index) => {
                            const isLast = index === tableData.length - 1;
                            const tdClass = isLast ? tdLast : td;
                            return (
                                <tr key={index} className={tr}>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(uniqueId);
                                            setCopied(true);
                                        }}
                                    >
                                        {truncate(uniqueId, 8)}
                                    </td>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(signer);
                                            setCopied(true);
                                        }}
                                    >
                                        {truncate(signer, 8)}
                                    </td>
                                    <td className={tdClass}>
                                        <Chip variant="ghost" size="sm" value={fulfilled} color={fulfilled === "Fulfilled" ? "green" : "blue-gray"}>
                                            {/* {fulfilled} */}
                                        </Chip>
                                    </td>
                                    <td className={tdClass}>
                                        <Button
                                            // as="a"
                                            // href="#"
                                            variant="gradient"
                                            size="sm"
                                            disabled={loading || !publicKey || fulfilled === "Fulfilled" || !targetSubmitPK}
                                            className={`flex items-center gap-2 ${loading || !publicKey || fulfilled === "Fulfilled" || !targetSubmitPK ? "cursor-not-allowed" : ""}`}
                                            onClick={() => handleSubmitPublicKey(uniqueId)}
                                        >
                                            {loading ? <Spinner className="h-4 w-4" /> : "Submit Public Key"}
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
                                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                                />
                                            </svg>
                                        </Button>
                                    </td>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(publicKey);
                                            setCopied(true);
                                        }}
                                    >
                                        {fulfilled === "Fulfilled" ? (
                                            truncate(publicKey, 8)
                                        ) : (
                                            <Input
                                                variant="standard"
                                                placeholder="Enter your public key"
                                                label="Public Key"
                                                value={targetSubmitPK}
                                                onChange={(e) => setTargetSubmitPK(e.target.value)}
                                                className="text-content border-none"
                                                labelProps={{
                                                    className: "before:content-none after:content-none text-content peer-placeholder-shown:text-content"
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(blockNumber);
                                            setCopied(true);
                                        }}
                                    >
                                        {truncate(blockNumber, 8)}</td>
                                    <td className={tdClass}
                                        onMouseLeave={() => setCopied(false)}
                                        onClick={() => {
                                            copy(messageHash);
                                            setCopied(true);
                                        }}
                                    >
                                        {truncate(messageHash, 8)}
                                    </td>
                                    <td>
                                        <Tooltip content="Open Will">
                                            <IconButton variant="text"
                                            // onClick={() => handleOpen(1)}
                                            >
                                                <LockClosedIcon className="h-4 w-4" />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                    {/* <td className={tdClass}>
                                        <ClipboardDefault content={messageHash} />
                                    </td> */}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex w-full justify-between">
                <Badge content={tableData.length} className={tableData.length === 0 ? "invisible" : ""}>
                    <Button variant="gradient" onClick={handlePollPublicKeyRequests}>
                        Requests
                    </Button>
                </Badge>
            </CardFooter>
        </Card>
    );
}