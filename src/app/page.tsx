'use client';

import Container from '@/components/Container';
import ForecastWeatheDetail from '@/components/ForecastWeatheDetail';
import Navbar from '@/components/Navbar';
import WeatherDetails from '@/components/WeatherDetails';
import WeatherIcon from '@/components/WeatherIcon';
import { convertWindSpeed } from '@/utils/convertWindSpeed';
import { getDayOrNightIcon } from '@/utils/getDayOrNightIcon';
import { kelvinToCelsius } from '@/utils/kelvinToCelsius';
import { metersToKilometers } from '@/utils/metersToKilometers';
import axios from 'axios';
import { parseISO, format, fromUnixTime } from 'date-fns';
import { useAtom } from 'jotai';
import { useQuery } from 'react-query';
import { placeAtom } from './atom';
import { useEffect } from 'react';

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    'repoData',
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
      );
      return data;
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  console.log('data', data);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split('T')[0]
      )
    ),
  ];

  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

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
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {kelvinToCelsius(firstData?.main.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels Like</span>
                  <span>
                    {kelvinToCelsius(firstData?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {kelvinToCelsius(firstData?.main.temp_min ?? 0)}
                    °↓{''}
                  </span>
                  <span>
                    {kelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
                  </span>
                </p>
              </div>
              {/* time and weather icon*/}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((data, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(data.dt_txt), 'h:mm a')}
                    </p>

                    <WeatherIcon
                      iconName={getDayOrNightIcon(
                        data.weather[0].icon,
                        data.dt_txt
                      )}
                    />
                    <p>{kelvinToCelsius(data?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/* left */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {firstData?.weather[0].description}
              </p>
              <WeatherIcon
                iconName={getDayOrNightIcon(
                  firstData.weather[0].icon ?? '',
                  firstData.dt_txt ?? ''
                )}
              />
            </Container>
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visibility={metersToKilometers(firstData.visibility ?? 10000)}
                humidity={`${firstData?.main.humidity}%`}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                airPressure={`${firstData?.main.pressure} hPa`}
                sunrise={format(
                  fromUnixTime(data?.city.sunrise ?? 17029249452),
                  'H:mm'
                )}
                sunset={format(
                  fromUnixTime(data?.city.sunset ?? 17029249452),
                  'H:mm'
                )}
              />
            </Container>
            {/* right */}
          </div>
        </section>
        {/* 7 Day Forecast Data */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Forecast (7 Days)</p>
          {firstDataForEachDate.map((data, index) => (
            <ForecastWeatheDetail
              key={index}
              description={data?.weather[0].description ?? ''}
              weatherIcon={data?.weather[0].icon ?? '01d'}
              date={format(parseISO(data?.dt_txt ?? ''), 'dd.MM')}
              day={format(parseISO(data?.dt_txt ?? ''), 'EEEE')}
              feels_like={data?.main.feels_like ?? 0}
              temp={data?.main.temp ?? 0}
              temp_max={data?.main.temp_max ?? 0}
              temp_min={data?.main.temp_min ?? 0}
              airPressure={`${data?.main.pressure} hPa`}
              humidity={`${data?.main.humidity}%`}
              visibility={`${metersToKilometers(data?.visibility ?? 10000)}`}
              windSpeed={`${convertWindSpeed(data?.wind.speed ?? 1.64)}`}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
