import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="bg-white border-t border-[#dddddd] mt-20 font-sans">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#dddddd] flex items-center justify-center bg-white">
              <img src="/assests/logo.jpg" alt="TripHive Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-extrabold text-[#ff385c]">TripHive</span>
          </Link>
          <p className="text-sm text-[#6a6a6a] leading-relaxed">
            Curated luxury suites, boutique hotels and unique stay retreats worldwide.
          </p>
        </div>

        <div>
          <h4 className="text-base font-semibold text-[#222222] mb-4">Support</h4>
          <ul className="space-y-3 text-sm text-[#222222] font-normal">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">AirCover Guarantee</a></li>
            <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
            <li><a href="#" className="hover:underline">Disability support</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base font-semibold text-[#222222] mb-4">Hosting</h4>
          <ul className="space-y-3 text-sm text-[#222222] font-normal">
            <li><Link href="/admin" className="hover:underline">TripHive your home</Link></li>
            <li><Link href="/admin" className="hover:underline">AirCover for Hosts</Link></li>
            <li><Link href="/admin" className="hover:underline">Hosting resources</Link></li>
            <li><Link href="/admin" className="hover:underline">Community forum</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base font-semibold text-[#222222] mb-4">TripHive</h4>
          <ul className="space-y-3 text-sm text-[#222222] font-normal">
            <li><a href="#" className="hover:underline">Newsroom</a></li>
            <li><a href="#" className="hover:underline">New features</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Investors</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-[#ebebeb] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6a6a6a]">
        <p>&copy; {new Date().getFullYear()} TripHive, Inc. &bull; Privacy &bull; Terms &bull; Sitemap &bull; Company Details</p>

        <div className="flex items-center gap-6 font-semibold text-[#222222]">
          <button className="flex items-center gap-1.5 hover:underline cursor-pointer">
            <Globe className="w-4 h-4 text-[#222222]" />
            <span>English (US)</span>
          </button>

          <button className="hover:underline cursor-pointer">
            <span>$ USD</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
);
