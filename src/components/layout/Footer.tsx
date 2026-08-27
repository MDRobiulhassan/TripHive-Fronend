import React from 'react';
import Link from 'next/link';
import { Compass, Heart } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-200 mt-20 font-sans">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-gray-900">TripHive</span>
          </Link>
          <p className="text-xs text-gray-500 leading-relaxed">Curated luxury suites, boutique hotels and vacation rentals.</p>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase text-gray-900 tracking-wider mb-4">Support</h4>
          <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">AirCover Guarantee</a></li>
            <li><a href="#" className="hover:underline">Disability support</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase text-gray-900 tracking-wider mb-4">Hosting</h4>
          <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
            <li><Link href="/admin" className="hover:underline">TripHive your home</Link></li>
            <li><Link href="/admin" className="hover:underline">Hosting resources</Link></li>
            <li><Link href="/admin" className="hover:underline">Community forum</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase text-gray-900 tracking-wider mb-4">TripHive</h4>
          <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
            <li><a href="#" className="hover:underline">Newsroom</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Investors</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} TripHive, Inc. · Privacy · Terms</p>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-1" />
          <span>for seamless booking experiences.</span>
        </div>
      </div>
    </div>
  </footer>
);
