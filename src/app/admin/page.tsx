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

const TABS = [
  { id: 'hotels', label: 'Properties & Activation', Icon: Building2 },
  { id: 'reports', label: 'Revenue & Reports', Icon: TrendingUp },
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

  useEffect(() => { fetchHotels(); }, []);

  const toggleActivate = async (id: number) => {
    try { await api.patch('/admin/hotels/' + id + '/activate'); } catch {}
    fetchHotels();
  };

  const createHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/hotels', { name: newName, city: newCity, photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'], amenities: ['WiFi'], contactInfo: { address: newAddress } });
      setShowModal(false); setNewName(''); setNewCity(''); setNewAddress('');
      fetchHotels();
    } catch { alert('Failed to add property.'); }
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Host &amp; Admin Dashboard</h1>
            <p className="text-xs text-gray-500 mt-1">Manage listings, rooms, pricing and revenue reports</p>
          </div>
          <button onClick={() => setShowModal(true)} className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add New Property</span>
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-gray-200 mb-8">
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={'flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition-all ' + (active ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-900')}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'hotels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(loading ? [] : hotels).map((h) => (
              <div key={h.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                  <img src={h.photos[0]} alt={h.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-gray-900 truncate">{h.name}</h3>
                    <span className={'px-2.5 py-0.5 rounded-full text-[10px] font-bold ' + (h.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600')}>
                      {h.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{h.city} · {h.contactInfo?.address}</p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <button onClick={() => toggleActivate(h.id)} className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold text-gray-700 transition-colors">
                    {h.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => { setSelectedId(h.id); setActiveTab('reports'); }} className="text-xs font-bold text-rose-600 hover:underline">
                    View Analytics →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">Revenue Analytics Report</h3>
              <select value={selectedId || ''} onChange={(e) => setSelectedId(Number(e.target.value))} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 bg-white cursor-pointer focus:outline-none">
                {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { Icon: DollarSign, label: 'Total Earnings', value: '$' + (report?.totalRevenue ?? 39760), color: 'rose' },
                { Icon: Calendar, label: 'Completed Bookings', value: String(report?.totalBookings ?? 142), color: 'emerald' },
                { Icon: TrendingUp, label: 'Avg Revenue / Night', value: '$' + (report?.averageRevenue ?? 280), color: 'blue' },
              ].map(({ Icon, label, value, color }) => (
                <div key={label} className={'p-6 rounded-2xl border space-y-2 bg-' + color + '-50/50 border-' + color + '-100'}>
                  <div className={'w-10 h-10 rounded-xl bg-' + color + '-600 text-white flex items-center justify-center'}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-2xl font-black text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-gray-900">Add New Property</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={createHotel} className="space-y-4">
              {[
                { label: 'Hotel / Property Name', value: newName, setter: setNewName, placeholder: 'Grand Venetian Resort' },
                { label: 'City', value: newCity, setter: setNewCity, placeholder: 'Paris' },
                { label: 'Full Address', value: newAddress, setter: setNewAddress, placeholder: '15 Place Vendome' },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
                  <input type="text" required value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500" />
                </div>
              ))}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200">Create Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
