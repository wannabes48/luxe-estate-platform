"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ethers } from 'ethers';
import LuxuryToast from '@/components/ui/LuxuryToast';

// Basic ERC20 ABI to check token balances
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
];

export default function InvestorDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [investments, setInvestments] = useState<any[]>([]);
    
    // Web3 State
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [onChainBalances, setOnChainBalances] = useState<Record<string, string>>({});
    
    const [toast, setToast] = useState({ msg: '', type: 'success' as 'success' | 'error', show: false });

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type, show: true });
    };

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!session || error) {
                router.push('/auth/login');
                return;
            }

            // Fetch User Profile
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
            
            setUser(profile || session.user);

            // Fetch user's investments joined with property details and the smart contract address
            // Note: Adjust table names if your schema is different
            const { data: userInvestments } = await supabase
                .from('investments')
                .select(`
                    id,
                    shares_owned,
                    amount_invested,
                    properties (
                        title,
                        property_images(image_url)
                    ),
                    property_shares (
                        smart_contract_address,
                        price_per_share,
                        projected_roi
                    )
                `)
                .eq('user_id', session.user.id);

            setInvestments(userInvestments || []);
            setLoading(false);

            // Auto-check if wallet was already connected
            if (typeof window !== 'undefined' && (window as any).ethereum) {
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0].address);
                    fetchOnChainBalances(accounts[0].address, userInvestments || []);
                }
            }
        };

        checkSession();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    // --- WEB3 CONNECTION LOGIC ---
    const connectWallet = async () => {
        if (typeof window === 'undefined' || !(window as any).ethereum) {
            showToast("MetaMask is not installed. Please install it to view your Web3 assets.", "error");
            return;
        }

        setIsConnecting(true);
        try {
            const eth = (window as any).ethereum;
            
            // 1. Request Account Access
            const accounts = await eth.request({ method: 'eth_requestAccounts' });
            const address = accounts[0];
            
            // 2. Force Switch to Polygon Amoy Testnet (Chain ID 80002 -> 0x13882)
            try {
                await eth.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x13882' }],
                });
            } catch (switchError: any) {
                // If the network is not added to MetaMask, add it
                if (switchError.code === 4902) {
                    await eth.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x13882',
                            chainName: 'Polygon Amoy Testnet',
                            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                            rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                            blockExplorerUrls: ['https://amoy.polygonscan.com/']
                        }]
                    });
                } else {
                    throw switchError;
                }
            }

            setWalletAddress(address);
            showToast("Wallet connected successfully!", "success");
            
            // 3. Fetch Balances for their investments
            await fetchOnChainBalances(address, investments);

        } catch (error: any) {
            showToast(error.message || "Failed to connect wallet", "error");
        } finally {
            setIsConnecting(false);
        }
    };

    // Fetch actual ERC20 token balances from the blockchain
    const fetchOnChainBalances = async (address: string, invs: any[]) => {
        if (!address || invs.length === 0) return;
        
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const newBalances: Record<string, string> = {};

        for (const inv of invs) {
            const contractAddress = inv.property_shares?.smart_contract_address;
            if (contractAddress && contractAddress.startsWith('0x')) {
                try {
                    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
                    const balance = await contract.balanceOf(address);
                    const decimals = await contract.decimals();
                    // Format balance from Wei to readable number
                    newBalances[contractAddress] = ethers.formatUnits(balance, decimals);
                } catch (err) {
                    console.error(`Failed to fetch balance for ${contractAddress}`, err);
                    newBalances[contractAddress] = "0";
                }
            }
        }
        setOnChainBalances(newBalances);
    };

    // Calculate Totals
    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount_invested || 0), 0);
    const totalShares = investments.reduce((sum, inv) => sum + Number(inv.shares_owned || 0), 0);

    if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-serif text-2xl">Loading Portfolio...</div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <LuxuryToast message={toast.msg} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />

            {/* Navigation */}
            <nav className="bg-[#0D0D0D] text-white py-6 px-6 lg:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/"><h1 className="font-serif text-2xl tracking-wide">Luxe Estate.</h1></Link>
                <div className="flex items-center gap-6">
                    <Link href="/invest" className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-white transition-colors">Marketplace</Link>
                    <div className="w-px h-4 bg-stone-700"></div>
                    <span className="text-[10px] uppercase tracking-widest hidden md:block">Welcome, {user?.full_name || user?.email?.split('@')[0]}</span>
                    <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold hover:text-white transition-colors">Logout</button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 lg:p-12">
                
                {/* Header & Wallet Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">Total Portfolio Value</p>
                        <h2 className="text-5xl lg:text-7xl font-serif text-stone-900">
                            <span className="text-3xl lg:text-5xl text-stone-400">KES</span> {totalInvested.toLocaleString()}
                        </h2>
                    </div>

                    {/* Web3 Wallet Portal */}
                    <div className="bg-white border border-stone-200 p-6 shadow-sm w-full lg:w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-serif text-lg text-stone-900">Web3 Vault</h3>
                            <div className={`w-2 h-2 rounded-full ${walletAddress ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                        </div>
                        
                        {walletAddress ? (
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Connected Address</p>
                                <p className="font-mono text-xs bg-stone-100 p-3 text-stone-700 truncate rounded-sm border border-stone-200">
                                    {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
                                </p>
                                <button 
                                    onClick={() => fetchOnChainBalances(walletAddress, investments)}
                                    className="mt-4 w-full text-[10px] uppercase tracking-widest text-emerald-600 font-bold hover:text-black transition-colors text-left"
                                >
                                    ↻ Refresh Balances
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs text-stone-500 mb-4 line-clamp-2">Connect your MetaMask wallet to verify your fractional tokens directly on the Polygon network.</p>
                                <button 
                                    onClick={connectWallet}
                                    disabled={isConnecting}
                                    className="w-full bg-[#0D0D0D] text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                >
                                    {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 mb-16">
                    <div className="bg-white p-6 border border-stone-100 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Total Assets</p>
                        <p className="font-serif text-3xl text-[#0D0D0D]">{investments.length}</p>
                    </div>
                    <div className="bg-white p-6 border border-stone-100 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Shares Owned</p>
                        <p className="font-serif text-3xl text-[#0D0D0D]">{totalShares}</p>
                    </div>
                    <div className="bg-white p-6 border border-stone-100 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Est. Monthly Yield</p>
                        {/* Mock calculation: Average 8% annual yield / 12 months */}
                        <p className="font-serif text-3xl text-emerald-600">KES {((totalInvested * 0.08) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div className="bg-emerald-50 p-6 border border-emerald-100 shadow-sm flex flex-col justify-center">
                        <p className="text-[10px] uppercase tracking-widest text-emerald-600 mb-2 font-bold">M-Pesa Payouts</p>
                        <p className="text-sm text-emerald-800 font-medium">Yields automatically disbursed on the 1st of every month.</p>
                    </div>
                </div>

                {/* Investment Portfolio Grid */}
                <h3 className="font-serif text-3xl text-[#0D0D0D] mb-8 border-b border-stone-200 pb-4">My Assets</h3>
                
                {investments.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-stone-200 border-dashed">
                        <p className="text-stone-500 mb-4">Your portfolio is currently empty.</p>
                        <Link href="/invest" className="bg-[#0D0D0D] text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {investments.map((inv, idx) => {
                            const contractAddress = inv.property_shares?.smart_contract_address;
                            const isDeployed = contractAddress && contractAddress.startsWith('0x');
                            const chainBalance = onChainBalances[contractAddress] || "0";
                            const isVerifiedOnChain = Number(chainBalance) > 0;

                            return (
                                <div key={idx} className="bg-white border border-stone-200 flex flex-col sm:flex-row group hover:shadow-lg transition-shadow">
                                    <div className="sm:w-2/5 aspect-square sm:aspect-auto bg-stone-100 relative overflow-hidden">
                                        <img 
                                            src={inv.properties?.property_images?.[0]?.image_url || '/placeholder.jpg'} 
                                            alt="Property" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-serif text-xl text-stone-900 line-clamp-1">{inv.properties?.title || 'Luxury Asset'}</h4>
                                                
                                                {/* Verification Badge */}
                                                {isVerifiedOnChain ? (
                                                    <span className="bg-emerald-100 text-emerald-700 text-[8px] uppercase tracking-widest px-2 py-1 font-bold rounded-sm flex items-center gap-1">
                                                        ✓ On-Chain
                                                    </span>
                                                ) : (
                                                    <span className="bg-amber-100 text-amber-700 text-[8px] uppercase tracking-widest px-2 py-1 font-bold rounded-sm">
                                                        Pending Mint
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-4">
                                                Target ROI: {inv.property_shares?.projected_roi || '8.5'}%
                                            </p>

                                            <div className="bg-stone-50 p-4 border border-stone-100 grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">Shares Owned</p>
                                                    <p className="font-bold text-lg">{inv.shares_owned}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">Invested Value</p>
                                                    <p className="font-bold text-lg">KES {inv.amount_invested.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {isDeployed ? (
                                            <a 
                                                href={`https://amoy.polygonscan.com/address/${contractAddress}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-[9px] uppercase tracking-widest text-[#0D0D0D] hover:text-emerald-600 font-bold flex items-center gap-1"
                                            >
                                                View Contract on Polygonscan ↗
                                            </a>
                                        ) : (
                                            <p className="text-[9px] uppercase tracking-widest text-stone-400">Contract deployment pending</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}