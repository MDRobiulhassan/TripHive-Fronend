'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { User, Mail, Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/user/profile', { name });
      await refreshUserProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-xs text-gray-500 mb-8">Update your personal information</p>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-rose-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <div className="flex gap-1.5 mt-1">
                {user?.roles?.map((r) => (
                  <span key={r} className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100">{r}</span>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email (read-only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input type="email" disabled value={user?.email || ''} className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-xs font-medium text-gray-500 cursor-not-allowed" />
              </div>
            </div>

            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all disabled:opacity-50">
              {saved ? <><CheckCircle className="w-4 h-4" /><span>Saved!</span></> : <><Save className="w-4 h-4" /><span>{saving ? 'Saving...' : 'Save changes'}</span></>}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
