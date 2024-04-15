import React from 'react';
import Container from './Container';
import WeatherIcon from './WeatherIcon';
import WeatherDetails, { WeatherDetailProps } from './WeatherDetails';
import { kelvinToCelsius } from '@/utils/kelvinToCelsius';

export interface ForecastWeatherDetailsProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatheDetail(
  props: ForecastWeatherDetailsProps
) {
  const {
    weatherIcon = '02d',
    date = '19.09',
    day = 'Tuesday',
    temp,
    feels_like,
    temp_min,
    temp_max,
    description,
  } = props;

  return (
    <Container className="gap-4">
      {/* left section */}
      <section className="flex gap-4 items-center px-4">
        {/* First Part */}
        <div>
          <WeatherIcon iconName={weatherIcon} />
          <p>{date}</p>
          <p className="text-sm">{day}</p>
        </div>
        {/* Second Part */}
        <div className="flex flex-col px-4">
          <span className="text-5xl">{kelvinToCelsius(temp ?? 0)}°</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Feels like</span>
            <span>{kelvinToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className="capitalize">{description}</p>
        </div>
      </section>
      {/* right section */}
      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}
