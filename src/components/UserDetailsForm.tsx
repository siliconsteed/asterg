import React, { useEffect, useState } from 'react';

interface UserDetails {
  email: string;
  dob: string;
  tob: string;
  pob: string;
  lat: number;
  lon: number;
  timezone: number;
  ianaTimezone?: string;
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
    timezone: 5.5, // Will be auto-filled after place selection
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Autocomplete state for Place of Birth
  const [pobQuery, setPobQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Array<{ name: string; lat: number; lon: number }>>([]);
  const [openSuggest, setOpenSuggest] = useState<boolean>(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [loadingSuggest, setLoadingSuggest] = useState<boolean>(false);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

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
          // Update query and show suggestions
          setPobQuery(value);
          setOpenSuggest(value.trim().length > 1);
          return { ...f, pob: value };
        default:
          return f;
      }
    });
  };

  // Debounced fetch for place suggestions
  useEffect(() => {
    let timer: any;
    if (openSuggest && pobQuery.trim().length > 1) {
      setLoadingSuggest(true);
      timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/places?q=${encodeURIComponent(pobQuery.trim())}`);
          const data = await res.json();
          setSuggestions(data.results || []);
        } catch (e) {
          setSuggestions([]);
        } finally {
          setLoadingSuggest(false);
        }
      }, 350);
    } else {
      setSuggestions([]);
    }
    return () => clearTimeout(timer);
  }, [pobQuery, openSuggest]);

  // Click-away to close suggestions
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!openSuggest) return;
      const target = e.target as Node;
      if (
        inputRef.current && !inputRef.current.contains(target) &&
        listRef.current && !listRef.current.contains(target)
      ) {
        setOpenSuggest(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openSuggest]);

  const selectPlace = async (item: { name: string; lat: number; lon: number }) => {
    setForm(f => ({ ...f, pob: item.name, lat: item.lat, lon: item.lon }));
    setPobQuery(item.name);
    setOpenSuggest(false);
    setHighlighted(-1);
    // Fetch timezone for DOB if available
    if (form.dob) {
      try {
        const tzRes = await fetch(`/api/timezone?lat=${item.lat}&lon=${item.lon}&date=${encodeURIComponent(form.dob)}`);
        const tzJson = await tzRes.json();
        setForm(f => ({
          ...f,
          timezone: typeof tzJson?.timezoneNumber === 'number' ? tzJson.timezoneNumber : f.timezone,
          ianaTimezone: tzJson?.ianaTimezone || f.ianaTimezone,
        }));
      } catch {}
    }
  };

  // Recompute timezone when DOB changes and we already have lat/lon
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!form.dob || !Number.isFinite(form.lat) || !Number.isFinite(form.lon)) return;
      try {
        const tzRes = await fetch(`/api/timezone?lat=${form.lat}&lon=${form.lon}&date=${encodeURIComponent(form.dob)}`);
        const tzJson = await tzRes.json();
        if (!cancelled) {
          setForm(f => ({
            ...f,
            timezone: typeof tzJson?.timezoneNumber === 'number' ? tzJson.timezoneNumber : f.timezone,
            ianaTimezone: tzJson?.ianaTimezone || f.ianaTimezone,
          }));
        }
      } catch {}
    };
    run();
    return () => { cancelled = true; };
  }, [form.dob]);

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
    // Ensure auto-derived fields are present after selection
    if (!Number.isFinite(form.lat) || !Number.isFinite(form.lon)) {
      newErrors.pob = newErrors.pob || 'Please select a place from the dropdown suggestions';
    }
    if (!Number.isFinite(form.timezone)) {
      newErrors.pob = newErrors.pob || 'Timezone could not be derived; please reselect your place';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSetData(form);
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

        {/* Place of Birth Field with Autocomplete */}
        <div className="group relative">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Place of Birth</label>
          <input
            ref={inputRef}
            type="text"
            name="pob"
            placeholder="Type to search city (e.g Paris, France)"
            value={form.pob}
            onChange={handleChange}
            onFocus={() => setOpenSuggest(form.pob.trim().length > 1)}
            onKeyDown={(e) => {
              if (!openSuggest) return;
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlighted(h => Math.max(h - 1, 0));
              } else if (e.key === 'Enter') {
                if (highlighted >= 0 && highlighted < suggestions.length) {
                  e.preventDefault();
                  selectPlace(suggestions[highlighted]);
                }
              } else if (e.key === 'Escape') {
                setOpenSuggest(false);
                setHighlighted(-1);
              }
            }}
            className={`w-full p-2.5 sm:p-3 bg-white border rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base ${
              errors.pob 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
            }`}
            disabled={disabled}
            required
            aria-autocomplete="list"
            aria-expanded={openSuggest}
            aria-controls="pob-suggestions"
          />
          {openSuggest && (
            <ul
              id="pob-suggestions"
              ref={listRef}
              className="absolute z-20 mt-1 w-full max-h-56 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg"
              role="listbox"
            >
              {loadingSuggest && (
                <li className="px-3 py-2 text-gray-500 text-sm">Searching...</li>
              )}
              {!loadingSuggest && suggestions.length === 0 && (
                <li className="px-3 py-2 text-gray-500 text-sm">No results</li>
              )}
              {!loadingSuggest && suggestions.map((s, idx) => (
                <li
                  key={`${s.name}-${idx}`}
                  role="option"
                  aria-selected={idx === highlighted}
                  onMouseEnter={() => setHighlighted(idx)}
                  onMouseDown={(e) => {
                    // prevent input blur before click handler
                    e.preventDefault();
                    selectPlace(s);
                  }}
                  className={`px-3 py-2 cursor-pointer text-sm ${idx === highlighted ? 'bg-amber-50' : ''}`}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
          {errors.pob && <p className="text-red-500 text-xs mt-1">{errors.pob}</p>}
        </div>

        {/* Coordinates and Timezone are auto-derived; no manual inputs shown */}

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