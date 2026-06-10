
import React from 'react';
import type { Clinic } from '../types';
import { MapPin, Phone, ClipboardList } from 'lucide-react';

interface ClinicCardProps {
  clinic: Clinic;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`台南市 ${clinic.district} ${clinic.name}`)}`;
  const phoneSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${clinic.name} 電話`)}`;

  return (
    <div className="group bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
            {clinic.name}
          </h3>
          <div className="p-1.5 bg-gray-800 rounded-lg text-gray-400 group-hover:text-cyan-400 transition-colors">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <MapPin className="w-4 h-4 text-cyan-500/70 mt-0.5 shrink-0" />
            <span>{clinic.district}</span>
          </div>
          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <div className="w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            </div>
            <span className="leading-relaxed">{clinic.services}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 grid grid-cols-2 gap-3">
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-gray-800 text-gray-300 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 hover:bg-cyan-600 hover:text-white border border-gray-700 hover:border-cyan-500"
        >
          <MapPin className="w-4 h-4" />
          地圖
        </a>
        <a
          href={phoneSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-gray-800 text-gray-300 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 hover:bg-emerald-600 hover:text-white border border-gray-700 hover:border-emerald-500"
        >
          <Phone className="w-4 h-4" />
          電話
        </a>
      </div>
    </div>
  );
};
