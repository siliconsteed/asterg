import { useState } from 'react';

const zodiacSigns = [
  { name: 'Aries', symbol: '♈', period: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉', period: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊', period: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋', period: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌', period: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍', period: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎', period: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏', period: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐', period: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑', period: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒', period: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓', period: 'Feb 19 - Mar 20' },
];

interface ZodiacSelectorProps {
  onSelect: (sign: string) => void;
}

export default function ZodiacSelector({ onSelect }: ZodiacSelectorProps) {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const handleSelect = (sign: string) => {
    setSelectedSign(sign);
    onSelect(sign);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {zodiacSigns.map((sign) => (
        <button
          key={sign.name}
          onClick={() => handleSelect(sign.name)}
          className={`p-4 rounded-xl border transition-all duration-200 ${
            selectedSign === sign.name
              ? 'border-coffee-300 bg-coffee-50 shadow-lg scale-105'
              : 'border-gray-200 hover:border-coffee-200 hover:bg-coffee-50/50'
          }`}
        >
          <div className="text-3xl mb-2">{sign.symbol}</div>
          <div className="font-semibold text-gray-900">{sign.name}</div>
          <div className="text-sm text-gray-500">{sign.period}</div>
        </button>
      ))}
    </div>
  );
}
