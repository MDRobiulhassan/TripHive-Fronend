'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Globe, Menu, User as UserIcon, LogOut, Heart, Building2, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'homes' | 'hotels'>('homes');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#dddddd] h-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#dddddd] shadow-xs flex items-center justify-center bg-white group-hover:scale-105 transition-transform">
            <img src="/assests/logo.jpg" alt="TripHive Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#ff385c]">
            TripHive
          </span>
        </Link>

        {/* Center Tabs: Homes & Browse Hotels */}
        <nav className="flex items-center gap-8 h-full">
          {/* Homes Tab */}
          <Link
            href="/"
            onClick={() => setActiveTab('homes')}
            className={`relative flex items-center gap-2.5 h-full px-2 text-base font-semibold transition-colors ${
              activeTab === 'homes' ? 'text-[#222222]' : 'text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
            {activeTab === 'homes' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#222222] rounded-full" />
            )}
          </Link>

          {/* Browse Hotels Tab */}
          <Link
            href="/"
            onClick={() => setActiveTab('hotels')}
            className={`relative flex items-center gap-2.5 h-full px-2 text-base font-semibold transition-colors ${
              activeTab === 'hotels' ? 'text-[#222222]' : 'text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>Browse Hotels</span>
            {activeTab === 'hotels' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#222222] rounded-full" />
            )}
          </Link>
        </nav>

        {/* Right Utilities (Language globe & User account menu) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            aria-label="Language and currency picker"
            className="p-3 rounded-full hover:bg-[#f7f7f7] text-[#222222] transition-colors cursor-pointer"
          >
            <Globe className="w-4.5 h-4.5" />
          </button>

          {/* Account Menu Pill */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 border border-[#dddddd] hover:shadow-md rounded-full py-1.5 px-3.5 transition-all bg-white cursor-pointer"
            >
              <Menu className="w-4 h-4 text-[#222222]" />
              <div className="w-7 h-7 rounded-full bg-[#222222] text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
            </button>

            {/* Dropdown Surface */}
            {open && (
              <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-airbnb border border-[#ebebeb] py-2 z-50 animate-in fade-in zoom-in-95">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-3 border-b border-[#ebebeb]">
                      <p className="text-sm font-semibold text-[#222222] truncate">{user?.name}</p>
                      <p className="text-xs text-[#6a6a6a] truncate">{user?.email}</p>
                    </div>

                    <Link
                      href="/user/bookings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#222222] hover:bg-[#f7f7f7] transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#ff385c]" />
                      <span>My Trips &amp; Wishlists</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#222222] hover:bg-[#f7f7f7] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#222222]" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="border-t border-[#ebebeb] mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#c13515] hover:bg-red-50 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-sm font-semibold text-[#222222] hover:bg-[#f7f7f7] transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-sm font-normal text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
