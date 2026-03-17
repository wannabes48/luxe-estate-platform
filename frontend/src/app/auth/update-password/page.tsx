"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Optional: Check if the user actually has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus('error');
        setMessage('Your recovery link has expired or is invalid. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match. Please verify your entry.');
      return;
    }

    if (password.length < 8) {
      setStatus('error');
      setMessage('For your security, passwords must be at least 8 characters long.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setStatus('success');
      setMessage('Your vault has been secured with the new credentials.');
      
      // Automatically redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);

    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to update credentials. Please try again.');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col lg:grid lg:grid-cols-2 min-h-[100dvh] lg:min-h-[calc(100vh-80px)]">
      
      {/* Left Side: The Form */}
      <section className="flex-1 flex flex-col justify-center px-6 py-20 md:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#E91E63] mb-4 block">
            Step 02 // Finalization
          </span>

          <h1 className="font-serif text-4xl mb-4 text-[#0D0D0D]">Secure Vault.</h1>
          <p className="text-stone-500 text-sm mb-10 leading-relaxed">
            Please enter your new master password. Ensure it is unique and known only to you.
          </p>

          {status === 'success' ? (
            <div className="bg-emerald-50 border border-emerald-100 p-6 text-center">
              <span className="text-emerald-600 text-3xl block mb-4">✓</span>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">Credentials Updated</p>
              <p className="text-emerald-700 text-sm">{message}</p>
              <p className="text-[10px] text-emerald-600/70 uppercase tracking-widest mt-6 animate-pulse">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              
              {status === 'error' && (
                <div className="bg-red-50 text-red-700 border border-red-200 p-4 text-xs font-bold uppercase tracking-widest">
                  {message}
                </div>
              )}

              <div>
                <label htmlFor="password" className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">
                  New Password
                </label>
                <input 
                  id="password"
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 transition-colors text-stone-900" 
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">
                  Confirm Password
                </label>
                <input 
                  id="confirmPassword"
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 transition-colors text-stone-900" 
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'error' && message.includes('expired')}
                className="w-full bg-[#0D0D0D] text-white py-5 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors font-bold disabled:opacity-50 mt-4 shadow-xl"
              >
                {status === 'loading' ? 'Encrypting...' : 'Lock in Credentials'}
              </button>

            </form>
          )}

        </div>
      </section>

      {/* Right Side: The Atmospheric Image */}
      <section className="hidden lg:flex relative items-center justify-center bg-stone-900 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        <div className="relative z-10 p-12 text-center max-w-sm backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-400 font-bold mb-4">Encryption</p>
          <p className="text-white font-serif text-2xl leading-relaxed italic">
            "Your digital keys to physical equity."
          </p>
        </div>
      </section>

    </div>
  );
}