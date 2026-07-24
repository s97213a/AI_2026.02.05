
import React from 'react';
import type { Clinic } from '../types';
import { MapPin, Phone, ClipboardList } from 'lucide-react';

interface ClinicCardProps {
  clinic: Clinic;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`台南市 ${clinic.district} ${clinic.name}`)}`;
  const phoneSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${clinic.name} 電話`)}`;
  const isColonoscopy = clinic.services.includes('大腸鏡');

  return (
    <div className={`group bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 flex flex-col h-full ${
      isColonoscopy 
        ? 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]' 
        : 'hover:border-teal-500/50 hover:shadow-[0_0_30px_-10px_rgba(20,184,166,0.3)]'
    }`}>
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className={`text-xl font-bold text-white transition-colors duration-300 ${
            isColonoscopy ? 'group-hover:text-cyan-400' : 'group-hover:text-teal-400'
          }`}>
            {clinic.name}
          </h3>
          <div className={`p-1.5 bg-gray-800 rounded-lg text-gray-400 shrink-0 transition-colors ${
            isColonoscopy ? 'group-hover:text-cyan-400' : 'group-hover:text-teal-400'
          }`}>
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        {/* 服務項目分類標籤 Badge */}
        <div className="mb-4 flex flex-wrap gap-2">
          {isColonoscopy ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_-3px_rgba(6,182,212,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
              大腸鏡 + 糞便潛血
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
              糞便潛血檢查
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isColonoscopy ? 'text-cyan-500/70' : 'text-teal-500/70'}`} />
            <span>{clinic.district}</span>
          </div>
          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <div className="w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center">
              <div className={`w-1.5 h-1.5 rounded-full ${isColonoscopy ? 'bg-cyan-500' : 'bg-teal-500'}`} />
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
          className={`flex items-center justify-center gap-2 bg-gray-800 text-gray-300 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 border border-gray-700 ${
            isColonoscopy 
              ? 'hover:bg-cyan-600 hover:text-white hover:border-cyan-500' 
              : 'hover:bg-teal-600 hover:text-white hover:border-teal-500'
          }`}
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
