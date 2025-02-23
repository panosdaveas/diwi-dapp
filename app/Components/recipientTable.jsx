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
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { useCopyToClipboard } from "usehooks-ts";
import { useContext, useEffect, useState } from "react";
import { useWallet } from "@/app/Context/WalletContext";
import { ClipboardDefault } from "./clipboard";
import { handleScripts } from "../scripts/handles";
import { CustomContext } from "@/app/Context/context";

export function RecipientTable() {
    const { walletInfo } = useWallet();
    const [isMobile, setIsMobile] = useState(false);
    const [targetSubmitPK, setTargetSubmitPK] = useState("");
    const [value, copy] = useCopyToClipboard();
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [tableData, setTableData] = useState([]);
    const { data, setData } = useContext(CustomContext);
    const toggleOpen = () => setOpen((cur) => !cur);

    const {
        loading,
        error,
        submitPublicKey,
        getWillsByRecipient,
        getMessageByTxHash,
        getMessageByUniqueId,
    } = useContractInteraction();

    const {
        handleAsymmetricDecryption,
        handleTimeLockDecryption,
        handleInputChange,
        handleDecrypt,
    } = handleScripts();

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

    const handleGetWillMessage = async(row) => {
        const result = await getMessageByUniqueId(row.uniqueId);
        const message = result.success ? result.message : "Failed to retrieve message";
        setData({ ...data, displayMessage: message });
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
                txHash: request.txHash || '-',
            }));
            setTableData(formattedRequests);
        }
    };

    const handleIconButtonClick = async (row) => {
        setSelectedRow(row);
        toggleOpen();
        await handleGetWillMessage(row);
    };

    const TABLE_HEAD = ["Id", "From", "Status", "Method", "Public Key", "Block Number", "msgHash", ""];

    return (

      <Card className="w-full shadow-none border border-borderColor bg-bkg text-content">
        {/* <Card className={card}> */}
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
                                            copy(row.signer);
                                            setCopied(true);
                                        }}
                                    >
                                        <Typography
                                            variant="small">
                                            {truncate(row.signer, 8)}
                                        </Typography>
                                    </td>
                                    <td className={tdClass}>
                                        <Chip variant="ghost" size="sm" value={row.fulfilled} color={row.fulfilled === "Fulfilled" ? "green" : "blue-gray"}>
                                            {/* {row.fulfilled} */}
                                        </Chip>
                                    </td>
                                    <td className={tdClass}>
                                        <Button
                                            variant="gradient"
                                            size="sm"
                                            disabled={loading || !row.publicKey || row.fulfilled === "Fulfilled" || !targetSubmitPK}
                                            className={`flex items-center gap-2 ${loading || !row.publicKey || row.fulfilled === "Fulfilled" || !targetSubmitPK ? "cursor-not-allowed" : ""}`}
                                            onClick={() => handleSubmitPublicKey(row.uniqueId)}
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
                                            copy(row.publicKey);
                                            setCopied(true);
                                        }}
                                    >
                                        {row.fulfilled === "Fulfilled" ? (
                                            <Typography
                                                variant="small">
                                                {truncate(row.publicKey, 8)}
                                            </Typography>
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
                                            copy(row.blockNumber);
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
                                            copy(row.messageHash);
                                            setCopied(true);
                                        }}
                                    >
                                        <Typography
                                            variant="small">
                                            {truncate(row.messageHash, 8)}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Tooltip content="Open Will">
                                            <IconButton variant="text"
                                                onClick={() => handleIconButtonClick(row)}
                                            >
                                                {selectedRow === row && open ? <LockOpenIcon className="h-4 w-4" /> : <LockClosedIcon className="h-4 w-4" />}
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
                                    <Input
                                        label="Private Key"
                                        name="privateKey"
                                        value={data.privateKey}
                                        onChange={handleInputChange}
                                        className="text-content overflow-hidden overflow-ellipsis"
                                        labelProps={{ className: "peer-placeholder-shown:text-content" }}
                                    />
                                    <Textarea
                                        readOnly={true}
                                        label="Encrypted message"
                                        name="displayMessage"
                                        // value={handleGetWillMessage()}
                                        value={data.displayMessage}
                                        rows={7}
                                        className="text-content"
                                    />
                                </div>
                            </CardBody>
                            <CardFooter className="flex w-full justify-between">
                                <ClipboardDefault content={data.displayMessage} />
                                <div className="flex gap-2">
                                    {/* <Button variant="text" color="gray" onClick={handleRequests} className="text-content">
                                        Requests
                                    </Button> */}
                                    {/* <Button variant="gradient" color="gray" onClick={data.tlEncrypted === "true" ? handleTimeLockDecryption : handleAsymmetricDecryption}> */}
                                    <Button variant="gradient" color="gray" onClick={handleDecrypt}>
                                        Decrypt
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    )}
                </Collapse>
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