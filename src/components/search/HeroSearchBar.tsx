'use client';
import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users } from 'lucide-react';
import { HotelSearchRequest } from '@/types/api';

interface Props { onSearch: (p: HotelSearchRequest) => void; }

export const HeroSearchBar: React.FC<Props> = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [roomsCount, setRoomsCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ city: city || undefined, checkInDate: checkInDate || undefined, checkOutDate: checkOutDate || undefined, roomsCount, page: 0, size: 10 });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-full p-2 shadow-2xl max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
      <div className="sm:col-span-4 px-6 py-2 sm:border-r border-gray-100">
        <label className="block text-[10px] font-extrabold uppercase text-gray-800 tracking-wider mb-0.5">Where</label>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none placeholder-gray-400"
          />
        </div>
      </div>

      <div className="sm:col-span-3 px-4 py-2 sm:border-r border-gray-100">
        <label className="block text-[10px] font-extrabold uppercase text-gray-800 tracking-wider mb-0.5">Check in</label>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
          <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none cursor-pointer" />
        </div>
      </div>

      <div className="sm:col-span-3 px-4 py-2">
        <label className="block text-[10px] font-extrabold uppercase text-gray-800 tracking-wider mb-0.5">Rooms</label>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-rose-500 shrink-0" />
          <select value={roomsCount} onChange={(e) => setRoomsCount(Number(e.target.value))} className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none cursor-pointer">
            <option value={1}>1 Room</option>
            <option value={2}>2 Rooms</option>
            <option value={3}>3 Rooms</option>
          </select>
        </div>
      </div>

      <div className="sm:col-span-2 p-1 flex justify-end">
        <button type="submit" className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-xs shadow-lg shadow-rose-200 hover:scale-105 transition-all flex items-center justify-center gap-2">
          <Search className="w-4 h-4 stroke-[3]" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
};
