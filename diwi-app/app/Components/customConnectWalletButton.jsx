import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CustomContext } from "@/app/Context/context";
import { useContext, useEffect, useCallback } from 'react';

export const CustomConnectWalletButton = ({ onAccountConnected }) => {
    const { data, setData } = useContext(CustomContext);

    const updateAccountData = useCallback((account) => {
        if (account && (!data.account || data.account.address !== account.address)) {
            setData(prevData => ({
                ...prevData,
                account: {
                    address: account.address,
                    displayName: account.displayName,
                    displayBalance: account.displayBalance
                }
            }));
        }
    }, [data.account, setData, onAccountConnected]);

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                useEffect(() => {
                    if (connected && account) {
                        updateAccountData(account);
                    }
                }, [connected, account, updateAccountData]);

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button onClick={openConnectModal} type="button">
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }
                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button
                                        onClick={openChainModal}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                className="h-5 w-5"
                                                style={{
                                                    background: chain.iconBackground,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        className="h-5 w-5"
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                    <button onClick={openAccountModal} type="button">
                                        {account.displayName}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};