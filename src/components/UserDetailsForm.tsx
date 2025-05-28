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
    <div className="p-6 bg-white rounded-xl shadow-md w-80 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Your Details</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 rounded"
        disabled={disabled}
        required
      />
      <label>Date of Birth</label>
      <input
        type="date"
        name="dob"
        value={form.dob}
        onChange={handleChange}
        className="border p-2 rounded"
        disabled={disabled}
        required
      />
      <label>Time of Birth</label>
      <div className="flex gap-2">
        <select
          name="hh"
          value={form.tob.split(':')[0] || ''}
          onChange={e => {
            const mm = form.tob.split(':')[1] || '00';
            setForm(f => ({ ...f, tob: `${e.target.value}:${mm}` }));
          }}
          className="border p-2 rounded w-1/2"
          disabled={disabled}
          required
        >
          <option value="">HH</option>
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
          className="border p-2 rounded w-1/2"
          disabled={disabled}
          required
        >
          <option value="">MM</option>
          {['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'].map(mm => (
            <option key={mm} value={mm}>{mm}</option>
          ))}
        </select>
      </div>
      <input
        type="text"
        name="pob"
        placeholder="Place of Birth"
        value={form.pob}
        onChange={handleChange}
        className="border p-2 rounded"
        disabled={disabled}
        required
      />
      <label className="block font-medium mb-1 mt-2">Latitude and Longitude</label>
      <div className="flex gap-2">
        <input
          type="number"
          name="lat"
          placeholder="Latitude"
          value={form.lat}
          onChange={handleChange}
          className="border p-2 rounded w-1/2"
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
          className="border p-2 rounded w-1/2"
          step="0.00001"
          disabled={disabled}
          required
        />
      </div>
      <label className="block font-medium mb-1 mt-2">Timezone (e.g. 5.5 for IST, -7 for PDT)</label>
      <input
        type="number"
        name="timezone"
        placeholder="Timezone"
        value={form.timezone}
        onChange={handleChange}
        className="border p-2 rounded"
        step="0.25"
        disabled={disabled}
        required
      />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() => onSetData(form)}
          disabled={disabled}
        >
          Set Data
        </button>
      </div>
      {preview && (
        <pre className="bg-gray-100 p-2 rounded text-xs mt-2">{preview}</pre>
      )}
    </div>
  );
}
