"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Search, ShieldCheck, ShieldAlert, MoreVertical } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  national_id: string;
  kyc_verified: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Note: Ensure your Supabase RLS policies allow admins to read all profiles
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const toggleKycStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ kyc_verified: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      // Update local state to reflect change instantly
      setUsers(users.map(user => 
        user.id === userId ? { ...user, kyc_verified: !currentStatus } : user
      ));
    } catch (error: any) {
      alert("Failed to update KYC status: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.national_id?.includes(searchQuery)
  );

  const pendingKycCount = users.filter(u => !u.kyc_verified).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      
      {/* Admin Top Navigation */}
      <nav className="bg-[#0D0D0D] text-white py-4 px-6 lg:px-12 flex justify-between items-center sticky top-0 z-50">
        <Link href="/"><h1 className="font-serif text-xl tracking-wide">Luxe Admin.</h1></Link>
        <div className="flex items-center gap-6">
          <Link href="/admin/properties" className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-white transition-colors">Assets</Link>
          <span className="text-[10px] uppercase tracking-widest text-[#E91E63] font-bold">Investors</span>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto p-6 lg:p-12">
        
        {/* Header & Stats */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-stone-200 pb-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#E91E63] font-bold mb-2 block">Directory</span>
            <h2 className="text-4xl font-serif text-stone-900">Investor Management</h2>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Total Investors</p>
              <p className="text-2xl font-serif text-stone-900">{users.length}</p>
            </div>
            <div className="w-px h-10 bg-stone-200"></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Pending KYC</p>
              <p className="text-2xl font-serif text-amber-600">{pendingKycCount}</p>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 text-sm outline-none focus:border-[#E91E63] transition-colors shadow-sm"
            />
          </div>
          <button className="hidden md:block bg-stone-900 text-white px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-[#E91E63] transition-colors font-bold">
            Export CSV
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-stone-200">
                <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold">Investor Details</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold">Financial Contacts</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold">National ID</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold">KYC Status</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 text-sm font-serif italic">Loading directory...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 text-sm font-serif italic">No investors found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-stone-900 text-sm">{user.full_name || 'N/A'}</p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-sm text-stone-700">{user.phone_number || 'Pending'}</p>
                      <p className="text-[9px] uppercase tracking-widest text-stone-400">M-Pesa Linked</p>
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-sm text-stone-700">{user.national_id || 'Pending'}</p>
                    </td>
                    <td className="p-4">
                      {user.kyc_verified ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold border border-emerald-100">
                          <ShieldCheck size={12} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold border border-amber-100">
                          <ShieldAlert size={12} /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        disabled={actionLoading === user.id}
                        onClick={() => toggleKycStatus(user.id, user.kyc_verified)}
                        className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border transition-colors ${
                          user.kyc_verified 
                            ? 'border-red-200 text-red-600 hover:bg-red-50' 
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {actionLoading === user.id ? 'Processing...' : user.kyc_verified ? 'Revoke KYC' : 'Approve KYC'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}