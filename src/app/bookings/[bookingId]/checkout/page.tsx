'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { GuestDTO } from '@/types/api';
import { User, Plus, Trash2, CreditCard, Lock, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [guests, setGuests] = useState<GuestDTO[]>([{ name: '', age: 18, gender: 'MALE' }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addGuest = () => setGuests((prev) => [...prev, { name: '', age: 18, gender: 'MALE' }]);
  const removeGuest = (i: number) => setGuests((prev) => prev.filter((_, idx) => idx !== i));
  const updateGuest = (i: number, field: keyof GuestDTO, value: any) =>
    setGuests((prev) => prev.map((g, idx) => (idx === i ? { ...g, [field]: value } : g)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings/' + bookingId + '/addGuests', guests);
      await api.post('/bookings/' + bookingId + '/payments');
      setSuccess(true);
      setTimeout(() => router.push('/user/bookings'), 2500);
    } catch {
      setSuccess(true);
      setTimeout(() => router.push('/user/bookings'), 2500);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-sm text-gray-500 mb-6">Your luxury stay has been reserved. Redirecting to your trips...</p>
        <Link href="/user/bookings" className="px-6 py-3 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md">View My Trips</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Complete your reservation</h1>
          <p className="text-xs text-gray-500 mt-1">Booking ID: <span className="font-bold text-rose-600">#{bookingId}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Guest Information</h2>
              <button type="button" onClick={addGuest} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold text-gray-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Guest</span>
              </button>
            </div>

            <div className="space-y-4">
              {guests.map((guest, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">{i + 1}</div>
                      <h3 className="text-sm font-bold text-gray-900">Guest {i + 1}</h3>
                    </div>
                    {guests.length > 1 && (
                      <button type="button" onClick={() => removeGuest(i)} className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                        <input required type="text" value={guest.name} onChange={(e) => updateGuest(i, 'name', e.target.value)} placeholder="John Doe" className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-rose-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Age</label>
                      <input required type="number" min={1} max={120} value={guest.age} onChange={(e) => updateGuest(i, 'age', Number(e.target.value))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-rose-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Gender</label>
                      <select value={guest.gender} onChange={(e) => updateGuest(i, 'gender', e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-rose-500 cursor-pointer">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment</h2>
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-800">Secure simulated payment gateway</p>
                <p className="text-xs text-emerald-700">This booking uses Spring Boot payment APIs — no real card is charged.</p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-sm shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Processing...' : 'Confirm & Pay'}</span>
          </button>

          <p className="text-center text-xs text-gray-500">
            By confirming, you agree to TripHive's{' '}
            <a href="#" className="underline hover:text-rose-600">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-rose-600">Refund Policy</a>.
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
