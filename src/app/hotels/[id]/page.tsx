'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useHotelInfo } from '@/hooks/useHotelQueries';
import { api } from '@/lib/api';
import { RoomResponseDTO } from '@/types/api';
import {
  MapPin, Star, Shield, Sparkles, Wifi, Waves, Dumbbell,
  UtensilsCrossed, AirVent, Clock, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
const isValidPhoto = (url: string) => url && url.startsWith('http') && !url.includes('example.com');

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="w-5 h-5" />,
  'Swimming Pool': <Waves className="w-5 h-5" />,
  'Gym': <Dumbbell className="w-5 h-5" />,
  'Restaurant': <UtensilsCrossed className="w-5 h-5" />,
  'Air Conditioning': <AirVent className="w-5 h-5" />,
  '24/7 Room Service': <Clock className="w-5 h-5" />,
};

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = Number(params?.id);

  const { data, isLoading, isError } = useHotelInfo(hotelId);

  const hotel = data?.hotel;
  const rooms = data?.rooms ?? [];

  const [selectedRoom, setSelectedRoom] = useState<RoomResponseDTO | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomsCount, setRoomsCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const activeRoom = selectedRoom || rooms[0] || null;
  const pricePerNight = activeRoom?.basePrice ?? 0;

  const validPhotos = hotel?.photos?.filter(isValidPhoto) ?? [];
  const photos = validPhotos.length ? validPhotos : [FALLBACK];

  const handleReserve = async () => {
    if (!activeRoom || !checkIn || !checkOut) {
      alert('Please select a room type, check-in and check-out dates.');
      return;
    }
    setBookingLoading(true);
    try {
      const res = await api.post('/bookings', {
        hotelId,
        roomId: activeRoom.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomsCount,
      });
      router.push(`/bookings/${res.data.id}/checkout`);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Booking failed.';
      alert(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff385c]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center px-4">
          <h2 className="text-2xl font-bold text-[#222222]">Hotel not found</h2>
          <p className="text-sm text-[#6a6a6a]">The hotel you're looking for doesn't exist or is unavailable.</p>
          <Link href="/" className="px-6 py-3 rounded-lg bg-[#ff385c] text-white font-semibold text-sm">
            Browse Hotels
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-[#222222] hover:underline mb-6 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to results
        </button>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-[26px] font-bold text-[#222222] leading-snug">{hotel.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-[#6a6a6a]">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-[#222222] text-[#222222]" /><strong className="text-[#222222]">4.98</strong> (122 reviews)</span>
            <span>·</span>
            <span className="flex items-center gap-1 underline cursor-pointer"><MapPin className="w-4 h-4" />{hotel.city}</span>
            {hotel.contactInfo?.address && (
              <><span>·</span><span>{hotel.contactInfo.address}</span></>
            )}
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-[14px] overflow-hidden mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              onClick={() => setActivePhoto(i)}
              className={`cursor-pointer overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <img
                src={photos[i] || photos[0] || FALLBACK}
                alt={`${hotel.name} photo ${i + 1}`}
                className="w-full h-full object-cover hover:brightness-90 transition-all"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
              />
            </div>
          ))}
        </div>

        {/* Body: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-8">

            {/* Hotel summary */}
            <div className="border-b border-[#ebebeb] pb-8">
              <h2 className="text-xl font-bold text-[#222222] mb-1">Entire hotel in {hotel.city}</h2>
              {rooms.length > 0 && (
                <p className="text-[#6a6a6a] text-sm">{rooms.length} room type{rooms.length > 1 ? 's' : ''} available</p>
              )}
            </div>

            {/* Amenities */}
            {hotel.amenities?.length > 0 && (
              <div className="border-b border-[#ebebeb] pb-8">
                <h3 className="text-lg font-bold text-[#222222] mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-3">
                  {hotel.amenities.map((a: string) => (
                    <div key={a} className="flex items-center gap-3 text-sm text-[#222222]">
                      <span className="text-[#6a6a6a]">{AMENITY_ICONS[a] || <Sparkles className="w-5 h-5" />}</span>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact info */}
            {hotel.contactInfo && (
              <div className="border-b border-[#ebebeb] pb-8">
                <h3 className="text-lg font-bold text-[#222222] mb-4">Location & Contact</h3>
                <div className="space-y-2 text-sm text-[#6a6a6a]">
                  {hotel.contactInfo.address && <p><strong className="text-[#222222]">Address:</strong> {hotel.contactInfo.address}</p>}
                  {hotel.contactInfo.phoneNumber && <p><strong className="text-[#222222]">Phone:</strong> {hotel.contactInfo.phoneNumber}</p>}
                  {hotel.contactInfo.email && <p><strong className="text-[#222222]">Email:</strong> {hotel.contactInfo.email}</p>}
                </div>
              </div>
            )}

            {/* Trust */}
            <div className="border-b border-[#ebebeb] pb-8 space-y-5">
              {[
                { Icon: Sparkles, title: 'Experienced Host', desc: 'Rated 5 stars by recent guests for verified bookings.' },
                { Icon: Shield, title: 'AirCover Protection', desc: 'Every booking includes protection from Host cancellations and listing issues.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <Icon className="w-5 h-5 text-[#ff385c] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#222222]">{title}</h4>
                    <p className="text-sm text-[#6a6a6a]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Room selector */}
            {rooms.length > 0 && (
              <div className="border-b border-[#ebebeb] pb-8 space-y-4">
                <h3 className="text-lg font-bold text-[#222222]">Select Room Type</h3>
                <div className="space-y-3">
                  {rooms.map((room: RoomResponseDTO) => {
                    const isSelected = (selectedRoom?.id ?? rooms[0]?.id) === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-5 rounded-[14px] border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#ff385c] bg-white ring-2 ring-[#ff385c]/20 shadow-sm'
                            : 'border-[#dddddd] hover:border-[#222222] bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-base text-[#222222]">{room.type}</h4>
                            <p className="text-sm text-[#6a6a6a]">Up to {room.capacity} guests · {room.totalCount} rooms available</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-lg text-[#222222]">৳{room.basePrice.toLocaleString()}</span>
                            <span className="text-xs text-[#6a6a6a] block">/ night</span>
                          </div>
                        </div>
                        {room.amenities?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {room.amenities.map((a: string, i: number) => (
                              <span key={i} className="px-2.5 py-0.5 rounded-full bg-[#f7f7f7] border border-[#dddddd] text-[11px] font-semibold text-[#222222]">
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sticky reservation card */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-[14px] p-6 sm:p-8 border border-[#dddddd] shadow-airbnb space-y-6">
              <div className="flex justify-between items-baseline border-b border-[#ebebeb] pb-6">
                <div>
                  <span className="text-2xl font-bold text-[#222222]">৳{pricePerNight.toLocaleString()}</span>
                  <span className="text-sm text-[#6a6a6a] font-normal"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#222222]">
                  <Star className="w-4 h-4 fill-[#222222] text-[#222222]" />
                  <span>4.98 · 122 reviews</span>
                </div>
              </div>

              <div className="border border-[#dddddd] rounded-lg overflow-hidden divide-y divide-[#dddddd]">
                <div className="grid grid-cols-2 divide-x divide-[#dddddd]">
                  <div className="p-3 text-left">
                    <label className="block text-[10px] font-extrabold uppercase text-[#222222] tracking-wider mb-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-xs font-semibold text-[#222222] focus:outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                  <div className="p-3 text-left">
                    <label className="block text-[10px] font-extrabold uppercase text-[#222222] tracking-wider mb-1">Checkout</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs font-semibold text-[#222222] focus:outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
                <div className="p-3 text-left">
                  <label className="block text-[10px] font-extrabold uppercase text-[#222222] tracking-wider mb-1">Guests & Rooms</label>
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-[#222222] focus:outline-none bg-transparent cursor-pointer"
                  >
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleReserve}
                disabled={bookingLoading || !checkIn || !checkOut}
                className="w-full h-12 rounded-lg bg-[#ff385c] hover:bg-[#e00b41] text-white font-semibold text-base shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {bookingLoading ? 'Reserving...' : 'Reserve'}
              </button>
              <p className="text-center text-xs text-[#6a6a6a]">You won't be charged yet</p>

              {pricePerNight > 0 && (
                <div className="space-y-3 text-sm text-[#222222] font-normal pt-4 border-t border-[#ebebeb]">
                  <div className="flex justify-between">
                    <span>৳{pricePerNight.toLocaleString()} x 1 night</span>
                    <span>৳{pricePerNight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TripHive service fee</span>
                    <span>৳{Math.round(pricePerNight * 0.12).toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-[#ebebeb] flex justify-between font-bold text-base text-[#222222]">
                    <span>Total</span>
                    <span>৳{(pricePerNight + Math.round(pricePerNight * 0.12)).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
