import React, { useContext, useEffect } from 'react';
import { DocumentIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Card, IconButton, Typography, Button } from "@material-tailwind/react";
import { useTableData } from '@/app/Context/TableDataContext';  // We'll create this context
import { useWallet } from "@/app/Context/WalletContext";
import { useContractInteraction } from "@/app/scripts/interact";



export function TableWithoutBorder() {

    const { walletInfo } = useWallet();
    const { contractData, loading, error, tableData, handleRequestPublicKey, updateTableData, handleFetchOwner } = useTableData();

    const TABLE_HEAD = [
        <button onClick={handleFetchOwner}>Fetch Owner</button>,
        "Customer",
        "Amount",
        "Issued",
        "Payment Date",
        "Actions",
    ];


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Card className="h-full w-full overflow-scroll">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                            <th key={head} className="border-b border-gray-300 p-4 pt-10">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-bold leading-none"
                                >
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map(({ number, customer, amount, issued, date }, index) => (
                        <tr key={index} >
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-bold"
                                >
                                    {contractData}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                    className="font-normal text-gray-600"
                                >
                                    {customer}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                    className="font-normal text-gray-600"
                                >
                                    {amount}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                    className="font-normal text-gray-600"
                                >
                                    {issued}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                    className="font-normal text-gray-600"
                                >
                                    {date}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <IconButton variant="text" size="sm">
                                        <DocumentIcon className="h-4 w-4 text-gray-900" />
                                    </IconButton>
                                    <IconButton variant="text" size="sm">
                                        <ArrowDownTrayIcon
                                            strokeWidth={3}
                                            className="h-4 w-4 text-gray-900"
                                        />
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}
