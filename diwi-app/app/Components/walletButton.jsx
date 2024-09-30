"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '@/app/Context/WalletContext';

const ConnectWalletButton = () => {

    return (
            <ConnectButton
                accountStatus="address"
                chainStatus="icon"
                showBalance={false}
            />
    );
};

export { ConnectWalletButton };