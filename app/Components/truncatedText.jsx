import React from 'react';
import { Typography } from "@material-tailwind/react";

const TruncatedAddress = ({ address }) => {
    const truncate = (str) => {
        return str.slice(0, 6) + '...' + str.slice(-6);
    };

    return (
        <Typography
            variant="small"
            className="font-mono font-normal text-content"
        >
            {truncate(address)}
        </Typography>
    );
};

export { TruncatedAddress };