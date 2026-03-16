"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface UserData {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    phone_number?: string;
}

export default function AdminUsersDashboard() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        // Fetch users from our public schema
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setUsers(data);
        if (error) console.error("Error fetching users:", error);
        setIsLoading(false);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const confirmChange = confirm(`Are you sure you want to make this user an ${newRole}?`);
        if (!confirmChange) return;

        const { error } = await supabase
            .from('users')
            .update({ role: newRole })
            .eq('id', userId);

        if (!error) {
            // Update local state without refreshing the page
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            alert("Role updated successfully!");
        } else {
            alert("Failed to update role.");
        }
    };

    // Filter users based on search input
    const filteredUsers = users.filter(user => 
        (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-serif text-stone-900">User Management</h1>
                    <p className="text-stone-500 mt-2 text-sm">View and manage investors, property owners, and admins.</p>
                </div>

                {/* Search Bar */}
                <div className="w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="w-full bg-white border border-stone-200 p-3 text-sm outline-none focus:border-emerald-500 transition-colors rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500">
                                <th className="p-5 font-semibold">User</th>
                                <th className="p-5 font-semibold">Joined Date</th>
                                <th className="p-5 font-semibold">Role</th>
                                <th className="p-5 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-stone-400">Loading network participants...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-stone-400">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                        <td className="p-5">
                                            <p className="font-serif text-stone-900 text-lg">{user.full_name || 'Unknown User'}</p>
                                            <p className="text-xs text-stone-500 font-mono mt-1">{user.email}</p>
                                            {user.phone_number && (
                                                <p className="text-xs text-stone-400 mt-1">📞 {user.phone_number}</p>
                                            )}
                                        </td>
                                        <td className="p-5 text-sm text-stone-600">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-5">
                                            <span className={`text-[10px] uppercase tracking-widest px-2 py-1 font-bold rounded-sm ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                                                'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <select 
                                                className="bg-transparent border border-stone-200 text-xs p-2 rounded outline-none cursor-pointer hover:border-emerald-500"
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1} // Prevent removing last admin
                                            >
                                                <option value="investor">Make Investor</option>
                                                <option value="owner">Make Owner</option>
                                                <option value="admin">Make Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}