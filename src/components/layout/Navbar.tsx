'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Compass, Search, Globe, Menu, User as UserIcon, LogOut, Shield, Heart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
            TripHive
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-full py-2.5 px-4 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white">
          <button className="text-xs font-bold text-gray-800 px-3 hover:text-rose-600">Anywhere</button>
          <span className="h-4 w-px bg-gray-200" />
          <button className="text-xs font-bold text-gray-800 px-3 hover:text-rose-600">Any week</button>
          <span className="h-4 w-px bg-gray-200" />
          <button className="text-xs text-gray-500 px-3 flex items-center gap-2">
            <span>Add guests</span>
            <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 text-xs font-bold text-gray-700">
            <Shield className="w-3.5 h-3.5 text-rose-600" />
            <span>Host</span>
          </Link>

          <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-600">
            <Globe className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 border border-gray-200 hover:shadow-md rounded-full py-1.5 px-3 transition-all bg-white"
            >
              <Menu className="w-4 h-4 text-gray-600" />
              <div className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link href="/user/bookings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-600">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>My Trips</span>
                    </Link>
                    <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-600">
                      <UserIcon className="w-4 h-4" />
                      <span>Account Settings</span>
                    </Link>
                    <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-600">
                      <Shield className="w-4 h-4 text-rose-600" />
                      <span>Manage Properties</span>
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={() => { logout(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 text-left">
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-xs font-bold text-gray-900 hover:bg-rose-50">Log in</Link>
                    <Link href="/auth/signup" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-rose-50">Sign up</Link>
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
