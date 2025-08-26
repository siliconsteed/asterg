import React, { useEffect, useState } from 'react';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manage lat/lon as text for better UX (allow '-' and partial input),
  // then sync to numeric state when valid
  const [latInput, setLatInput] = useState<string>('0');
  const [lonInput, setLonInput] = useState<string>('0');
  const [timezoneInput, setTimezoneInput] = useState<string>('5.5');

  // Sync text inputs from numeric form state on mount/whenever form changes externally
  useEffect(() => {
    setLatInput(String(form.lat));
    setLonInput(String(form.lon));
    setTimezoneInput(String(form.timezone));
  }, [form.lat, form.lon, form.timezone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setForm(f => {
      switch (name) {
        case 'email':
          return { ...f, email: value };
        case 'dob':
          return { ...f, dob: value };
        case 'pob':
          return { ...f, pob: value };
        default:
          return f;
      }
    });
  };

  // Helpers for validating and formatting coordinates
  const coordPattern = /^-?\d{0,3}(?:\.(\d{0,6})?)?$/; // up to 3 integer digits, up to 6 decimals

  const formatTo3dp = (num: number) => {
    return Number.isFinite(num) ? Number(num.toFixed(3)) : num;
  };

  const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

  const onLatChange = (value: string) => {
    // Allow empty or just '-' during typing
    if (value === '' || value === '-') {
      setLatInput(value);
      return;
    }
    if (coordPattern.test(value)) {
      setLatInput(value);
    }
  };

  const onLonChange = (value: string) => {
    if (value === '' || value === '-') {
      setLonInput(value);
      return;
    }
    if (coordPattern.test(value)) {
      setLonInput(value);
    }
  };

  const onLatBlur = () => {
    const num = parseFloat(latInput);
    if (!isNaN(num)) {
      const clamped = clamp(num, -90, 90);
      const rounded = formatTo3dp(clamped);
      setLatInput(String(rounded));
      setForm(f => ({ ...f, lat: rounded }));
    } else {
      // reset to previous valid form value
      setLatInput(String(form.lat));
    }
  };

  const onLonBlur = () => {
    const num = parseFloat(lonInput);
    if (!isNaN(num)) {
      const clamped = clamp(num, -180, 180);
      const rounded = formatTo3dp(clamped);
      setLonInput(String(rounded));
      setForm(f => ({ ...f, lon: rounded }));
    } else {
      setLonInput(String(form.lon));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!form.tob) {
      newErrors.tob = 'Time of birth is required';
    }

    if (!form.pob) {
      newErrors.pob = 'Place of birth is required';
    }

    if (isNaN(parseFloat(latInput)) || latInput === '') {
      newErrors.lat = 'Valid latitude is required';
    }

    if (isNaN(parseFloat(lonInput)) || lonInput === '') {
      newErrors.lon = 'Valid longitude is required';
    }

    if (isNaN(parseFloat(timezoneInput)) || timezoneInput === '') {
      newErrors.timezone = 'Valid timezone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Ensure latest lat/lon are synchronized and valid before submit
      const latNum = formatTo3dp(clamp(parseFloat(latInput), -90, 90));
      const lonNum = formatTo3dp(clamp(parseFloat(lonInput), -180, 180));
      const timezoneNum = parseFloat(timezoneInput);
      const details: UserDetails = { ...form, lat: latNum, lon: lonNum, timezone: timezoneNum };
      onSetData(details);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
      <div className="text-center mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Your Birth Details</h2>
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
            className={`w-full p-2.5 sm:p-3 bg-white border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
            }`}
            disabled={disabled}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Date of Birth Field */}
        <div className="group">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className={`w-full p-2.5 sm:p-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base ${
              errors.dob 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
            }`}
            disabled={disabled}
            required
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
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
                const newTob = `${e.target.value}:${mm}`;
                setForm(f => ({ ...f, tob: newTob }));
                if (errors.tob) {
                  setErrors(prev => ({ ...prev, tob: '' }));
                }
              }}
              className={`flex-1 p-2.5 sm:p-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base ${
                errors.tob 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
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
                const newTob = `${hh}:${e.target.value}`;
                setForm(f => ({ ...f, tob: newTob }));
                if (errors.tob) {
                  setErrors(prev => ({ ...prev, tob: '' }));
                }
              }}
              className={`flex-1 p-2.5 sm:p-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base ${
                errors.tob 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
              disabled={disabled}
              required
            >
              <option value="">Minute</option>
              {Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0')).map(mm => (
                <option key={mm} value={mm}>{mm}</option>
              ))}
            </select>
          </div>
          {errors.tob && <p className="text-red-500 text-xs mt-1">{errors.tob}</p>}
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
            className={`w-full p-2.5 sm:p-3 bg-white border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base ${
              errors.pob 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
            }`}
            disabled={disabled}
            required
          />
          {errors.pob && <p className="text-red-500 text-xs mt-1">{errors.pob}</p>}
        </div>

        {/* Coordinates Fields */}
        <div className="group">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Coordinates</label>
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1">
              <input
                type="text"
                name="lat"
                placeholder="Latitude"
                value={latInput}
                onChange={(e) => {
                  onLatChange(e.target.value);
                  if (errors.lat) {
                    setErrors(prev => ({ ...prev, lat: '' }));
                  }
                }}
                onBlur={onLatBlur}
                inputMode="decimal"
                className={`w-full p-2.5 sm:p-3 bg-white border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base ${
                  errors.lat 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                }`}
                disabled={disabled}
                required
              />
              {errors.lat && <p className="text-red-500 text-xs mt-1">{errors.lat}</p>}
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="lon"
                placeholder="Longitude"
                value={lonInput}
                onChange={(e) => {
                  onLonChange(e.target.value);
                  if (errors.lon) {
                    setErrors(prev => ({ ...prev, lon: '' }));
                  }
                }}
                onBlur={onLonBlur}
                inputMode="decimal"
                className={`w-full p-2.5 sm:p-3 bg-white border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base ${
                  errors.lon 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                }`}
                disabled={disabled}
                required
              />
              {errors.lon && <p className="text-red-500 text-xs mt-1">{errors.lon}</p>}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Find coordinates at <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">latlong.net</a></p>
        </div>

        {/* Timezone Field */}
        <div className="group">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Timezone</label>
          <input
            type="text"
            name="timezone"
            placeholder="e.g., 5.5 for IST, -7 for PDT"
            value={timezoneInput}
            onChange={(e) => {
              const value = e.target.value;
              // Allow typing of numbers, one decimal, and a leading minus sign
              if (/^-?\d*\.?\d*$/.test(value)) {
                setTimezoneInput(value);
              }
              if (errors.timezone) {
                setErrors(prev => ({ ...prev, timezone: '' }));
              }
            }}
            onBlur={() => {
              const num = parseFloat(timezoneInput);
              if (!isNaN(num)) {
                const clamped = clamp(num, -12, 14); // Standard timezone range
                setTimezoneInput(String(clamped));
                setForm(f => ({ ...f, timezone: clamped }));
              } else {
                setTimezoneInput(String(form.timezone)); // Revert on invalid input
              }
            }}
            inputMode="decimal"
            className={`w-full p-2.5 sm:p-3 bg-white border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base ${
              errors.timezone
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
            }`}
            disabled={disabled}
            required
          />
          {errors.timezone && <p className="text-red-500 text-xs mt-1">{errors.timezone}</p>}
          <p className="text-xs text-gray-500 mt-1">Use positive for East, negative for West of UTC</p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 sm:pt-4 space-y-2">
          <button
            type="button"
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-amber-400 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
            onClick={handleSubmit}
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
        
      </div>
    </div>
  );
}