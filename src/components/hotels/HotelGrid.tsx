'use client';
import React from 'react';
import { HotelCard } from './HotelCard';
import { HotelResponseDTO, HotelPriceDTO } from '@/types/api';
import { Building2, Mountain, Waves, Compass, Palmtree, Utensils } from 'lucide-react';

const CATS = [
  { id: '', label: 'All Stays', icon: Compass },
  { id: 'Paris', label: 'Paris', icon: Building2 },
  { id: 'New York', label: 'New York', icon: Building2 },
  { id: 'Tokyo', label: 'Tokyo', icon: Palmtree },
  { id: 'London', label: 'London', icon: Mountain },
  { id: 'Miami', label: 'Miami', icon: Waves },
  { id: 'Rome', label: 'Rome', icon: Utensils },
];

interface Props {
  hotels: (HotelResponseDTO | HotelPriceDTO)[];
  loading: boolean;
  selectedCity?: string;
  onSelectCity: (city: string) => void;
}

export const HotelGrid: React.FC<Props> = ({ hotels, loading, selectedCity = '', onSelectCity }) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
    <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-8 border-b border-gray-200">
      {CATS.map((cat) => {
        const Icon = cat.icon;
        const active = selectedCity === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCity(cat.id)}
            className={
              'flex items-center gap-2 py-2.5 px-5 rounded-full text-xs font-bold transition-all shrink-0 ' +
              (active ? 'bg-rose-600 text-white shadow-md shadow-rose-200 scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200')
            }
          >
            <Icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>

    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[1,2,3,4,5,6,7,8].map((i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="aspect-[4/3] rounded-3xl bg-gray-200" />
            <div className="h-4 bg-gray-200 rounded-md w-3/4" />
            <div className="h-3 bg-gray-200 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    ) : hotels.length === 0 ? (
      <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl p-8">
        <Compass className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">No properties found</h3>
        <p className="text-xs text-gray-500 mt-1">Try adjusting your search filters.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {hotels.map((hotel, idx) => (
          <HotelCard key={('id' in hotel ? hotel.id : hotel.hotel.id) + '-' + idx} hotel={hotel} />
        ))}
      </div>
    )}
  </section>
);
