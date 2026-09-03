'use client';

import React, { useState, useRef } from 'react';
import { Search, MapPin, Users, Calendar } from 'lucide-react';
import { HotelSearchRequest } from '@/types/api';

interface Props {
  onSearch: (p: HotelSearchRequest) => void;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}
function getTomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}
function fmtDate(iso: string) {
  if (!iso) return 'Add date';
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[parseInt(m) - 1] + ' ' + parseInt(d) + ', ' + y;
}

export const HeroSearchBar: React.FC<Props> = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [checkInDate, setCheckInDate] = useState(getTodayStr());
  const [checkOutDate, setCheckOutDate] = useState(getTomorrowStr());
  const [roomsCount, setRoomsCount] = useState(1);

  const cityRef = useRef<HTMLInputElement>(null);
  // Hidden date pickers — zero-size, hidden, never visible in layout
  const checkInPickerRef = useRef<HTMLInputElement>(null);
  const checkOutPickerRef = useRef<HTMLInputElement>(null);

  const openCheckIn = () => {
    const el = checkInPickerRef.current;
    if (!el) return;
    try { el.showPicker(); } catch { el.focus(); }
  };

  const openCheckOut = () => {
    const el = checkOutPickerRef.current;
    if (!el) return;
    try { el.showPicker(); } catch { el.focus(); }
  };

  const handleSearch = () => {
    onSearch({
      city: city.trim() || undefined,
      checkInDate,
      checkOutDate,
      numberOfRooms: roomsCount,
      page: 0,
      size: 12,
    });
  };

  return (
    <div className="bg-white border border-[#dddddd] rounded-full shadow-airbnb hover:shadow-airbnb-hover transition-all max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch min-h-[66px] w-full overflow-visible relative">

      {/* Hidden date pickers — positioned off-screen, never capture pointer events */}
      <input
        ref={checkInPickerRef}
        type="date"
        value={checkInDate}
        onChange={(e) => setCheckInDate(e.target.value)}
        tabIndex={-1}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none', top: 0, left: 0 }}
        aria-hidden="true"
      />
      <input
        ref={checkOutPickerRef}
        type="date"
        value={checkOutDate}
        onChange={(e) => setCheckOutDate(e.target.value)}
        tabIndex={-1}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none', top: 0, left: 0 }}
        aria-hidden="true"
      />

      {/* Segment 1: Where */}
      <div
        className="flex-1 px-6 py-3 sm:border-r border-[#dddddd] flex flex-col justify-center hover:bg-[#f7f7f7] rounded-l-full transition-colors cursor-text"
        onClick={() => cityRef.current?.focus()}
      >
        <span className="text-[11px] font-extrabold text-[#222222] tracking-tight mb-0.5 uppercase select-none">Where</span>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#ff385c] shrink-0" />
          <input
            ref={cityRef}
            type="text"
            placeholder="Search destinations..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent text-sm text-[#222222] focus:outline-none placeholder-[#6a6a6a]"
          />
        </div>
      </div>

      {/* Segment 2: Check in — purely visual, no date input in DOM */}
      <div
        className="flex-1 px-6 py-3 sm:border-r border-[#dddddd] flex flex-col justify-center hover:bg-[#f7f7f7] transition-colors cursor-pointer select-none"
        onClick={openCheckIn}
      >
        <span className="text-[11px] font-extrabold text-[#222222] tracking-tight mb-0.5 uppercase">Check in</span>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#ff385c] shrink-0" />
          <span className="text-sm text-[#222222]">{fmtDate(checkInDate)}</span>
        </div>
      </div>

      {/* Segment 3: Check out — purely visual, no date input in DOM */}
      <div
        className="flex-1 px-6 py-3 sm:border-r border-[#dddddd] flex flex-col justify-center hover:bg-[#f7f7f7] transition-colors cursor-pointer select-none"
        onClick={openCheckOut}
      >
        <span className="text-[11px] font-extrabold text-[#222222] tracking-tight mb-0.5 uppercase">Check out</span>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#ff385c] shrink-0" />
          <span className="text-sm text-[#222222]">{fmtDate(checkOutDate)}</span>
        </div>
      </div>

      {/* Segment 4: Who */}
      <div className="w-full sm:w-44 px-6 py-3 flex flex-col justify-center hover:bg-[#f7f7f7] transition-colors">
        <span className="text-[11px] font-extrabold text-[#222222] tracking-tight mb-0.5 uppercase select-none">Who</span>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-[#ff385c] shrink-0" />
          <select
            value={roomsCount}
            onChange={(e) => setRoomsCount(Number(e.target.value))}
            className="w-full bg-transparent text-sm text-[#222222] focus:outline-none cursor-pointer appearance-none"
          >
            <option value={1}>1 Room</option>
            <option value={2}>2 Rooms</option>
            <option value={3}>3 Rooms</option>
          </select>
        </div>
      </div>

      {/* Search Orb */}
      <div className="p-2 shrink-0 flex items-center justify-end pr-2">
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search hotels"
          className="w-12 h-12 rounded-full bg-[#ff385c] hover:bg-[#e00b41] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
        >
          <Search className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
