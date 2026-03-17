"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // This is where Supabase sends them after they click the email link
        redirectTo: `${window.location.origin}/auth/update-password`, 
      });

      if (error) throw error;

      setStatus('success');
      setMessage('A recovery link has been sent to your email address.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col lg:grid lg:grid-cols-2 min-h-[100dvh] lg:min-h-[calc(100vh-80px)]">
      
      {/* Left Side: The Recovery Form */}
      <section className="flex-1 flex flex-col justify-center px-6 py-20 md:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          
          <Link href="/" className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-12 block hover:text-[#E91E63] transition-colors">
            ← Return to Luxe Estate
          </Link>

          <h1 className="font-serif text-4xl mb-4 text-[#0D0D0D]">Account Recovery.</h1>
          <p className="text-stone-500 text-sm mb-10 leading-relaxed">
            Enter the email address associated with your portfolio. We will send you a secure link to reset your password.
          </p>

          {status === 'success' ? (
            <div className="bg-emerald-50 border border-emerald-100 p-6 text-center">
              <span className="text-emerald-600 text-3xl block mb-4">✓</span>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">Protocol Initiated</p>
              <p className="text-emerald-700 text-sm">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              
              {status === 'error' && (
                <div className="bg-red-50 text-red-700 border border-red-200 p-4 text-xs font-bold uppercase tracking-widest">
                  {message}
                </div>
              )}

              <div>
                <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">
                  Email Address
                </label>
                <input 
                  id="email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 transition-colors text-stone-900" 
                  placeholder="investor@example.com"
                />
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-[#0D0D0D] text-white py-5 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors font-bold disabled:opacity-50 mt-4 shadow-xl"
              >
                {status === 'loading' ? 'Authenticating...' : 'Send Recovery Link'}
              </button>

              <div className="text-center pt-6 border-t border-stone-100 mt-8">
                <Link href="/auth/login" className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-[#0D0D0D] transition-colors">
                  Remember your password? Sign In
                </Link>
              </div>
            </form>
          )}

        </div>
      </section>

      {/* Right Side: The Atmospheric Image (Hidden on mobile) */}
      <section className="hidden lg:flex relative items-center justify-center bg-stone-900 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2070')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        <div className="relative z-10 p-12 text-center max-w-sm backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-400 font-bold mb-4">Security Protocol</p>
          <p className="text-white font-serif text-2xl leading-relaxed italic">
            "Protecting your digital equity."
          </p>
        </div>
      </section>

    </div>
  );
}