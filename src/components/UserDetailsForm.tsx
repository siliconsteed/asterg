import React, { useState } from 'react';

interface UserDetails {
  email: string;
  dob: string;
  tob: string;
  pob: string;
  lat: number;
  lon: number;
  timezone: number;
}

interface UserDetailsFormProps {
  onSetData: (details: UserDetails) => void;
  disabled: boolean;
}

const times = Array.from({length: 24*2}, (_, i) => {
  const hour = Math.floor(i/2).toString().padStart(2, '0');
  const min = i%2 === 0 ? '00' : '30';
  return `${hour}:${min}`;
});

export default function UserDetailsForm({ onSetData, disabled }: UserDetailsFormProps) {
  const [form, setForm] = useState<UserDetails>({
    email: '',
    dob: '',
    tob: '',
    pob: '',
    lat: 0,
    lon: 0,
    timezone: 5.5, // Default to IST
  });

  const [preview, setPreview] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'lat' || name === 'lon' ? Number(value) : value }));
  };

  const handlePreview = () => {
    setPreview(JSON.stringify(form, null, 2));
  };

  return (
    <div className="p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
      <div className="text-center mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-coffee-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-dark mb-1 sm:mb-2">Your Birth Details</h2>
        <p className="text-gray-600 text-xs sm:text-sm">Enter your birth information for accurate astrological readings</p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Email Field */}
        <div className="group">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2.5 sm:p-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
            disabled={disabled}
            required
          />
        </div>

        {/* Date of Birth Field */}
        <div className="group">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full p-2.5 sm:p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
            disabled={disabled}
            required
          />
        </div>

        {/* Time of Birth Field */}
        <div className="group">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Time of Birth</label>
          <div className="flex gap-2 sm:gap-3">
            <select
              name="hh"
              value={form.tob.split(':')[0] || ''}
              onChange={e => {
                const mm = form.tob.split(':')[1] || '00';
                setForm(f => ({ ...f, tob: `${e.target.value}:${mm}` }));
              }}
              className="flex-1 p-2.5 sm:p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
              disabled={disabled}
              required
            >
              <option value="">Hour</option>
              {Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0')).map(hh => (
                <option key={hh} value={hh}>{hh}</option>
              ))}
            </select>
            <select
              name="mm"
              value={form.tob.split(':')[1] || ''}
              onChange={e => {
                const hh = form.tob.split(':')[0] || '00';
                setForm(f => ({ ...f, tob: `${hh}:${e.target.value}` }));
              }}
              className="flex-1 p-2.5 sm:p-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
              disabled={disabled}
              required
            >
              <option value="">Minute</option>
              {['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'].map(mm => (
                <option key={mm} value={mm}>{mm}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Place of Birth Field */}
        <div className="group">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Place of Birth</label>
          <input
            type="text"
            name="pob"
            placeholder="e.g., New York, NY, USA"
            value={form.pob}
            onChange={handleChange}
            className="w-full p-2.5 sm:p-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
            disabled={disabled}
            required
          />
        </div>

        {/* Coordinates Fields */}
        <div className="group">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Coordinates</label>
          <div className="flex gap-2 sm:gap-3">
            <input
              type="number"
              name="lat"
              placeholder="Latitude"
              value={form.lat}
              onChange={handleChange}
              className="flex-1 p-2.5 sm:p-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
              step="0.00001"
              disabled={disabled}
              required
            />
            <input
              type="number"
              name="lon"
              placeholder="Longitude"
              value={form.lon}
              onChange={handleChange}
              className="flex-1 p-2.5 sm:p-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
              step="0.00001"
              disabled={disabled}
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Find coordinates at <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" className="text-coffee-600 hover:text-coffee-700">latlong.net</a></p>
        </div>

        {/* Timezone Field */}
        <div className="group">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Timezone</label>
          <input
            type="number"
            name="timezone"
            placeholder="e.g., 5.5 for IST, -7 for PDT"
            value={form.timezone}
            onChange={handleChange}
            className="w-full p-2.5 sm:p-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
            step="0.25"
            disabled={disabled}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Use positive for East, negative for West of UTC</p>
        </div>

        {/* Set Data Button */}
        <div className="pt-2 sm:pt-4">
          <button
            type="button"
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-coffee-400 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
            onClick={() => onSetData(form)}
            disabled={disabled}
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Set Birth Details
            </span>
          </button>
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Data Preview</h4>
            <pre className="bg-white p-2 sm:p-3 rounded-lg text-xs text-gray-600 overflow-auto">{preview}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
