'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSearchBar } from '@/components/search/HeroSearchBar';
import { HotelGrid } from '@/components/hotels/HotelGrid';
import { api } from '@/lib/api';
import { HotelResponseDTO, HotelPriceDTO, HotelSearchRequest } from '@/types/api';
import { ShieldCheck, Sparkles, Award } from 'lucide-react';

const MOCK: HotelResponseDTO[] = [
  { id: 1, name: 'The Ritz Paris Luxury Suite', city: 'Paris', photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'], amenities: ['Free WiFi','Infinity Pool'], active: true, contactInfo: { address: '15 Place Vendôme' } },
  { id: 2, name: 'Plaza Hotel Fifth Avenue', city: 'New York', photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'], amenities: ['Spa','Valet Parking'], active: true, contactInfo: { address: '768 5th Ave' } },
  { id: 3, name: 'Aman Tokyo Panoramic Suite', city: 'Tokyo', photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'], amenities: ['Onsen Spa','City View'], active: true, contactInfo: { address: 'The Otemachi Tower' } },
  { id: 4, name: 'The Claridge London', city: 'London', photos: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'], amenities: ['Michelin Restaurant','Concierge'], active: true, contactInfo: { address: 'Brook Street, Mayfair' } },
];

export default function HomePage() {
  const [hotels, setHotels] = useState<(HotelResponseDTO | HotelPriceDTO)[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');

  const fetchHotels = async (params?: HotelSearchRequest) => {
    setLoading(true);
    try {
      if (params && (params.city || params.checkInDate)) {
        const res = await api.post<HotelPriceDTO[]>('/hotels/search', params);
        setHotels(res.data);
      } else {
        const qp = selectedCity ? { city: selectedCity } : {};
        const res = await api.get<HotelResponseDTO[]>('/hotels/search', { params: qp });
        setHotels(res.data);
      }
    } catch {
      setHotels(MOCK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, [selectedCity]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <section className="bg-gradient-to-b from-rose-50/60 via-white to-gray-50 pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Booking Engine</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            Find your next stay,{' '}
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
              curated for luxury.
            </span>
          </h1>
          <p className="text-sm text-gray-600 font-medium max-w-2xl mx-auto">
            Book verified hotels and boutique villas with instant confirmation.
          </p>
        </div>
        <HeroSearchBar onSearch={fetchHotels} />
      </section>

      <main className="flex-1">
        <HotelGrid hotels={hotels} loading={loading} selectedCity={selectedCity} onSelectCity={setSelectedCity} />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-rose-900 to-gray-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: ShieldCheck, title: 'AirCover Protection', desc: 'Comprehensive booking protection on every stay.' },
              { Icon: Sparkles, title: 'Instant Confirmation', desc: 'Direct Spring Boot integration for guaranteed holds.' },
              { Icon: Award, title: 'Superhost Quality', desc: 'Verified properties with top cleanliness standards.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
