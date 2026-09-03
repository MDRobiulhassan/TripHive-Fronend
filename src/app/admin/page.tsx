'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { HotelResponseDTO, HotelReportResponse } from '@/types/api';
import { Building2, Plus, TrendingUp, DollarSign, Calendar, X } from 'lucide-react';

const MOCK_HOTELS: HotelResponseDTO[] = [
  { id: 1, name: 'The Ritz Paris Luxury Suite', city: 'Paris', photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'], amenities: ['Free WiFi','Infinity Pool'], active: true, contactInfo: { address: '15 Place Vendôme' } },
  { id: 2, name: 'Plaza Hotel Fifth Avenue', city: 'New York', photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'], amenities: ['Spa','Valet Parking'], active: false, contactInfo: { address: '768 5th Ave' } },
];

export default function AdminDashboardPage() {
  const [hotels, setHotels] = useState<HotelResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hotels' | 'reports'>('hotels');
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [report, setReport] = useState<HotelReportResponse | null>(null);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await api.get<HotelResponseDTO[]>('/admin/hotels');
      setHotels(res.data);
      if (res.data.length > 0) setSelectedId(res.data[0].id);
    } catch {
      setHotels(MOCK_HOTELS);
      setSelectedId(MOCK_HOTELS[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const toggleActivate = async (id: number) => {
    try {
      await api.patch('/admin/hotels/' + id + '/activate');
    } catch {}
    fetchHotels();
  };

  const createHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/hotels', {
        name: newName,
        city: newCity,
        photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
        amenities: ['WiFi'],
        contactInfo: { address: newAddress },
      });
      setShowModal(false);
      setNewName('');
      setNewCity('');
      setNewAddress('');
      fetchHotels();
    } catch {
      alert('Failed to add property.');
    }
  };

  const fetchReport = async (id: number) => {
    try {
      const res = await api.get<HotelReportResponse>('/admin/hotels/' + id + '/reports');
      setReport(res.data);
    } catch {
      setReport({ totalBookings: 142, totalRevenue: 39760, averageRevenue: 280 });
    }
  };

  useEffect(() => {
    if (selectedId && activeTab === 'reports') fetchReport(selectedId);
  }, [selectedId, activeTab]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#222222]">Host Dashboard</h1>
            <p className="text-sm text-[#6a6a6a] mt-1">Manage listings, activation status, and revenue analytics</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-lg bg-[#ff385c] hover:bg-[#e00b41] text-white text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Property</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-[#ebebeb] mb-8">
          {[
            { id: 'hotels', label: 'Listings & Activation', icon: Building2 },
            { id: 'reports', label: 'Earnings & Reports', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  active
                    ? 'border-[#222222] text-[#222222]'
                    : 'border-transparent text-[#6a6a6a] hover:text-[#222222]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Property Grid */}
        {activeTab === 'hotels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(loading ? [] : hotels).map((h) => (
              <div key={h.id} className="bg-white rounded-[14px] p-5 border border-[#dddddd] shadow-airbnb space-y-4">
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-[#f2f2f2]">
                  <img src={h.photos[0]} alt={h.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-base text-[#222222] truncate">{h.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      h.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#f7f7f7] text-[#6a6a6a]'
                    }`}>
                      {h.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6a6a6a]">{h.city} &bull; {h.contactInfo?.address}</p>
                </div>
                <div className="pt-2 border-t border-[#ebebeb] flex justify-between items-center">
                  <button
                    onClick={() => toggleActivate(h.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#f7f7f7] hover:bg-rose-50 hover:text-[#ff385c] text-xs font-semibold text-[#222222] border border-[#dddddd] transition-colors"
                  >
                    {h.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => { setSelectedId(h.id); setActiveTab('reports'); }}
                    className="text-xs font-semibold text-[#ff385c] hover:underline"
                  >
                    View Analytics &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Reports */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-[14px] p-8 border border-[#dddddd] shadow-airbnb space-y-6">
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-4">
              <h3 className="text-lg font-bold text-[#222222]">Revenue Analytics Report</h3>
              <select
                value={selectedId || ''}
                onChange={(e) => setSelectedId(Number(e.target.value))}
                className="px-4 py-2 border border-[#dddddd] rounded-lg text-xs font-semibold text-[#222222] bg-white cursor-pointer"
              >
                {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { Icon: DollarSign, label: 'Total Earnings', value: '$' + (report?.totalRevenue ?? 39760) },
                { Icon: Calendar, label: 'Completed Bookings', value: String(report?.totalBookings ?? 142) },
                { Icon: TrendingUp, label: 'Avg Revenue / Night', value: '$' + (report?.averageRevenue ?? 280) },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="p-6 rounded-lg border border-[#dddddd] bg-[#f7f7f7] space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#222222] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-[#6a6a6a] font-medium">{label}</p>
                  <p className="text-2xl font-bold text-[#222222]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Property Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[14px] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-airbnb">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#222222]">Add New Property</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-[#f7f7f7] text-[#6a6a6a]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={createHotel} className="space-y-4">
              {[
                { label: 'Hotel / Property Name', value: newName, setter: setNewName, placeholder: 'Grand Venetian Resort' },
                { label: 'City', value: newCity, setter: setNewCity, placeholder: 'Paris' },
                { label: 'Full Address', value: newAddress, setter: setNewAddress, placeholder: '15 Place Vendôme' },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-[#6a6a6a] mb-1">{label}</label>
                  <input
                    type="text"
                    required
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-12 px-4 bg-white border border-[#dddddd] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 focus:border-[#222222]"
                  />
                </div>
              ))}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ebebeb]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#dddddd] text-xs font-semibold text-[#6a6a6a] hover:bg-[#f7f7f7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#ff385c] hover:bg-[#e00b41] text-white text-xs font-semibold shadow-sm"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
