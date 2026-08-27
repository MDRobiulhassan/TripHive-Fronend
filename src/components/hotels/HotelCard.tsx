import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Heart } from 'lucide-react';
import { HotelResponseDTO, HotelPriceDTO } from '@/types/api';

interface Props { hotel: HotelResponseDTO | HotelPriceDTO; }

export const HotelCard: React.FC<Props> = ({ hotel }) => {
  const isPrice = 'hotel' in hotel;
  const id = isPrice ? hotel.hotel.id : hotel.id;
  const name = isPrice ? hotel.hotel.name : hotel.name;
  const city = isPrice ? hotel.hotel.city : hotel.city;
  const photos = isPrice ? hotel.hotel.photos : hotel.photos;
  const price = isPrice ? hotel.price : 220;
  const photo = photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <Link href={'/hotels/' + id} className="group block">
      <div className="space-y-3">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300">
          <img src={photo} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-rose-600 transition-colors">
            <Heart className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-gray-900 shadow-sm flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-600" />
            <span>{city}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 group-hover:text-rose-600 transition-colors truncate max-w-[200px]">{name}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.95</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 truncate">Beachfront Luxury · Free Cancellation</p>
          <div className="pt-1 flex items-baseline gap-1">
            <span className="font-black text-base text-gray-900">{price}</span>
            <span className="text-xs text-gray-500 font-normal"> / night</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
