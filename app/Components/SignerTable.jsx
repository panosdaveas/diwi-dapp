import { CustomContext } from "@/app/Context/context";
import { useWallet } from "@/app/Context/WalletContext";
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
    Textarea
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { ClipboardDefault } from "./clipboard";
import { TruncatedAddress } from "./truncatedText";

export function SignerTable() {
    const [isMobile, setIsMobile] = useState(false);
    const [message, setMessage] = useState("");
    const { data, setData } = useContext(CustomContext);

    const {
        loading,
        error,
        fetchOwner,
        fetchContract,
        requestPublicKey,
        getSignerRequest,
        verifyMessage,
        sendMessageToRecipient
    } = useContractInteraction();

    const [tableData, setTableData] = useState({
        owner: "",
        publicKey: "",
        contractAddress: "",
        requestStatus: "",
        messageHash: "",
        encryptedMessage: ""
    });

    const [targetAddress, setTargetAddress] = useState("");
    const [targetAddressGetPK, setTargetAddressGetPK] = useState("");

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const TABLE_HEAD = ["Function", "Return", "", "Status", "Message Hash"];

    const handleFetchContract = async () => {
        const result = await fetchContract();
        setTableData(prev => ({
            ...prev,
            contractAddress: result.contractAddress,
            requestStatusRequestContract: result.success ?
                <a href={result.blockExplorerUrl} target="_blank" rel="noopener noreferrer">
                    View in block explorer
                </a> :
                "Request failed"
        }));
    };

    const handleRequestPublicKey = async () => {
        if (!targetAddress || !message) return;
        const result = await requestPublicKey(targetAddress, message);
        const messageHash = await verifyMessage(message);

        setTableData(prev => ({
            ...prev,
            messageHash,
            requestStatusRequestPK: result.success ?
                <a href={result.blockExplorerUrl} target="_blank" rel="noopener noreferrer">
                    View in block explorer
                </a> :
                "Request failed"
        }));
    };

    const handleGetPublicKey = async () => {
        if (!targetAddressGetPK) return;
        const result = await getSignerRequest(targetAddressGetPK);

        setTableData(prev => ({
            ...prev,
            publicKey: result.publicKey,
            requestStatusGetPK: result.fulfilled ? "Submitted" : "Pending"
        }));

        setData(prev => ({
            ...prev,
            publicKey: result.publicKey,
            addressRecipient: targetAddressGetPK
        }));
    };

    const TABLE_ROWS = [
        {
            func: handleFetchContract,
            name: "Fetch contract",
            result: <TruncatedAddress address={tableData.contractAddress || ""} />,
            clipboard: tableData.contractAddress,
            status: tableData.requestStatusRequestContract || "-",
            disabled: loading
        },
        {
            func: handleRequestPublicKey,
            name: "Request Public Key",
            result: (
                <div className="flex flex-col gap-2">
                    <Input
                        variant="standard"
                        placeholder="Enter target address"
                        label="Target Address"
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                        className="text-content border-none"
                        labelProps={{
                            className: "before:content-none after:content-none text-content peer-placeholder-shown:text-content"
                        }}
                    />
                    <Textarea
                        variant="standard"
                        placeholder="Enter your message"
                        label="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="text-content border-none"
                        labelProps={{
                            className: "before:content-none after:content-none text-content peer-placeholder-shown:text-content"
                        }}
                    />
                </div>
            ),
            clipboard: targetAddress,
            status: tableData.requestStatusRequestPK || "-",
            messageHash: <TruncatedAddress address={tableData.messageHash || ""} />,
            disabled: loading || !targetAddress || !message
        },
        {
            func: handleGetPublicKey,
            name: "Get Public Key",
            result: (
                <Input
                    variant="standard"
                    placeholder="Enter target address"
                    label="Target Address"
                    value={targetAddressGetPK}
                    onChange={(e) => setTargetAddressGetPK(e.target.value)}
                    className="text-content border-none"
                    labelProps={{
                        className: "before:content-none after:content-none peer-placeholder-shown:text-content"
                    }}
                />
            ),
            clipboard: targetAddressGetPK,
            status: tableData.requestStatusGetPK || "-",
            disabled: loading || !targetAddressGetPK
        }
    ];

    return (
        <Card className={card}>
            <CardHeader className={cardHeader}>
                <div>
                    <Typography variant="h5" className="mt-1 mb-4">
                        Signer Dashboard
                    </Typography>
                    <Typography>
                        Request and manage recipient public keys
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
                        {TABLE_ROWS.map(({ func, name, result, clipboard, status, disabled, messageHash }, index) => {
                            const isLast = index === TABLE_ROWS.length - 1;
                            const tdClass = isLast ? tdLast : td;
                            return (
                                <tr key={name} className={tr}>
                                    <td className={tdClass}>
                                        <Typography
                                            as="a"
                                            href="#"
                                            variant="small"
                                            disabled={disabled}
                                            className={`font-bold textTransform flex items-center gap-2 ${disabled ? "text-gray-500" : "text-content"}`}
                                            onClick={func}
                                        >
                                            {loading ? <Spinner className="h-4 w-4" /> : name}
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
                                        </Typography>
                                    </td>
                                    <td className={tdClass}>{result}</td>
                                    <td className={tdClass}>
                                        <ClipboardDefault content={clipboard} />
                                    </td>
                                    <td className={tdClass}>
                                        <Typography variant="small" className="font-normal">
                                            {status}
                                        </Typography>
                                    </td>
                                    <td className={tdClass}>
                                        {messageHash}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody>
        </Card>
    );
}