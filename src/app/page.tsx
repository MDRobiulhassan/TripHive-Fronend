'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSearchBar } from '@/components/search/HeroSearchBar';
import { HotelGrid } from '@/components/hotels/HotelGrid';
import { useHotelSearchMutation } from '@/hooks/useHotelQueries';
import { HotelSearchRequest, HotelPriceDTO, HotelResponseDTO } from '@/types/api';
import { ShieldCheck, Sparkles, Award } from 'lucide-react';

// ── Static featured hotels shown before any search ────────────────────────────
const MOCK_HOTELS: HotelPriceDTO[] = [
  {
    hotel: {
      id: 1001, name: 'The Ritz Paris Luxury Suite', city: 'Paris', active: true,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
      amenities: ['Free WiFi', 'Infinity Pool', 'Spa', 'Concierge'],
      contactInfo: { address: '15 Place Vendôme, Paris, France' },
    },
    price: 850,
  },
  {
    hotel: {
      id: 1002, name: 'Plaza Hotel Fifth Avenue', city: 'New York', active: true,
      photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
      amenities: ['Spa', 'Valet Parking', 'Restaurant'],
      contactInfo: { address: '768 5th Ave, New York, NY' },
    },
    price: 620,
  },
  {
    hotel: {
      id: 1003, name: 'Aman Tokyo Panoramic Suite', city: 'Tokyo', active: true,
      photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
      amenities: ['Onsen Spa', 'City View', 'Free WiFi'],
      contactInfo: { address: 'The Otemachi Tower, Tokyo' },
    },
    price: 980,
  },
  {
    hotel: {
      id: 1004, name: 'The Claridge London', city: 'London', active: true,
      photos: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
      amenities: ['Michelin Restaurant', 'Concierge', 'Free WiFi'],
      contactInfo: { address: 'Brook Street, Mayfair, London' },
    },
    price: 740,
  },
  {
    hotel: {
      id: 1005, name: 'Burj Al Arab Royal Suite', city: 'Dubai', active: true,
      photos: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'],
      amenities: ['Private Butler', 'Infinity Pool', 'Helipad'],
      contactInfo: { address: 'Jumeirah Beach Road, Dubai' },
    },
    price: 2400,
  },
  {
    hotel: {
      id: 1006, name: 'Four Seasons Bali at Sayan', city: 'Bali', active: true,
      photos: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'],
      amenities: ['Infinity Pool', 'Spa', 'River Views'],
      contactInfo: { address: 'Sayan, Ubud, Bali, Indonesia' },
    },
    price: 430,
  },
  {
    hotel: {
      id: 1007, name: 'The Peninsula Hong Kong', city: 'Hong Kong', active: true,
      photos: ['https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=800&q=80'],
      amenities: ['Harbour View', 'Spa', 'Fine Dining'],
      contactInfo: { address: 'Salisbury Road, Tsim Sha Tsui' },
    },
    price: 560,
  },
  {
    hotel: {
      id: 1008, name: 'Belmond Hotel Cipriani', city: 'Venice', active: true,
      photos: ['https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=800&q=80'],
      amenities: ['Private Dock', 'Pool', 'Michelin Restaurant'],
      contactInfo: { address: 'Giudecca 10, Venice, Italy' },
    },
    price: 1100,
  },
];

export default function HomePage() {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<HotelPriceDTO[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const searchMutation = useHotelSearchMutation();

  const handleSearch = async (params: HotelSearchRequest) => {
    setHasSearched(true);
    setSearchLoading(true);
    setSearchError(false);

    const result = await searchMutation.mutateAsync(params).catch(() => null);

    if (!result) {
      setSearchError(true);
      setSearchResults([]);
    } else {
      setSearchResults(result.content ?? []);
    }
    setSearchLoading(false);
  };

  const displayHotels = hasSearched ? searchResults : MOCK_HOTELS;
  const displayLoading = hasSearched ? searchLoading : false;
  const displayError = hasSearched ? searchError : false;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#ebebeb]">
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-8">
          <h1 className="text-[28px] font-bold text-[#222222] tracking-tight leading-snug">
            Inspiration for future getaways
          </h1>
          <p className="text-base font-normal text-[#6a6a6a]">
            Book verified hotels, suites, and boutique retreats around the globe.
          </p>
        </div>
        <HeroSearchBar onSearch={handleSearch} />
      </section>

      {/* Main Marketplace Grid */}
      <main className="flex-1">
        {/* Section label */}
        {!hasSearched && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-widest">Featured Destinations</p>
          </div>
        )}

        <HotelGrid
          hotels={displayHotels}
          loading={displayLoading}
          isError={displayError}
          hasSearched={hasSearched}
        />

        {/* Trust Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-[#222222] rounded-[14px] p-8 sm:p-12 text-white shadow-airbnb grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: ShieldCheck, title: 'AirCover Protection', desc: 'Comprehensive booking protection included with every stay.' },
              { Icon: Sparkles, title: 'Instant Confirmation', desc: 'Direct Spring Boot integration for guaranteed holds.' },
              { Icon: Award, title: 'Superhost Quality', desc: 'Verified properties meeting high standards for service.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="text-xs text-[#dddddd] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
