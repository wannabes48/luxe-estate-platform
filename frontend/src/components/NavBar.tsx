/* src/components/NavBar.tsx */
"use client"
import React from 'react'
import Link from 'next/link'

export default function NavBar() {
    const navItems = [
    { name: 'Properties', path: '/properties' },
    { name: 'Contact', path: '/contact' },
    { name: 'Agents', path: '/agents' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference md:mix-blend-normal">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between py-8 px-10">
        <Link href="/" className="text-3xl font-bold text-white tracking-tighter">LUXE PROPERTIES</Link>

        <nav className="hidden lg:flex gap-12 text-[10px] uppercase tracking-[0.4em] text-white/70">
          {navItems.map((item) => (
            <Link key={item.name} href={item.path} className="hover:text-white transition-colors duration-500">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-8">
          <Link href="/contact" className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-white border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-all duration-700">
            + Submit Query
          </Link>
        </div>
      </div>
    </header>
  )
}