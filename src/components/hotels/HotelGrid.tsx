'use client';

import React from 'react';
import { HotelCard } from './HotelCard';
import { HotelPriceDTO } from '@/types/api';
import { Compass, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface Props {
  hotels: HotelPriceDTO[];
  loading: boolean;
  isError?: boolean;
  hasSearched?: boolean;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  currentPage?: number;
}

export const HotelGrid: React.FC<Props> = ({
  hotels,
  loading,
  isError,
  hasSearched = false,
  onPageChange,
  totalPages = 1,
  currentPage = 0,
}) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
    {/* Results count */}
    {!loading && !isError && (
      <p className="text-sm text-[#6a6a6a] mb-6">
        {hotels.length > 0
          ? `Showing ${hotels.length} propert${hotels.length === 1 ? 'y' : 'ies'}`
          : ''}
      </p>
    )}

    {/* Skeleton Grid */}
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="aspect-[4/3] rounded-[14px] bg-[#f2f2f2]" />
            <div className="h-4 bg-[#f2f2f2] rounded-md w-3/4" />
            <div className="h-3 bg-[#f2f2f2] rounded-md w-1/2" />
          </div>
        ))}
      </div>
    ) : isError ? (
      <div className="text-center py-20 bg-white border border-red-100 rounded-[14px] p-8">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#222222]">Unable to load hotels</h3>
        <p className="text-sm text-[#6a6a6a] mt-1">Make sure Spring Boot is running on port 8080.</p>
      </div>
    ) : hotels.length === 0 ? (
      <div className="text-center py-20 bg-white border border-[#dddddd] rounded-[14px] p-8">
        <Compass className="w-12 h-12 text-[#ff385c] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#222222]">No properties found</h3>
        <p className="text-sm text-[#6a6a6a] mt-1">Try a different city or date range.</p>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {hotels.map((item, idx) => (
            <HotelCard key={item.hotel.id + '-' + idx} hotel={item} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="w-10 h-10 rounded-full border border-[#dddddd] flex items-center justify-center text-[#222222] hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-[#222222]">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="w-10 h-10 rounded-full border border-[#dddddd] flex items-center justify-center text-[#222222] hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </>
    )}
  </section>
);
