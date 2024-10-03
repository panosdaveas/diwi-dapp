import React, { useState, useEffect, useContext } from 'react';
import {
    Card,
    Typography,
    Button,
    Spinner,
    Input,
    List,
    ListItem,
} from "@material-tailwind/react";
import { useContractInteraction } from "@/app/scripts/interact";
import { useWallet } from "@/app/Context/WalletContext";
import { CustomContext } from "@/app/Context/context";

import EthCrypto from "eth-crypto";

const ContractDataTable = () => {
    const { data, setData } = useContext(CustomContext);
    const { walletInfo } = useWallet();
    const { loading, error, fetchOwner, fetchContract, requestPublicKey, getPublicKey } = useContractInteraction();
    const [tableData, setTableData] = useState({
        owner: '',
        publicKey: '',
        requestStatus: ''
    });
    const [targetAddress, setTargetAddress] = useState('');

    const handleFetchOwner = async () => {
        const owner = walletInfo.address;
        setTableData(prev => ({ ...prev, owner }));
    };

    const handleFetchContract = async () => {
        const contractAddress = fetchContract();
        setTableData(prev => ({ ...prev, contractAddress }));
    };

    const handleGetPublicKey = async () => {
        if (!targetAddress) return;
        const publicKey = await getPublicKey(targetAddress);
        const success = await requestPublicKey(targetAddress, "Fetching the public key");
        setTableData(prev => ({ ...prev, publicKey }));
        setTableData(prev => ({
            ...prev,
            requestStatusGetPK: success ? 'Successful call' : 'Call failed'
        }));
        
        setData((prevData) => ({
            ...prevData,
            publicKey: publicKey,
            // publicKey: publicKeyUint8Array,
            // privateKey: newKeyPair.privateKey,
        }));
    };

    const handleRequestPublicKey = async () => {
        if (!targetAddress) return;
        const success = await requestPublicKey(targetAddress, "Requesting your public key");
        setTableData(prev => ({
            ...prev,
            requestStatusRequestPK: success ? 'Request sent successfully' : 'Request failed'
        }));
    };

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <Card className="h-full w-full overflow-scroll">
            {/* <Card className="w-full max-w-[1000px] mx-auto overflow-scroll"> */}
            <div className="p-4">
                <Typography variant="h5" color="blue-gray" className="mb-4">
                    Contract Data Dashboard
                </Typography>

                {/* <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter target address"
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                        className="border rounded p-2 mr-2"
                    />
                </div> */}

                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-300 p-4 pt-10">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-bold leading-none"
                                >
                                    Function
                                </Typography>
                            </th>
                            <th className="border-b border-gray-300 p-4 pt-10">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-bold leading-none"
                                >
                                    Return
                                </Typography>
                            </th>
                            <th className="border-b border-gray-300 p-4 pt-10">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-bold leading-none"
                                >
                                    Copy
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4">
                                <Button
                                    variant="text" className="flex items-center gap-2"
                                    size="sm"
                                    disabled={loading}
                                    onClick={handleFetchContract}
                                >
                                    {loading ? <Spinner className="h-4 w-4" /> : 'Fetch Contract'}
                                </Button>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray">
                                    {tableData.contractAddress || '-'}
                                </Typography>
                            </td>
                            <td className="p-4"></td>
                        </tr>
                        <tr>
                            <td className="p-4">
                                <Button
                                    variant="text" className="flex items-center gap-2"
                                    size="sm"
                                    disabled={loading}
                                    onClick={handleFetchOwner}
                                >
                                    {loading ? <Spinner className="h-4 w-4" /> : 'Fetch Owner'}
                                </Button>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray">
                                    {tableData.owner || '-'}
                                </Typography>
                            </td>
                            <td className="p-4"></td>
                        </tr>
                        <tr>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Button
                                    variant="text" className="flex items-center gap-2"
                                    size="sm"
                                    disabled={loading || !targetAddress}
                                    onClick={handleRequestPublicKey}
                                >
                                    {loading ? <Spinner className="h-4 w-4" /> : 'Request Public Key'}
                                </Button>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Input
                                    type="text"
                                    placeholder="Enter target address"
                                    value={targetAddress}
                                    onChange={(e) => setTargetAddress(e.target.value)}
                                    className="border rounded p-2 mr-2 before:content-none after:content-none"
                                />
                            </td>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Typography variant="small" color="blue-gray">
                                    {tableData.requestStatusRequestPK || '-'}
                                </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Button
                                    variant="text" className="flex items-center gap-2"
                                    size="sm"
                                    disabled={loading || !targetAddress}
                                    onClick={handleGetPublicKey}
                                >
                                    {loading ? <Spinner className="h-4 w-4" /> : 'Get Public Key'}
                                </Button>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Typography variant="small" color="blue-gray">
                                    {tableData.publicKey || '-'}
                                </Typography>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Typography variant="small" color="blue-gray">
                                    {tableData.requestStatusGetPK || '-'}
                                </Typography>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default ContractDataTable;