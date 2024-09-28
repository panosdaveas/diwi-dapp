import { ConnectButton } from '@rainbow-me/rainbowkit';

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