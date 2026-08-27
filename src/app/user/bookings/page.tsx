'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { BookingResponseDTO } from '@/types/api';
import { Calendar, MapPin, CheckCircle, Clock, XCircle, Compass } from 'lucide-react';

const MOCK: BookingResponseDTO[] = [
  { id: 4082, numberOfRooms: 1, createdAt: new Date().toISOString(), bookingStatus: 'CONFIRMED', checkInDate: '2026-09-10', checkOutDate: '2026-09-14', amount: 1120, guests: [{ id: 1, name: 'Alex Johnson', age: 28, gender: 'MALE' }], hotel: { id: 1, name: 'The Ritz Paris Luxury Suite', city: 'Paris', photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'], amenities: [], active: true, contactInfo: { address: '15 Place Vendôme' } } },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'CONFIRMED') return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" />Confirmed</span>;
  if (status === 'CANCELLED') return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold"><XCircle className="w-3.5 h-3.5" />Cancelled</span>;
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold"><Clock className="w-3.5 h-3.5" />Pending</span>;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get<BookingResponseDTO[]>('/user/myBookings');
      setBookings(res.data);
    } catch {
      setBookings(MOCK);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id: number) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.post('/bookings/' + id + '/cancel');
      fetchBookings();
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Trips</h1>
            <p className="text-xs text-gray-500 mt-1">Manage your active reservations and past stays</p>
          </div>
          <Link href="/" className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Explore Hotels</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-600 mx-auto" /></div>
        ) : bookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-xs">
            <Calendar className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No trips booked yet</h3>
            <Link href="/" className="mt-6 inline-block px-6 py-3 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md">Start Searching</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.bookingStatus} />
                    <span className="text-xs text-gray-400">Reservation #{b.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{b.hotel?.name || 'Luxury Hotel Reservation'}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-rose-500" />{b.hotel?.city || 'Destination'}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-400" />{b.checkInDate} → {b.checkOutDate}</span>
                    <span>·</span>
                    <span>{b.numberOfRooms} {b.numberOfRooms > 1 ? 'rooms' : 'room'}</span>
                  </div>
                  {b.guests?.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Guests:</p>
                      <p className="text-xs text-gray-800 font-medium">{b.guests.map((g) => g.name).join(', ')}</p>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-auto md:text-right border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 flex md:flex-col justify-between items-center md:items-end gap-4">
                  <div>
                    <span className="text-2xl font-black text-gray-900">{b.amount}</span>
                    <span className="text-xs text-gray-500 block">Total paid</span>
                  </div>
                  {b.bookingStatus !== 'CANCELLED' && (
                    <button onClick={() => cancel(b.id)} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-gray-600 transition-colors">
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
