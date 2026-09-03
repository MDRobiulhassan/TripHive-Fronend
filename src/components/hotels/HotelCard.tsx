'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { HotelPriceDTO } from '@/types/api';

// Fallback photo if no valid URL is available
const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

const isValidPhoto = (url: string) =>
  url && url.startsWith('http') && !url.includes('example.com');

interface Props {
  hotel: HotelPriceDTO;
}

export const HotelCard: React.FC<Props> = ({ hotel: { hotel, price } }) => {
  const [liked, setLiked] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  const validPhotos = hotel.photos?.filter(isValidPhoto);
  const photos = validPhotos?.length ? validPhotos : [FALLBACK];
  const photo = photos[photoIdx];

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    setPhotoIdx((i) => (i === 0 ? photos.length - 1 : i - 1));
  };
  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    setPhotoIdx((i) => (i === photos.length - 1 ? 0 : i + 1));
  };

  return (
    <Link href={`/hotels/${hotel.id}`} className="group block" id={`hotel-card-${hotel.id}`}>
      {/* Photo */}
      <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-[#f2f2f2]">
        <img
          src={photo}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
        />

        {/* Wishlist heart */}
        <button
          id={`wishlist-${hotel.id}`}
          onClick={(e) => { e.preventDefault(); setLiked((v) => !v); }}
          className="absolute top-3 right-3 z-10 text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`w-6 h-6 stroke-2 drop-shadow-md ${liked ? 'fill-[#ff385c] text-[#ff385c]' : 'fill-black/20'}`}
          />
        </button>

        {/* Photo carousel controls */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <ChevronLeft className="w-4 h-4 text-[#222222]" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <ChevronRight className="w-4 h-4 text-[#222222]" />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {photos.map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === photoIdx ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-0.5">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-[15px] text-[#222222] truncate leading-tight">{hotel.name}</p>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
            <span className="text-sm font-semibold text-[#222222]">4.9</span>
          </div>
        </div>
        <p className="text-sm font-normal text-[#6a6a6a] truncate">{hotel.city}</p>
        <p className="text-sm font-normal text-[#6a6a6a]">Available</p>
        <div className="pt-0.5 flex items-baseline gap-1">
          <span className="font-semibold text-[16px] text-[#222222]">৳{price.toLocaleString()}</span>
          <span className="text-sm font-normal text-[#6a6a6a]">night</span>
        </div>
      </div>
    </Link>
  );
};
