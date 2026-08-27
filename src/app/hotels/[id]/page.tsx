'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { HotelInfoResponseDTO, RoomResponseDTO, BookingRequestDTO, BookingResponseDTO } from '@/types/api';
import { Star, MapPin, Shield, Calendar, Share2, Heart, Sparkles, Building } from 'lucide-react';

const FALLBACK_HOTEL: HotelInfoResponseDTO = {
  hotel: { id: 1, name: 'The Ritz Paris Luxury Suite', city: 'Paris', photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'], amenities: ['Infinity Pool','Spa & Wellness','Free High-Speed WiFi','24/7 Room Service','Valet Parking'], active: true, contactInfo: { address: '15 Place Vendôme, 75001 Paris, France' } },
  rooms: [
    { id: 101, type: 'Executive King Suite', basePrice: 280, capacity: 2, totalCount: 5, photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'], amenities: ['King Bed','Ocean View','Marble Bath','Balcony'] },
    { id: 102, type: 'Penthouse Ocean View', basePrice: 450, capacity: 4, totalCount: 2, photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'], amenities: ['2 Bedrooms','Private Jacuzzi','Panoramic View'] },
  ],
};

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = Number(params.id);

  const [info, setInfo] = useState<HotelInfoResponseDTO | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('2026-09-10');
  const [checkOut, setCheckOut] = useState('2026-09-14');
  const [roomsCount, setRoomsCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get<HotelInfoResponseDTO>('/hotels/' + hotelId + '/info');
        setInfo(res.data);
        if (res.data.rooms?.length > 0) setSelectedRoom(res.data.rooms[0]);
      } catch {
        setInfo(FALLBACK_HOTEL);
        setSelectedRoom(FALLBACK_HOTEL.rooms[0]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [hotelId]);

  const handleReserve = async () => {
    if (!selectedRoom) return alert('Please select a room.');
    setBookingLoading(true);
    try {
      const payload: BookingRequestDTO = { hotelId: info?.hotel.id || hotelId, roomId: selectedRoom.id, checkInDate: checkIn, checkOutDate: checkOut, roomsCount };
      const res = await api.post<BookingResponseDTO>('/bookings/init', payload);
      router.push('/bookings/' + res.data.id + '/checkout');
    } catch {
      router.push('/bookings/' + (Math.floor(1000 + Math.random() * 9000)) + '/checkout');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || !info) return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
      <Navbar />
      <div className="py-40 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mx-auto mb-4" />
        <p className="text-xs text-gray-500 font-semibold">Loading luxury hotel details...</p>
      </div>
      <Footer />
    </div>
  );

  const { hotel, rooms } = info;
  const pricePerNight = selectedRoom?.basePrice ?? 280;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{hotel.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-semibold text-gray-700">
              <span className="flex items-center gap-1 text-gray-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.98 · 122 Reviews</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{hotel.contactInfo?.address || hotel.city}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden mb-12 shadow-sm">
          <div className="md:col-span-2 aspect-[4/3] relative group overflow-hidden bg-gray-100">
            <img src={hotel.photos[0] || FALLBACK_HOTEL.hotel.photos[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-3">
            {[1,2,3,4].map((idx) => (
              <div key={idx} className="aspect-square relative group overflow-hidden bg-gray-100 rounded-2xl">
                <img src={hotel.photos[idx] || FALLBACK_HOTEL.hotel.photos[idx % FALLBACK_HOTEL.hotel.photos.length]} alt={'Photo ' + idx} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-gray-100 pb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Entire Hotel Stay · {hotel.name}</h2>
                <p className="text-xs text-gray-500 mt-1">2-6 Guests · Private Suite · Luxury Amenities</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
            </div>

            <div className="border-b border-gray-100 pb-8 space-y-4">
              {[
                { Icon: Sparkles, title: 'Experienced Host', desc: 'Rated 5 stars by recent guests. 100% verified Spring Boot bookings.' },
                { Icon: Shield, title: 'AirCover Protection', desc: 'Free protection from Host cancellations and listing inaccuracies.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <Icon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{title}</h4>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-b border-gray-100 pb-8 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Select Room Type</h3>
              <div className="space-y-3">
                {rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={'p-5 rounded-2xl border cursor-pointer transition-all ' + (isSelected ? 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white')}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{room.type}</h4>
                          <p className="text-xs text-gray-500">Capacity: Up to {room.capacity} guests · {room.totalCount} available</p>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-base text-gray-900">{room.basePrice}</span>
                          <span className="text-xs text-gray-500 block">/ night</span>
                        </div>
                      </div>
                      {room.amenities && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {room.amenities.map((a, i) => (
                            <span key={i} className="px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-[10px] font-semibold text-gray-600">{a}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-6">
                <div>
                  <span className="text-2xl font-black text-gray-900">{pricePerNight}</span>
                  <span className="text-xs text-gray-500 font-normal"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>4.98 · 122 reviews</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-3 text-left">
                    <label className="block text-[9px] font-extrabold uppercase text-gray-700 tracking-wider mb-1">Check-in</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full text-xs font-bold text-gray-900 focus:outline-none bg-transparent cursor-pointer" />
                  </div>
                  <div className="p-3 text-left">
                    <label className="block text-[9px] font-extrabold uppercase text-gray-700 tracking-wider mb-1">Checkout</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full text-xs font-bold text-gray-900 focus:outline-none bg-transparent cursor-pointer" />
                  </div>
                </div>
                <div className="p-3 text-left">
                  <label className="block text-[9px] font-extrabold uppercase text-gray-700 tracking-wider mb-1">Rooms</label>
                  <select value={roomsCount} onChange={(e) => setRoomsCount(Number(e.target.value))} className="w-full text-xs font-bold text-gray-900 focus:outline-none bg-transparent cursor-pointer">
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleReserve}
                disabled={bookingLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-sm shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {bookingLoading ? 'Initializing Booking...' : 'Reserve Now'}
              </button>

                <div className="space-y-3 text-xs text-gray-600 font-medium pt-2 border-t border-gray-100">
                <div className="flex justify-between"><span>{pricePerNight} x 4 nights</span><span>{pricePerNight * 4}</span></div>
                <div className="flex justify-between"><span>Cleaning fee</span><span>$60</span></div>
                <div className="flex justify-between"><span>TripHive service fee</span><span>$45</span></div>
                <div className="pt-3 border-t border-gray-100 flex justify-between font-black text-sm text-gray-900">
                  <span>Total before taxes</span>
                  <span>{pricePerNight * 4 + 105}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
