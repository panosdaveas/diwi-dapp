import {
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
    Chip,
    Tooltip,
    IconButton,
    Collapse,
    Textarea,
} from "@material-tailwind/react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { useCopyToClipboard } from "usehooks-ts";
import { useContext, useEffect, useState, useCallback } from "react";
import { useWallet } from "@/app/Context/WalletContext";
import { ClipboardDefault } from "./clipboard";
import { handleScripts } from "../scripts/encryptDecrypt";
import { CustomContext } from "@/app/Context/context";

export function RecipientTable() {
    const { walletInfo } = useWallet();
    const [isMobile, setIsMobile] = useState(false);
    const [value, copy] = useCopyToClipboard();
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [decryptError, setDecryptError] = useState('');
    const [isDecrypting, setIsDecrypting] = useState(false);
    const { data, setData } = useContext(CustomContext);

    const {
        loading,
        submitPublicKey,
        getWillsByRecipient,
        getMessageByUniqueId,
    } = useContractInteraction();

    const { handleDecrypt } = handleScripts();

    // Toggle collapse panel
    const toggleOpen = useCallback(() => setOpen(prev => !prev), []);

    // Handle window resize for responsive layout
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Load data on wallet address change
    useEffect(() => {
        if (walletInfo?.address || walletInfo.address) {
            handlePollPublicKeyRequests();
        }
    }, [walletInfo?.address, walletInfo.address]);

    // Handle public key input change
    const handlePublicKeyChange = useCallback((uniqueId, value) => {
        setTableData(prevData =>
            prevData.map(row =>
                row.uniqueId === uniqueId ? { ...row, publicKey: value } : row
            )
        );
    }, []);

    // Truncate long strings for display
    const truncate = useCallback((str, length = 10) => {
        if (!str) return '-';
        if (str.length <= length) return str;
        const partLength = Math.floor(length / 2);
        return `${str.slice(0, partLength)}...${str.slice(-partLength)}`;
    }, []);

    // Handle copying to clipboard
    const handleCopy = useCallback((text) => {
        copy(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [copy]);

    // Submit public key to blockchain
    const handleSubmitPublicKey = useCallback(async (uniqueId) => {
        try {
            const rowData = tableData.find(row => row.uniqueId === uniqueId);
            if (!rowData?.publicKey) return;

            const result = await submitPublicKey(uniqueId, rowData.publicKey);

            setTableData(prev =>
                prev.map(row =>
                    row.uniqueId === uniqueId
                        ? {
                            ...row,
                            txStatus: result.success
                                ? <a href={result.blockExplorerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    View in block explorer
                                </a>
                                : "Request failed"
                        }
                        : row
                )
            );

            if (result.success) {
                await handlePollPublicKeyRequests();
            }
        } catch (error) {
            console.error("Error submitting public key:", error);
        }
    }, [tableData, submitPublicKey]);

    // Get will message by ID
    const handleGetWillMessage = useCallback(async (row) => {
        try {
            const result = await getMessageByUniqueId(row.uniqueId);
            const message = result.success ? result.message : "Failed to retrieve message";
            setData(prev => ({ ...prev, displayMessage: message }));
            return result;
        } catch (error) {
            console.error("Error getting will message:", error);
            setData(prev => ({ ...prev, displayMessage: `Error: ${error.message}` }));
            return { success: false, message: error.message };
        }
    }, [getMessageByUniqueId, setData]);

    // Poll for public key requests
    const handlePollPublicKeyRequests = useCallback(async () => {
        if (!walletInfo.address) return;

        try {
            const requests = await getWillsByRecipient(walletInfo.address);
            if (requests && requests.length > 0) {
                const formattedRequests = requests.map(request => ({
                    uniqueId: request.uniqueId || '-',
                    signer: request.signer || '-',
                    message: request.message || '-',
                    fulfilled: request.fulfilled ? 'Fulfilled' : 'Pending',
                    publicKey: request.publicKey || '',
                    blockNumber: request.blockNumber ? request.blockNumber.toString() : '-',
                    messageHash: request.messageHash || '-',
                    txHash: request.txHash || '-',
                }));
                setTableData(formattedRequests);
            } else {
                setTableData([]);
            }
        } catch (error) {
            console.error("Error polling for requests:", error);
        }
    }, [walletInfo.address, getWillsByRecipient]);

    // Handle lock icon click
    const handleIconButtonClick = useCallback(async (row) => {
        setSelectedRow(row);
        setDecryptError('');

        const result = await handleGetWillMessage(row);
        if (!result.success) {
            setTableData(prev =>
                prev.map(item =>
                    item.uniqueId === row.uniqueId
                        ? { ...item, disable: true }
                        : item
                )
            );
        } else {
            toggleOpen();
        }
    }, [handleGetWillMessage, toggleOpen]);

    // Handle decrypt form submission
    const handleDecryptSubmit = useCallback(async (event) => {
        event.preventDefault();
        setIsDecrypting(true);
        setDecryptError('');

        try {
            const result = await handleDecrypt(event);
            if (!result) {
                setDecryptError('Decryption failed. This could be due to an incorrect private key or the time lock has not expired yet.');
            }
        } catch (error) {
            console.error("Decryption error:", error);
            setDecryptError(error.message || 'Unknown decryption error occurred');
        } finally {
            setIsDecrypting(false);
        }
    }, [handleDecrypt]);

    const TABLE_HEAD = ["Id", "From", "Msg", "Status", "", "Public Key", "Block #", ""];

    const renderTooltipContent = useCallback((message) => (
        <div className="max-w-xs overflow-hidden text-wrap">
            {message && message !== '-' ? message : 'No message available'}
        </div>
    ), []);

    return (
        <div className="col-span-full p-4">
            <Card className="w-full shadow-none border border-borderColor bg-bkg text-content">
                <CardHeader className={cardHeader}>
                    <div>
                        <Typography variant="h5" className="mt-1 mb-4">
                            Recipient Dashboard
                        </Typography>
                        <Typography>
                            Manage public key requests and encrypted messages
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className={cardBody}>
                        <div className="overflow-x-auto">
                            <table className={table}>
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head, index) => (
                                            <th key={index} className={tdHead}>
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
                                        const canSubmitKey = !loading &&
                                            row.publicKey &&
                                            row.fulfilled === "Pending" &&
                                            row.txHash !== "-";

                                        return (
                                            <tr key={index} className={tr}>
                                                <td className={tdClass}>
                                                    <Typography
                                                        variant="small"
                                                        className="cursor-pointer hover:text-blue-500"
                                                        onClick={() => handleCopy(row.uniqueId)}
                                                    >
                                                        {truncate(row.uniqueId, 8)}
                                                    </Typography>
                                                </td>
                                                <td className={tdClass}>
                                                    <Typography
                                                        variant="small"
                                                        className="cursor-pointer hover:text-blue-500"
                                                        onClick={() => handleCopy(row.signer)}
                                                    >
                                                        {truncate(row.signer, 8)}
                                                    </Typography>
                                                </td>
                                                <td className={tdClass}>
                                                    <Tooltip content={renderTooltipContent(row.message)}>
                                                        <ChatBubbleOvalLeftIcon className="h-4 w-4 cursor-pointer hover:text-blue-500" />
                                                    </Tooltip>
                                                </td>
                                                <td className={tdClass}>
                                                    <Chip
                                                        variant="ghost"
                                                        size="sm"
                                                        value={row.fulfilled}
                                                        color={row.fulfilled === "Fulfilled" ? "green" : "blue-gray"}
                                                    />
                                                </td>
                                                <td className={tdClass}>
                                                    <Button
                                                        variant="gradient"
                                                        size="sm"
                                                        disabled={!canSubmitKey}
                                                        className={`flex items-center gap-2 ${!canSubmitKey ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        onClick={() => handleSubmitPublicKey(row.uniqueId)}
                                                    >
                                                        {loading ? <Spinner className="h-4 w-4" /> : "Submit"}
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
                                                <td className={tdClass}>
                                                    {row.fulfilled === "Fulfilled" ? (
                                                        <Typography
                                                            variant="small"
                                                            className="cursor-pointer hover:text-blue-500"
                                                            onClick={() => handleCopy(row.publicKey)}
                                                        >
                                                            {truncate(row.publicKey, 8)}
                                                        </Typography>
                                                    ) : (
                                                        <Input
                                                            variant="standard"
                                                            placeholder="Enter your public key"
                                                            label="Public Key"
                                                            value={row.publicKey || ''}
                                                            onChange={(e) => handlePublicKeyChange(row.uniqueId, e.target.value)}
                                                            className="text-content border-none"
                                                            labelProps={{
                                                                className: "before:content-none after:content-none text-content peer-placeholder-shown:text-content"
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                                <td className={tdClass}>
                                                    <Typography
                                                        variant="small"
                                                        className="cursor-pointer hover:text-blue-500"
                                                        onClick={() => handleCopy(row.blockNumber)}
                                                    >
                                                        {truncate(row.blockNumber, 8)}
                                                    </Typography>
                                                </td>
                                                <td className={tdClass}>
                                                    <Tooltip content={row.fulfilled === "Fulfilled" ? "Decrypt Will" : "Not available"}>
                                                        <IconButton
                                                            variant="text"
                                                            onClick={() => handleIconButtonClick(row)}
                                                            disabled={row.fulfilled !== "Fulfilled"}
                                                            className={row.fulfilled !== "Fulfilled" ? "opacity-50 cursor-not-allowed" : ""}
                                                        >
                                                            {selectedRow?.uniqueId === row.uniqueId && open ?
                                                                <LockOpenIcon className="h-4 w-4" /> :
                                                                <LockClosedIcon className="h-4 w-4" />
                                                            }
                                                        </IconButton>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    <Collapse open={open}>
                        {selectedRow && (
                            <Card className="w-full shadow-none border border-borderColor bg-bkg text-content mt-4">
                                <form onSubmit={handleDecryptSubmit}>
                                    <CardBody>
                                        <div className="grid gap-6">
                                            <Input
                                                label="Private Key"
                                                name="privateKey"
                                                type="password"
                                                required
                                                className="text-content overflow-hidden overflow-ellipsis"
                                                labelProps={{ className: "peer-placeholder-shown:text-content" }}
                                            />
                                            <Textarea
                                                readOnly
                                                label="Encrypted message"
                                                name="displayMessage"
                                                value={data.displayMessage || ''}
                                                rows={7}
                                                className="text-content"
                                            />
                                            <div style={{ display: 'none' }}>
                                            <Input
                                                type="hidden"
                                                name="selectedRow"
                                                value={selectedRow.uniqueId}
                                            />
                                            </div>
                                            {decryptError && (
                                                <div className="text-red-500 text-sm">
                                                    {decryptError}
                                                </div>
                                            )}
                                        </div>
                                    </CardBody>
                                    <CardFooter className="flex w-full justify-between">
                                        <ClipboardDefault content={data.displayMessage || ''} />
                                        <div className="flex gap-2">
                                            <Button type="submit" variant="gradient" color="gray" disabled={isDecrypting}>
                                                {/* {isDecrypting ? <Spinner className="h-4 w-4 mr-2" /> : null} */}
                                                Decrypt
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </form>
                            </Card>
                        )}
                    </Collapse>
                </CardBody>
                <CardFooter className="flex w-full justify-between">
                    <Badge content={tableData.length} className={tableData.length === 0 ? "invisible" : ""}>
                        <Button
                            variant="gradient"
                            onClick={handlePollPublicKeyRequests}
                            disabled={loading}
                        >
                            {/* {loading ? <Spinner className="h-4 w-4 mr-2" /> : null} */}
                            Requests
                        </Button>
                    </Badge>
                    {copied && (
                        <div className="text-green-500 text-sm">
                            Copied to clipboard!
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}