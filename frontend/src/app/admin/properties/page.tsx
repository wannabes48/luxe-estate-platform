"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { ethers } from 'ethers';

// 1. The ABI for the Factory Contract we will deploy
const FACTORY_ABI = [
    "function deployProperty(string name, string symbol, uint256 totalShares, uint256 pricePerShare, string propertyId) external returns (address)",
    "event PropertyDeployed(string propertyId, address contractAddress, uint256 totalShares)"
];

interface PropertyData {
    property_id: string;
    title: string;
    locations: { city: string; }[];
    status: string;
    property_shares: {
        total_shares: number;
        price_per_share: number;
        smart_contract_address: string;
    }[];
}

export default function AdminPropertiesDashboard() {
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // UI States for Deployment and Editing
    const [mintingId, setMintingId] = useState<string | null>(null);
    const [editingContractId, setEditingContractId] = useState<string | null>(null);
    const [tempContractAddress, setTempContractAddress] = useState('');

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('properties')
            .select(`
                property_id, 
                title, 
                locations(city), 
                status, 
                property_shares (total_shares, price_per_share, smart_contract_address)
            `)
            .order('created_at', { ascending: false });

        if (data) setProperties(data);
        if (error) alert(`Database Error: ${error.message}`); 
        setIsLoading(false);
    };

    const handleStatusChange = async (propertyId: string, newStatus: string) => {
        const { error } = await supabase
            .from('properties')
            .update({ status: newStatus })
            .eq('property_id', propertyId);

        if (!error) {
            setProperties(properties.map(p => p.property_id === propertyId ? { ...p, status: newStatus } : p));
        } else {
            alert("Failed to update status.");
        }
    };

    // --- AUTOMATED WEB3 DEPLOYMENT ENGINE ---
    const handleAutomatedDeployment = async (prop: PropertyData) => {
        const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
        if (!factoryAddress) return alert("Missing NEXT_PUBLIC_FACTORY_ADDRESS in .env.local");

        if (typeof window === 'undefined' || !(window as any).ethereum) {
            return alert("Please install MetaMask to deploy contracts.");
        }

        const shareData = prop.property_shares?.[0];
        if (!shareData) return alert("Setup share pricing before minting.");

        setMintingId(prop.property_id);

        try {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();
            const factoryContract = new ethers.Contract(factoryAddress, FACTORY_ABI, signer);

            // Generate a sleek ticker symbol
            const symbol = `LUXE-${prop.title.replace(/\s+/g, '').substring(0, 4).toUpperCase()}`;

            // 1. Execute the transaction
            const tx = await factoryContract.deployProperty(
                prop.title,
                symbol,
                shareData.total_shares,
                shareData.price_per_share,
                prop.property_id
            );

            // 2. Wait for confirmation
            const receipt = await tx.wait();

            // 3. Extract the new contract address from the event logs
            let newContractAddress = null;
            for (const log of receipt.logs) {
                try {
                    const parsedLog = factoryContract.interface.parseLog(log);
                    if (parsedLog && parsedLog.name === 'PropertyDeployed') {
                        newContractAddress = parsedLog.args.contractAddress;
                        break;
                    }
                } catch (e) { /* Ignore unparseable logs */ }
            }

            if (!newContractAddress) throw new Error("Deployment succeeded but failed to capture the address from logs.");

            // 4. Save the generated address to Supabase automatically
            const { error } = await supabase
                .from('property_shares')
                .update({ smart_contract_address: newContractAddress })
                .eq('property_id', prop.property_id);

            if (error) throw error;

            // 5. Update local UI
            setProperties(properties.map(p => {
                if (p.property_id === prop.property_id && p.property_shares.length > 0) {
                    return {
                        ...p,
                        property_shares: [{ ...p.property_shares[0], smart_contract_address: newContractAddress }]
                    };
                }
                return p;
            }));

            alert(`Success! Token deployed at: ${newContractAddress}`);

        } catch (error: any) {
            console.error("Deployment failed:", error);
            alert(`Failed: ${error.message || "Transaction rejected"}`);
        } finally {
            setMintingId(null);
        }
    };

    // Manual Override (Just in case)
    const handleSaveContract = async (propertyId: string) => {
        if (!tempContractAddress.startsWith('0x')) return alert("Valid Polygon addresses must start with '0x'");

        const { error } = await supabase
            .from('property_shares')
            .update({ smart_contract_address: tempContractAddress })
            .eq('property_id', propertyId);

        if (!error) {
            setProperties(properties.map(p => {
                if (p.property_id === propertyId && p.property_shares.length > 0) {
                    return { ...p, property_shares: [{ ...p.property_shares[0], smart_contract_address: tempContractAddress }] };
                }
                return p;
            }));
            setEditingContractId(null);
            setTempContractAddress('');
        } else {
            alert("Failed to link smart contract.");
        }
    };

    const filteredProperties = properties.filter(prop => 
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.locations?.[0]?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-serif text-stone-900">Asset Management</h1>
                    <p className="text-stone-500 mt-2 text-sm">Automated Web3 Deployment Engine.</p>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <input 
                        type="text" 
                        placeholder="Search properties..." 
                        className="w-full md:w-64 bg-white border border-stone-200 p-3 text-sm outline-none focus:border-emerald-500 transition-colors rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link href="/agent/dashboard/create" className="bg-[#0D0D0D] text-white px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors whitespace-nowrap flex items-center">
                        + Add Asset
                    </Link>
                </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500">
                                <th className="p-5 font-semibold">Asset Details</th>
                                <th className="p-5 font-semibold">Financials</th>
                                <th className="p-5 font-semibold">Web3 Contract (Polygon)</th>
                                <th className="p-5 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-stone-400">Loading portfolio assets...</td></tr>
                            ) : filteredProperties.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-stone-400">No properties found.</td></tr>
                            ) : (
                                filteredProperties.map((prop) => {
                                    const shareData = prop.property_shares?.[0];
                                    const totalValue = shareData ? (shareData.total_shares * shareData.price_per_share) : 0;
                                    const isDeployed = shareData?.smart_contract_address?.startsWith('0x');
                                    const isMinting = mintingId === prop.property_id;

                                    return (
                                        <tr key={prop.property_id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                            <td className="p-5">
                                                <p className="font-serif text-stone-900 text-lg">{prop.title}</p>
                                                <p className="text-xs text-stone-500 mt-1">📍 {prop.locations?.[0]?.city}</p>
                                                <p className="text-[10px] text-stone-400 font-mono mt-1">ID: {prop.property_id.split('-')[0]}...</p>
                                            </td>
                                            
                                            <td className="p-5">
                                                {shareData ? (
                                                    <>
                                                        <p className="font-medium text-stone-900">KES {totalValue.toLocaleString()}</p>
                                                        <p className="text-xs text-stone-500 mt-1">{shareData.total_shares.toLocaleString()} Shares</p>
                                                        <p className="text-[10px] uppercase tracking-widest text-emerald-600 mt-1">@ KES {shareData.price_per_share} / ea</p>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-stone-400 italic">Not fractionalized</span>
                                                )}
                                            </td>

                                            <td className="p-5">
                                                {editingContractId === prop.property_id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder="0x..." 
                                                            className="border border-emerald-500 p-2 text-xs font-mono outline-none w-full"
                                                            value={tempContractAddress}
                                                            onChange={(e) => setTempContractAddress(e.target.value)}
                                                        />
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleSaveContract(prop.property_id)} className="text-[10px] bg-emerald-500 text-white px-3 py-1 uppercase tracking-widest">Save</button>
                                                            <button onClick={() => setEditingContractId(null)} className="text-[10px] bg-stone-200 text-stone-700 px-3 py-1 uppercase tracking-widest">Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : isDeployed ? (
                                                    <div>
                                                        <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-widest px-2 py-1 font-bold rounded-sm inline-block mb-2">
                                                            ✓ Live on Amoy
                                                        </span>
                                                        <p className="font-mono text-xs text-stone-600 truncate w-48" title={shareData.smart_contract_address}>
                                                            {shareData.smart_contract_address.substring(0, 10)}...{shareData.smart_contract_address.substring(38)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <button 
                                                            onClick={() => handleAutomatedDeployment(prop)}
                                                            disabled={isMinting || !shareData}
                                                            className="block w-full text-center text-[10px] bg-[#0D0D0D] text-white px-3 py-3 uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-lg"
                                                        >
                                                            {isMinting ? 'Minting... Check Wallet' : 'Mint on Polygon'}
                                                        </button>
                                                        <button 
                                                            onClick={() => { setTempContractAddress(''); setEditingContractId(prop.property_id); }}
                                                            className="w-full mt-2 text-[9px] text-stone-400 hover:text-stone-900 uppercase tracking-widest"
                                                        >
                                                            Or link manually
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-5">
                                                <select 
                                                    className="bg-transparent border border-stone-200 text-xs p-2 rounded outline-none cursor-pointer hover:border-emerald-500"
                                                    value={prop.status}
                                                    onChange={(e) => handleStatusChange(prop.property_id, e.target.value)}
                                                >
                                                    <option value="pending">Pending Review</option>
                                                    <option value="active">Active Listing</option>
                                                    <option value="sold_out">Sold Out</option>
                                                    <option value="hidden">Hidden</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}