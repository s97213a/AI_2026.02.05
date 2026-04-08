
import React, { useState, useMemo } from 'react';
import { clinicData } from './constants';
import type { Clinic } from './types';
import { ClinicCard } from './components/ClinicCard';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const districts = useMemo(() => {
    const allDistricts = [...new Set(clinicData.map(clinic => clinic.district))];
    return ['所有區域', ...allDistricts.sort((a, b) => a.localeCompare(b, 'zh-Hant'))];
  }, []);

  const groupedClinics = useMemo(() => {
    const filteredData = clinicData.filter(clinic => {
      const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        clinic.district.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDistrict = !selectedDistrict || clinic.district === selectedDistrict;

      return matchesSearch && matchesDistrict;
    });

    return filteredData.reduce((acc, clinic) => {
      if (!acc[clinic.district]) {
        acc[clinic.district] = [];
      }
      acc[clinic.district].push(clinic);
      return acc;
    }, {} as Record<string, Clinic[]>);
  }, [searchTerm, selectedDistrict]);

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
              <p className="text-sm text-gray-400 mt-1">更新日期：115年4月8日</p>
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
