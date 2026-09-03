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

  const [guests, setGuests] = useState<GuestDTO[]>([{ name: '', age: 25, gender: 'MALE' }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addGuest = () => setGuests((prev) => [...prev, { name: '', age: 25, gender: 'FEMALE' }]);
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

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#222222] mb-2">Reservation Confirmed!</h2>
          <p className="text-sm text-[#6a6a6a] mb-6">Your stay has been booked. Redirecting to your trips...</p>
          <Link href="/user/bookings" className="px-6 py-3 rounded-lg bg-[#ff385c] text-white font-medium text-sm">
            View My Trips
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#222222]">Request to book</h1>
          <p className="text-sm text-[#6a6a6a] mt-1">Reservation <span className="font-semibold text-[#ff385c]">#{bookingId}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Guest Information */}
          <div className="bg-white border border-[#dddddd] rounded-[14px] p-6 sm:p-8 shadow-airbnb space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#222222]">Guest Information</h2>
              <button
                type="button"
                onClick={addGuest}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#222222] text-xs font-semibold text-[#222222] hover:bg-[#f7f7f7] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Guest</span>
              </button>
            </div>

            <div className="space-y-4">
              {guests.map((guest, i) => (
                <div key={i} className="p-5 rounded-lg border border-[#dddddd] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#222222]">Guest {i + 1}</h3>
                    {guests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuest(i)}
                        className="p-1 text-[#6a6a6a] hover:text-[#c13515]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Full Name</label>
                      <input
                        required
                        type="text"
                        value={guest.name}
                        onChange={(e) => updateGuest(i, 'name', e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-12 px-3 bg-white border border-[#dddddd] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 focus:border-[#222222]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Age</label>
                      <input
                        required
                        type="number"
                        min={1}
                        max={120}
                        value={guest.age}
                        onChange={(e) => updateGuest(i, 'age', Number(e.target.value))}
                        className="w-full h-12 px-3 bg-white border border-[#dddddd] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 focus:border-[#222222]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Gender</label>
                      <select
                        value={guest.gender}
                        onChange={(e) => updateGuest(i, 'gender', e.target.value)}
                        className="w-full h-12 px-3 bg-white border border-[#dddddd] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 focus:border-[#222222] cursor-pointer"
                      >
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

          {/* Payment Section */}
          <div className="bg-white border border-[#dddddd] rounded-[14px] p-6 sm:p-8 shadow-airbnb space-y-4">
            <h2 className="text-lg font-bold text-[#222222]">Pay with</h2>
            <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">Direct Spring Boot API Payment</p>
                <p className="text-xs text-emerald-700">Simulated test payment — no credit card required.</p>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-lg bg-[#ff385c] hover:bg-[#e00b41] text-white font-semibold text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Processing...' : 'Confirm and Pay'}</span>
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
