"use client"
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabaseClient'; // Ensure this points to your Supabase client

// Minimal ABI just to read the token balance and symbol from the blockchain
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

interface Web3PortfolioProps {
    userId: string; // Passed from your auth context/session
}

export default function Web3Portfolio({ userId }: Web3PortfolioProps) {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [blockchainAssets, setBlockchainAssets] = useState<any[]>([]);
    const [loadingAssets, setLoadingAssets] = useState(false);

    // 1. Check if wallet is already linked in Supabase on component mount
    useEffect(() => {
        async function fetchUserProfile() {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('wallet_address')
                .eq('id', userId)
                .single();

            if (data?.wallet_address) {
                setWalletAddress(data.wallet_address);
                fetchWeb3Balances(data.wallet_address);
            }
        }
        fetchUserProfile();
    }, [userId]);

    // 2. Connect MetaMask and Link to Supabase
    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert("MetaMask is not installed. Please install it to view your Web3 portfolio.");
            return;
        }

        setIsConnecting(true);
        try {
            // Request account access from MetaMask
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            // Save the wallet address to their user profile in Supabase
            const { error } = await supabase
                .from('user_profiles')
                .update({ wallet_address: address })
                .eq('id', userId);

            if (error) throw error;

            setWalletAddress(address);
            fetchWeb3Balances(address);
            
        } catch (error: any) {
            console.error("Wallet connection failed:", error);
            alert("Failed to connect wallet: " + error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    // 3. Fetch ACTUAL balances from the Polygon Blockchain
    const fetchWeb3Balances = async (address: string) => {
        setLoadingAssets(true);
        try {
            if (typeof window.ethereum === 'undefined') return;
            const provider = new ethers.BrowserProvider(window.ethereum);

            const { data: investments } = await supabase
                .from('investments')
                .select(`
                    property_id,
                    property_shares ( smart_contract_address, price_per_share, projected_roi ),
                    properties ( title, location_city )
                `)
                .eq('user_id', userId);

            if (!investments) return;

            const assets: any[] = [];

            for (const inv of investments) {
                const shares = inv.property_shares as Array<{
                    smart_contract_address: string;
                    price_per_share: number;
                    projected_roi: number;
                }>;

                if (!shares || shares.length === 0) continue;

                for (const share of shares) {
                    const contractAddress = share.smart_contract_address;
                    if (!contractAddress) continue;

                    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
                    const rawBalance = await contract.balanceOf(address);
                    const symbol = await contract.symbol();
                    const formattedBalance = ethers.formatUnits(rawBalance, 18);

                    if (parseFloat(formattedBalance) > 0) {
                        assets.push({
                            title: inv.properties?.[0]?.title,
                            city: inv.properties?.[0]?.location_city,
                            symbol,
                            balance: parseFloat(formattedBalance),
                            roi: share.projected_roi,
                            valueKES: parseFloat(formattedBalance) * share.price_per_share,
                            contractAddress,
                        });
                    }
                }
            }

            setBlockchainAssets(assets);
        } catch (error) {
            console.error("Error fetching blockchain data:", error);
        } finally {
            setLoadingAssets(false);
        }
    };

    return (
        <div className="bg-white border border-stone-200 p-8 shadow-sm rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-2xl font-serif text-stone-900">Web3 Portfolio</h2>
                    <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">
                        Immutable Asset Ledger on Polygon
                    </p>
                </div>

                {!walletAddress ? (
                    <button 
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="mt-4 md:mt-0 flex items-center gap-2 bg-black hover:bg-emerald-600 text-white px-6 py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-50 rounded"
                    >
                        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                    </button>
                ) : (
                    <div className="mt-4 md:mt-0 flex items-center gap-3 bg-stone-50 border border-stone-200 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-mono text-stone-600">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </span>
                        <button 
                            onClick={() => setWalletAddress(null)} 
                            className="text-[10px] text-red-500 hover:underline uppercase ml-2"
                        >
                            Disconnect
                        </button>
                    </div>
                )}
            </div>

            {/* Assets Display */}
            {walletAddress && (
                <div className="space-y-4">
                    {loadingAssets ? (
                        <div className="text-center p-8 text-stone-400 text-xs uppercase tracking-widest animate-pulse">
                            Syncing with Polygon Blockchain...
                        </div>
                    ) : blockchainAssets.length === 0 ? (
                        <div className="text-center p-10 bg-stone-50 border border-stone-100 rounded">
                            <p className="text-stone-500 font-serif text-lg">No digital shares found.</p>
                            <p className="text-xs text-stone-400 mt-2">Invest in a property to see your tokens here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blockchainAssets.map((asset, idx) => (
                                <div key={idx} className="bg-[#FAFAFA] border border-stone-200 p-6 rounded-lg relative overflow-hidden group hover:border-emerald-400 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <svg className="w-16 h-16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0L31.5 9V23L16 32L0.5 23V9L16 0Z" fill="#8247E5"/></svg>
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-serif text-lg text-stone-900 leading-tight">{asset.title}</h3>
                                                <p className="text-[10px] uppercase text-stone-500 tracking-wider">{asset.city}</p>
                                            </div>
                                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                                                {asset.symbol}
                                            </span>
                                        </div>

                                        <div className="space-y-1 mb-4">
                                            <p className="text-3xl font-light text-stone-900">{asset.balance} <span className="text-sm font-normal text-stone-400">Shares</span></p>
                                            <p className="text-sm text-emerald-600 font-medium">Est. Value: {asset.valueKES.toLocaleString()} KES</p>
                                        </div>

                                        <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                                            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Proj. Yield: {asset.roi}%</p>
                                            <a 
                                                href={`https://amoy.polygonscan.com/token/${asset.contractAddress}?a=${walletAddress}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] text-blue-500 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1"
                                            >
                                                View on Explorer ↗
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}