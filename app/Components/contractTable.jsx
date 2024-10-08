import { CustomContext } from "@/app/Context/context";
import { useContractInteraction } from "@/app/scripts/interact";
import { useContext, useState, useEffect } from "react";
import {
    buttonTypography,
    typography,
    card,
    table,
    td,
    tr,
} from "@/app/scripts/classesCustomization";
import {
    Button,
    Card,
    Input,
    Spinner,
    Typography,
} from "@material-tailwind/react";
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

    const TABLE_ROWS = [
        {
            func: handleFetchContract,
            name: "Fetch contract",
            result: tableData.contractAddress || "-",
            clipboard: tableData.contractAddress,
            status: tableData.requestStatusRequestContract || "-"
        },
        {
            func: handleFetchOwner,
            name: "Fetch Owner",
            result: tableData.owner || "-",
            clipboard: tableData.owner,
            status: ""
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
            status: tableData.requestStatusRequestPK || "-"
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
            status: tableData.requestStatusGetPK || "-"
        },
    ];


    return (
        <Card className={card}>
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
                    {TABLE_ROWS.map(({ func, name, result, clipboard, status }, index) => {

                        return (
                            <tr key={name} className={tr}>
                                <td className={td}>
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        disabled={loading}
                                        onClick={func}
                                        className={buttonTypography}
                                    >
                                        {loading ? <Spinner className="h-4 w-4" /> : name}
                                    </Button>
                                </td>
                                <td className={td}>
                                    <Typography
                                        variant="small"
                                        className="font-normal dark:text-text-dark"
                                    >
                                        {result}
                                    </Typography>
                                </td>
                                <td className={td}>
                                    <ClipboardDefault content={clipboard} />
                                </td>
                                <td className={td}>
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
        </Card>
    );
}
