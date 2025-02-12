import { CustomContext } from "@/app/Context/context";
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
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { useWallet } from "../Context/WalletContext";
import { ClipboardDefault } from "./clipboard";
import { TruncatedAddress } from "./truncatedText";

export function RecipientTable() {

    const { walletInfo } = useWallet();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

       

    const {
        loading,
        error,
        submitPublicKey,
        pollForPublicKeyRequests,
        pollForMessages,
        publicKeySubmitted,
        getRecipientRequest,
        getRecipientRequests,
    } = useContractInteraction();

    const [tableData, setTableData] = useState({
        owner: "",
        publicKey: "",
        contractAddress: "",
        requestStatus: "",
    });

    const { data, setData } = useContext(CustomContext);
    const [targetSubmitPK, setTargetSubmitPK] = useState("");

    const handleSubmitPublicKey = async () => {
        if (!targetSubmitPK) return;
        const check = await publicKeySubmitted(tableData.requestAddressFrom, walletInfo.address);
        const result = await submitPublicKey(tableData.requestAddressFrom, targetSubmitPK);
        setTableData((prev) => ({
            ...prev,
            requestStatusSubmitPK: result.success
                ? <a
                    href={result.blockExplorerUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                >View in block explorer</a>
                : "Request failed",
        }));
    };

    const handlePollPublicKeyRequests = async () => {
        const requests = await pollForPublicKeyRequests();
        setTableData((prev) => ({
            ...prev,
            requestNum: requests.length > 0 ? "1" : "-",
            requestTxHash: requests.length > 0 ? requests[requests.length - 1].transactionHash : "-",
            requestMessage: requests.length > 0 ? requests[requests.length - 1].message : "-",
            requestAddressFrom: requests.length > 0 ? requests[requests.length - 1].from : "-",
            blockExplorerUrl: requests.length > 0 ? <a
                href={requests[requests.length - 1].blockExplorerUrl}
                rel="noopener noreferrer"
                target="_blank"
            >View in block explorer</a>
                : "Request failed",
        }));
    };

    const TABLE_HEAD = ["From", "", "TxHash", "Status", "Method", "Public Key", "Status"];

    const TABLE_ROWS = [
        {
            from: < TruncatedAddress address={tableData.requestAddressFrom || ""} />,
            clipboard: tableData.requestAddressFrom,
            txHash: < TruncatedAddress address={tableData.requestTxHash || ""} />,
            status: tableData.blockExplorerUrl,
            func: handleSubmitPublicKey,
            method: "Submit Public Key",
            pk: <Input
                variant="standard"
                placeholder="Enter your public key"
                label="Public Key"
                value={targetSubmitPK}
                onChange={(e) => setTargetSubmitPK(e.target.value)}
                className="text-content border-none"
                labelProps={{
                    className: "before:content-none after:content-none text-content peer-placeholder-shown:text-content",
                }}
            />,
            disabled: loading || !targetSubmitPK,
            statusSubmit: tableData.requestStatusSubmitPK || "-",
        },
    ];


    return (
        <Card className={card}>
            <CardHeader className={cardHeader}>
                <div>
                    <Typography variant="h5" className="mt-1 mb-4">
                        Recipient Dashboard
                    </Typography>
                    <Typography>
                        Here you can see the data of the contract and the public keys of the recipients.
                    </Typography>

                </div>
            </CardHeader>
            <CardBody className={cardBody}>
                <table className={table} enableRowNumbers="true">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className={tdHead}
                                >
                                    <Typography
                                        variant="small"
                                        className="font-bold leading-none opacity-100"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TABLE_ROWS.map(({ from, txHash, clipboard, status, disabled, method, func, pk, statusSubmit }, index) => {
                            const isLast = index === TABLE_ROWS.length - 1;
                            const tdClass = isLast ? tdLast : td;
                            return (
                                <tr key={from} className={tr}>
                                    <td className={tdClass}>
                                        {from}
                                    </td>
                                    <td className={tdClass}>
                                        <ClipboardDefault content={clipboard} />
                                    </td>
                                    <td className={tdClass}>
                                        {txHash}
                                    </td>
                                    <td className={tdClass}>
                                        <Typography
                                            as="a"
                                            href="#"
                                            variant="small"
                                            className="font-normal"
                                        >
                                            {status}
                                        </Typography>
                                    </td>
                                    <td className={tdClass}>
                                        <Typography
                                            as="a"
                                            href="#"
                                            variant="small"
                                            disabled={disabled}
                                            className={`font-bold textTransform flex items-center gap-2 ${disabled ? "text-gray-500" : "text-content"}`}
                                            onClick={func}
                                        >
                                            {loading ? <Spinner className="h-4 w-4" /> : method}
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
                                    <td className={tdClass}>
                                        {pk}
                                    </td>
                                    <td className={tdClass}>
                                        <Typography
                                            as="a"
                                            href="#"
                                            variant="small"
                                            className="font-normal"
                                        >
                                            {statusSubmit}
                                        </Typography>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex w-full justify-between">
                <Button
                    variant="gradient"
                    onClick={handlePollPublicKeyRequests}>
                    Requests
                </Button>
            </CardFooter>
        </Card>
    );
}
