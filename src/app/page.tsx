'use client';

import Navbar from '@/components/Navbar';
import axios from 'axios';
import { useQuery } from 'react-query';

// https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid=f03fa3d4826351611bcfc0c7d89013b3

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Minutely {
  dt: number;
  precipitation: number;
}

interface Hourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  pop: number;
}

interface Daily {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  clouds: number;
  pop: number;
  uvi: number;
}

interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: Weather[];
  };
  minutely: Minutely[];
  hourly: Hourly[];
  daily: Daily[];
}

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>(
    'repoData',
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
      );
      return data;
    }
  );

  console.log('data', data?.timezone);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today Data */}
        <section>
          <div>
            <h2 className="flex gap-1 text-2xl items-end"></h2>
          </div>
        </section>
        {/* 7 Day Forecast Data */}
        <section></section>
      </main>
    </div>
  );
}
