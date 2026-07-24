
import React, { useState, useMemo } from 'react';
import { clinicData } from './constants';
import type { Clinic } from './types';
import { ClinicCard } from './components/ClinicCard';
import { Layers, Filter, Stethoscope } from 'lucide-react';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'colonoscopy'>('all');

  const districts = useMemo(() => {
    const allDistricts = [...new Set(clinicData.map(clinic => clinic.district))];
    return ['所有區域', ...allDistricts.sort((a, b) => a.localeCompare(b, 'zh-Hant'))];
  }, []);

  // 動態計算在目前的搜尋與區域篩選條件下，各分類院所的數量
  const serviceCounts = useMemo(() => {
    let all = 0;
    let colonoscopy = 0;

    clinicData.forEach(clinic => {
      const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        clinic.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = !selectedDistrict || clinic.district === selectedDistrict;

      if (matchesSearch && matchesDistrict) {
        all++;
        if (clinic.services.includes('大腸鏡')) {
          colonoscopy++;
        }
      }
    });

    return { all, colonoscopy };
  }, [searchTerm, selectedDistrict]);

  const groupedClinics = useMemo(() => {
    const filteredData = clinicData.filter(clinic => {
      const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        clinic.district.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDistrict = !selectedDistrict || clinic.district === selectedDistrict;

      const hasColonoscopy = clinic.services.includes('大腸鏡');
      const matchesService = 
        serviceFilter === 'all' ||
        (serviceFilter === 'colonoscopy' && hasColonoscopy);

      return matchesSearch && matchesDistrict && matchesService;
    });

    return filteredData.reduce((acc, clinic) => {
      if (!acc[clinic.district]) {
        acc[clinic.district] = [];
      }
      acc[clinic.district].push(clinic);
      return acc;
    }, {} as Record<string, Clinic[]>);
  }, [searchTerm, selectedDistrict, serviceFilter]);

  const sortedDistricts = useMemo(() => {
    return Object.keys(groupedClinics).sort((a, b) => a.localeCompare(b, 'zh-Hant'));
  }, [groupedClinics]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 whitespace-nowrap">
                <i className="fas fa-clinic-medical mr-2"></i>台南市愛腸篩活動院所
              </h1>
              <p className="text-sm text-gray-400 mt-1">更新日期：115年7月24日</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="搜尋診所或區域..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
              </div>

              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full sm:w-48 bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  aria-label="選擇區域"
                >
                  {districts.map(district => (
                      <option key={district} value={district === '所有區域' ? '' : district}>
                          {district}
                      </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 篩檢項目過濾器 */}
        <div className="bg-gray-800/40 border border-gray-800 rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm font-semibold text-gray-400 flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-cyan-400" />
              篩檢服務：
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setServiceFilter('all')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 border transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                  serviceFilter === 'all'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.4)] scale-[1.02]'
                    : 'bg-gray-800/80 hover:bg-gray-700/90 text-gray-300 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Layers className={`w-4 h-4 ${serviceFilter === 'all' ? 'text-white' : 'text-cyan-400'}`} />
                <span>全部院所</span>
                <span className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-full font-mono font-bold transition-colors ${
                  serviceFilter === 'all' 
                    ? 'bg-cyan-700 text-cyan-100' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {serviceCounts.all}
                </span>
              </button>

              <button
                onClick={() => setServiceFilter('colonoscopy')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 border transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                  serviceFilter === 'colonoscopy'
                    ? 'bg-cyan-500 text-white border-cyan-300 shadow-[0_4px_20px_rgba(6,182,212,0.4)] scale-[1.02]'
                    : 'bg-gray-800/80 hover:bg-gray-700/90 text-gray-300 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Stethoscope className={`w-4 h-4 ${serviceFilter === 'colonoscopy' ? 'text-white' : 'text-cyan-300'}`} />
                <span>大腸鏡檢查 (含潛血)</span>
                <span className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-full font-mono font-bold transition-colors ${
                  serviceFilter === 'colonoscopy' 
                    ? 'bg-cyan-600 text-cyan-100' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {serviceCounts.colonoscopy}
                </span>
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-400 border-t border-gray-800/80 pt-3 md:pt-0 md:border-t-0 font-medium self-end md:self-auto flex items-center gap-2 shrink-0">
            <span>符合篩選條件的院所：</span>
            <span className={`font-mono font-bold text-sm px-2.5 py-1 rounded-lg ${
              serviceFilter === 'all' 
                ? 'text-cyan-400 bg-cyan-500/10' 
                : 'text-cyan-300 bg-cyan-400/10'
            }`}>
              {serviceCounts[serviceFilter === 'all' ? 'all' : 'colonoscopy']} 家
            </span>
          </div>
        </div>

        {sortedDistricts.length > 0 ? (
          sortedDistricts.map(district => (
            <section key={district} className="mb-12">
              <h2 className="text-2xl font-semibold border-b-2 border-cyan-500 pb-2 mb-6 text-cyan-300">
                {district}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedClinics[district].map(clinic => (
                  <ClinicCard key={clinic.name} clinic={clinic} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">找不到符合條件的診所。</p>
          </div>
        )}
      </main>

       <footer className="bg-gray-800 text-center py-6 mt-8">
        <div className="text-gray-400 text-sm space-y-1">
            <p className="font-semibold text-base mb-2 text-white">臺南愛(AI)腸篩計畫</p>
            <p>主辦單位：社團法人台南市醫師公會</p>
            <p>協辦單位：臺南市政府衛生局、國立成功大學醫學院附設醫院</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
