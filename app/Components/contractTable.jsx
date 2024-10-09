import { CustomContext } from "@/app/Context/context";
import {
    card,
    cardBody,
    cardHeader,
    table,
    td,
    tdLast,
    tr
} from "@/app/scripts/classesCustomization";
import { useContractInteraction } from "@/app/scripts/interact";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { ClipboardDefault } from "./clipboard";

export function DefaultTable() {

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
        fetchOwner,
        fetchContract,
        requestPublicKey,
        getPublicKey,
        submitPublicKey,
    } = useContractInteraction();

    const [tableData, setTableData] = useState({
        owner: "",
        publicKey: "",
        contractAddress: "",
        requestStatus: "",
    });

    const { data, setData } = useContext(CustomContext);
    const [targetAddress, setTargetAddress] = useState("");
    const [targetAddressGetPK, setTargetAddressGetPK] = useState("");
    const [targetSubmitPK, setTargetSubmitPK] = useState("");

    const TABLE_HEAD = ["Function", "Return", "", "Status"];

    const handleFetchOwner = async () => {
        // const owner = walletInfo.address;
        const owner = await fetchOwner();
        setTableData((prev) => ({ ...prev, owner }));
    };

    const handleFetchContract = async () => {
        const result = await fetchContract();
        const contractAddress = result.contractAddress;
        console.log(contractAddress);
        setTableData((prev) => ({ ...prev, contractAddress }));
        setTableData((prev) => ({
            ...prev,
            requestStatusRequestContract: result.success
                ? <a
                    href={result.blockExplorerUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                >View in block explorer</a>
                : "Request failed",
        }));
    };

    const handleGetPublicKey = async () => {
        if (!targetAddressGetPK) return;
        const success = await getPublicKey(
            targetAddressGetPK,
            "Fetching the public key"
        );
        const publicKey = success;
        setTableData((prev) => ({ ...prev, publicKey }));
        setTableData((prev) => ({
            ...prev,
            requestStatusGetPK: publicKey ? "Successful call" : "Call failed",
        }));

        setData((prevData) => ({
            ...prevData,
            publicKey: publicKey,
        }));
    };

    const handleRequestPublicKey = async () => {
        if (!targetAddress) return;
        const result = await requestPublicKey(targetAddress, "Requesting your public key");
        setTableData((prev) => ({
            ...prev,
            requestStatusRequestPK: result.success
                ? <a
                    href={result.blockExplorerUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                >View in block explorer</a>
                : "Request failed",
        }));
    };

    const handleSubmitPublicKey = async () => {
        if (!targetSubmitPK) return;
        const result = await submitPublicKey(tableData.owner, targetSubmitPK);
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

    const TABLE_ROWS = [
        {
            func: handleFetchContract,
            name: "Fetch contract",
            result: tableData.contractAddress || "-",
            clipboard: tableData.contractAddress,
            status: tableData.requestStatusRequestContract || "-",
            disabled: loading
        },
        {
            func: handleFetchOwner,
            name: "Fetch Owner",
            result: tableData.owner || "-",
            clipboard: tableData.owner,
            status: "",
            disabled: loading
        },
        {
            func: handleRequestPublicKey,
            name: "Request Public Key",
            result: <Input
                variant="standard"
                placeholder="Enter target address"
                label="Target Address"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
            />,
            clipboard: targetAddress,
            status: tableData.requestStatusRequestPK || "-",
            disabled: loading || !targetAddress
        },
        {
            func: handleSubmitPublicKey,
            name: "Submit Public Key",
            result: <Input
                variant="standard"
                placeholder="Enter your public key"
                label="Public Key"
                value={targetSubmitPK}
                className="overflow-elipsis"
                onChange={(e) => setTargetSubmitPK(e.target.value)}
            />,
            clipboard: targetSubmitPK,
            status: tableData.requestStatusSubmitPK || "-",
            disabled: loading || !targetSubmitPK
        },
        {
            func: handleGetPublicKey,
            name: "Get Public Key",
            result: <Input
                variant="standard"
                placeholder="Enter target address"
                label="Target Address"
                value={targetAddressGetPK}
                onChange={(e) => setTargetAddressGetPK(e.target.value)}
            />,
            clipboard: targetAddressGetPK,
            status: tableData.requestStatusGetPK || "-",
            disabled: loading || !targetAddressGetPK
        },
    ];


    return (
        <Card className={card}>
            <CardHeader className={cardHeader}>
                <Typography variant="h5" className="mb-4">
                    Contract Data Dashboard
                </Typography>
                <Typography>
                    Here you can see the data of the contract and the public keys of the signers.
                </Typography>
            </CardHeader>
            <CardBody className={cardBody}>
                <table className={table}>
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    // className="bg-blue-gray-50 p-4"
                                    className={td}
                                >
                                    <Typography
                                        variant="small"
                                        // color="blue-gray"
                                        className="font-bold leading-none opacity-100"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TABLE_ROWS.map(({ func, name, result, clipboard, status, disabled }, index) => {
                            const isLast = index === TABLE_ROWS.length - 1;
                            const tdClass = isLast ? tdLast : td;
                            return (
                                <tr key={name} className={tr}>
                                    <td className={tdClass}>
                                        <Button
                                            variant="gradient"
                                            size="sm"
                                            disabled={disabled}
                                            onClick={func}
                                            className={`buttonTypography flex items-center gap-2`}
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
                                        </Button>
                                    </td>
                                    <td className={tdClass}>
                                        <Typography
                                            variant="small"
                                            className="font-normal dark:text-text-dark overflow-elipsis"
                                        >
                                            {result}
                                        </Typography>
                                    </td>
                                    <td className={tdClass}>
                                        <ClipboardDefault content={clipboard} />
                                    </td>
                                    <td className={tdClass}>
                                        <Typography
                                            as="a"
                                            href="#"
                                            variant="small"
                                            // color="blue-gray"
                                            className="font-normal dark:text-text-dark"
                                        >
                                            {status}
                                        </Typography>
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
