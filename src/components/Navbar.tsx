import React, { useState } from 'react';
import { FaLocationArrow, FaSun } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import SearchBox from './SearchBox';

export default function Navbar() {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  async function handleInputChange(value: string) {
    setCity(value);
  }

  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <FaSun className="text-3xl mt-1 text-yellow-300" />
        </div>

        <section className="flex gap-2 items-center">
          <FaLocationDot className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer" />
          <FaLocationArrow className="text-2xl" />
          <p className="text-slate-900/80 text-sm">Colombia</p>
          <div>
            <SearchBox
              value={city}
              onChange={(e) => handleInputChange(e.target.value)}
              onSubmit={undefined}
            />
          </div>
        </section>
      </div>
    </nav>
  );
}
