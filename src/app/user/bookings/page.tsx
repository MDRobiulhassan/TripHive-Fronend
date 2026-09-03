'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useUserBookingsQuery } from '@/hooks/useUserQueries';
import { BookingResponseDTO, BookingStatus } from '@/types/api';
import { Calendar, MapPin, CheckCircle, Clock, XCircle, Compass, Users } from 'lucide-react';

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  switch (status) {
    case 'CONFIRMED':
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" /> Confirmed
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5" /> Cancelled
        </span>
      );
    case 'RESERVED':
      return (
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Reserved
        </span>
      );
    case 'GUESTS_ADDED':
      return (
        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> Guests Added
        </span>
      );
    case 'PAYMENT_PENDING':
    default:
      return (
        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Payment Pending
        </span>
      );
  }
};

export default function MyBookingsPage() {
  const { data: bookings, isLoading, error } = useUserBookingsQuery();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#222222]">Trips &amp; Reservations</h1>
            <p className="text-sm text-[#6a6a6a] mt-1">Manage your active stays and upcoming trips</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-full border border-[#222222] text-sm font-semibold text-[#222222] hover:bg-[#f7f7f7] flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Stays</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff385c] mx-auto mb-2" />
            <p className="text-xs text-[#6a6a6a]">Loading your reservations...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 rounded-[14px] p-8 text-center shadow-airbnb text-red-600">
            <p className="text-sm font-semibold">Unable to load reservations from server.</p>
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="bg-white border border-[#dddddd] rounded-[14px] p-12 text-center shadow-airbnb">
            <Calendar className="w-12 h-12 text-[#ff385c] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#222222] mb-1">No trips booked... yet!</h3>
            <p className="text-sm text-[#6a6a6a] mb-6">Time to dust off your bags and start planning your next getaway.</p>
            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-[#ff385c] text-white text-sm font-semibold shadow-sm"
            >
              Start Searching
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-[#dddddd] rounded-[14px] p-6 sm:p-8 shadow-airbnb flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-airbnb-hover transition-all"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.bookingStatus} />
                    <span className="text-xs text-[#6a6a6a]">Reservation #{b.id}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#222222]">{b.hotel?.name || 'Luxury Hotel Reservation'}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#6a6a6a]">
                    {b.hotel?.city && (
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#ff385c]" />{b.hotel.city}</span>
                    )}
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-[#222222]" />{b.checkInDate} &rarr; {b.checkOutDate}</span>
                  </div>

                  {b.guests && b.guests.length > 0 && (
                    <div className="pt-1 text-xs text-[#222222] font-semibold">
                      <span>Guests ({b.guests.length}): </span>
                      <span className="font-normal text-[#6a6a6a]">{b.guests.map((g) => g.name).join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-auto md:text-right border-t md:border-t-0 border-[#ebebeb] pt-4 md:pt-0 flex md:flex-col justify-between items-center md:items-end gap-4">
                  <div>
                    <span className="text-2xl font-bold text-[#222222]">${b.amount}</span>
                    <span className="text-xs text-[#6a6a6a] block">Total amount</span>
                  </div>
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
