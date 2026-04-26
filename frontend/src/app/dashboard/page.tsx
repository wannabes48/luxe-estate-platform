"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ethers } from 'ethers';
import LuxuryToast from '@/components/ui/LuxuryToast';
import SellSharesModal from '@/components/SellSharesModal';
import KYCModal from '@/components/KYCModal';

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
    
    // UI State
    const [toast, setToast] = useState({ msg: '', type: 'success' as 'success' | 'error', show: false });
    const [sellModalData, setSellModalData] = useState<{ isOpen: boolean, propertyId: string, title: string, maxShares: number, price: number } | null>(null);

    // --- KYC GATE STATE ---
    const [showKycGate, setShowKycGate] = useState(false);
    const [kycLoading, setKycLoading] = useState(false);
    const [kycData, setKycData] = useState({
        fullName: '',
        nationalId: '',
        phoneNumber: '',
        role: 'investor'
    });

    // --- KYC MODAL STATE ---
    const [showKycPrompt, setShowKycPrompt] = useState(false);
    const [isKycMandatory, setIsKycMandatory] = useState(false);

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

            // 1. Fetch User Profile
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            setUser(profile || session.user);

            // 2. PROFILE CHECK: Only trigger the Hard Gate if data is literally missing
            const isMissingData = !profile?.national_id || !profile?.phone_number || !profile?.full_name;
            
            if (isMissingData) {
                // Pre-fill whatever data we *do* have
                setKycData({
                    fullName: profile?.full_name || session.user.user_metadata?.full_name || '',
                    nationalId: profile?.national_id || '',
                    phoneNumber: profile?.phone_number || session.user.phone || '',
                    role: profile?.role || 'investor'
                });
                setShowKycGate(true);
                setLoading(false);
                return; // Stop loading the rest of the dashboard until KYC is done
            }

            // Passive KYC Prompt Check
            if (profile && profile.kyc_verified === false) {
                const hasDismissed = sessionStorage.getItem('kyc_prompt_dismissed');
                if (!hasDismissed) {
                    setShowKycPrompt(true);
                }
            }

            // 3. Fetch user's investments
            const { data: userInvestments, error: invError } = await supabase
                .from('investments')
                .select(`
                    id,
                    property_id,
                    shares_owned,
                    total_invested,
                    properties (
                        title,
                        property_images(image_url),
                        property_shares (
                            smart_contract_address,
                            price_per_share,
                            projected_roi
                        )
                    )
                `)
                .eq('user_id', session.user.id);

            // Print the specific error to the console
            if (invError) console.error("INVESTMENT FETCH ERROR:", invError.message, invError.details);

            setInvestments(userInvestments || []);
            setLoading(false);

            // 4. Auto-check Web3 Wallet
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

    // --- KYC SUBMISSION LOGIC ---
    const handleKycSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setKycLoading(true);

        try {
            const { error } = await supabase
                .from('user_profiles') // Ensure this matches your table name (users or user_profiles)
                .upsert({
                    id: user.id || user.sub, // Handle both cases where user object might come from session or profile fetch
                    full_name: kycData.fullName,
                    national_id: kycData.nationalId,
                    phone_number: kycData.phoneNumber,
                    role: kycData.role,
                    kyc_verified: false // Remains false until admin manually reviews or SmileID API clears it
                });

            if (error) throw error;

            showToast("Profile updated successfully. Welcome to Luxe.", "success");
            setShowKycGate(false);
            
            // Reload the page to fetch investments now that they are cleared
            window.location.reload(); 
        } catch (error: any) {
            console.error("KYC Submit Error:", error);
            showToast(error.message || "Failed to save profile details.", "error");
            alert("Error saving profile: " + (error.message || "Unknown error"));
        } finally {
            setKycLoading(false);
        }
    };

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
            const accounts = await eth.request({ method: 'eth_requestAccounts' });
            const address = accounts[0];
            
            try {
                await eth.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x13882' }],
                });
            } catch (switchError: any) {
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
            await fetchOnChainBalances(address, investments);

        } catch (error: any) {
            showToast(error.message || "Failed to connect wallet", "error");
        } finally {
            setIsConnecting(false);
        }
    };

    const fetchOnChainBalances = async (address: string, invs: any[]) => {
        if (!address || invs.length === 0) return;
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const newBalances: Record<string, string> = {};

        for (const inv of invs) {
            const shareData = inv.properties?.property_shares?.[0] || {};
            const contractAddress = shareData?.smart_contract_address;
            const isDeployed = contractAddress && contractAddress.startsWith('0x');
            const chainBalance = onChainBalances[contractAddress] || "0";
            const isVerifiedOnChain = Number(chainBalance) > 0;
            if (contractAddress && contractAddress.startsWith('0x')) {
                try {
                    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
                    const balance = await contract.balanceOf(address);
                    const decimals = await contract.decimals();
                    newBalances[contractAddress] = ethers.formatUnits(balance, decimals);
                } catch (err) {
                    newBalances[contractAddress] = "0";
                }
            }
        }
        setOnChainBalances(newBalances);
    };

    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount_invested || 0), 0);
    const totalShares = investments.reduce((sum, inv) => sum + Number(inv.shares_owned || 0), 0);

    if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-serif text-2xl">Loading Portfolio...</div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <LuxuryToast message={toast.msg} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />

            {/* --- THE HARD KYC GATE --- */}
            {showKycGate && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-white max-w-md w-full p-8 shadow-2xl rounded-sm animate-in zoom-in-95 duration-300">
                        <div className="mb-6">
                            <h2 className="text-3xl font-serif text-stone-900">Complete Profile</h2>
                            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                                Because you signed in using a quick method, we need a few more details to comply with anti-money laundering regulations and enable M-Pesa payouts.
                            </p>
                        </div>

                        <form onSubmit={handleKycSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-1 font-bold">Full Legal Name</label>
                                <input 
                                    required 
                                    type="text" 
                                    className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500"
                                    value={kycData.fullName}
                                    onChange={(e) => setKycData({...kycData, fullName: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-1 font-bold">National ID / Passport</label>
                                <input 
                                    required 
                                    type="text" 
                                    className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500"
                                    value={kycData.nationalId}
                                    onChange={(e) => setKycData({...kycData, nationalId: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-1 font-bold">M-Pesa Phone Number</label>
                                <input 
                                    required 
                                    type="tel" 
                                    placeholder="2547..."
                                    className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500 font-mono"
                                    value={kycData.phoneNumber}
                                    onChange={(e) => setKycData({...kycData, phoneNumber: e.target.value})}
                                />
                            </div>

                            <button 
                                disabled={kycLoading}
                                type="submit" 
                                className="w-full bg-[#0D0D0D] text-white py-4 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors mt-6 font-bold disabled:opacity-50"
                            >
                                {kycLoading ? 'Saving...' : 'Secure My Account'}
                            </button>
                            
                            <button 
                                type="button" 
                                onClick={handleLogout}
                                className="w-full text-center mt-4 text-[10px] uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors"
                            >
                                Log out
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="bg-[#0D0D0D] text-white py-6 px-6 lg:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/"><h1 className="font-serif text-2xl tracking-wide">Luxe Estate.</h1></Link>
                <div className="flex items-center gap-6">
                    <Link href="/invest" className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-white transition-colors">Marketplace</Link>
                    <div className="w-px h-4 bg-stone-700"></div>
                    <span className="text-[10px] uppercase tracking-widest hidden md:block">Welcome, {user?.full_name || user?.email?.split('@')[0]}</span>
                    <Link href="/dashboard/settings" className="bg-white text-black px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-colors font-bold">
                        Settings
                    </Link>
                    <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold hover:text-white transition-colors">Logout</button>
                </div>
            </nav>

            {/* --- NEW: Soft KYC Warning Banner --- */}
            {user?.kyc_verified === false && !showKycGate && (
                <div className="bg-amber-100 border-b border-amber-200 text-amber-800 px-6 py-3 text-[10px] uppercase tracking-widest font-bold flex justify-center items-center gap-2">
                    <span className="text-sm">⚠️</span>
                    Account restricted: Your ID is currently under review. M-Pesa transactions are disabled until verified.
                </div>
            )}

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
                            const shareData = inv.properties?.property_shares?.[0] || {};
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
                                                Target ROI: {shareData?.projected_roi || '8.5'}%
                                            </p>

                                            <div className="bg-stone-50 p-4 border border-stone-100 grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">Shares Owned</p>
                                                    <p className="font-bold text-lg">{inv.shares_owned}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">Invested Value</p>
                                                    <p className="font-bold text-lg">KES {inv.total_invested.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-stone-100">
                                            {isDeployed ? (
                                                <a 
                                                    href={`https://amoy.polygonscan.com/address/${contractAddress}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-[9px] uppercase tracking-widest text-[#0D0D0D] hover:text-emerald-600 font-bold flex items-center gap-1"
                                                >
                                                    Polygonscan ↗
                                                </a>
                                            ) : (
                                                <p className="text-[9px] uppercase tracking-widest text-stone-400">Contract pending</p>
                                            )}

                                            <button 
                                                onClick={() => {
                                                    if (user?.kyc_verified === false) {
                                                        setIsKycMandatory(true);
                                                        setShowKycPrompt(true);
                                                    } else {
                                                        setSellModalData({
                                                            isOpen: true,
                                                            propertyId: inv.property_id,
                                                            title: inv.properties?.title || 'Property',
                                                            maxShares: inv.shares_owned,
                                                            price: shareData?.price_per_share || 0
                                                        });
                                                    }
                                                }}
                                                className="text-[10px] bg-[#0D0D0D] text-white px-4 py-2 uppercase tracking-widest hover:bg-emerald-600 transition-colors font-bold rounded-sm"
                                            >
                                                Sell Shares
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {sellModalData && (
                <SellSharesModal
                    isOpen={sellModalData.isOpen}
                    onClose={() => setSellModalData(null)}
                    propertyId={sellModalData.propertyId}
                    propertyTitle={sellModalData.title}
                    maxShares={sellModalData.maxShares}
                    originalPrice={sellModalData.price}
                    userId={user?.id}
                    onSuccess={() => {
                        showToast("Shares successfully listed on the secondary market!", "success");
                        // Refresh logic could go here
                    }}
                />
            )}

            {/* The KYC Modal */}
            <KYCModal 
                isOpen={showKycPrompt} 
                onClose={() => {
                    sessionStorage.setItem('kyc_prompt_dismissed', 'true');
                    setShowKycPrompt(false);
                    setIsKycMandatory(false); // reset
                }} 
                isMandatory={isKycMandatory} 
            />
        </div>
    );
}