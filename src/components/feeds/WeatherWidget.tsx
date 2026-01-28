'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, RefreshCw, MapPin } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  high: number;
  low: number;
}

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower.includes('rain') || lower.includes('drizzle')) return CloudRain;
  if (lower.includes('snow')) return CloudSnow;
  if (lower.includes('cloud') || lower.includes('overcast')) return Cloud;
  return Sun;
};

const getConditionFromCode = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 59) return 'Drizzle';
  if (code <= 69) return 'Rain';
  if (code <= 79) return 'Snow';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Delhi coordinates
      const lat = 28.6139;
      const lon = 77.2090;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata`
      );
      
      if (!response.ok) throw new Error('Failed to fetch weather');
      
      const data = await response.json();
      
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        condition: getConditionFromCode(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        feelsLike: Math.round(data.current.apparent_temperature),
        high: Math.round(data.daily.temperature_2m_max[0]),
        low: Math.round(data.daily.temperature_2m_min[0]),
      });
      setError(null);
    } catch (e) {
      setError('Weather unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // Refresh every 30 min
    return () => clearInterval(interval);
  }, []);

  const WeatherIcon = weather ? getWeatherIcon(weather.condition) : Sun;

  return (
    <div className="rounded-lg p-5 bg-[#0a0a0a] border border-[#facc15]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#facc15]/10">
            <Cloud size={16} className="text-[#facc15]" />
          </div>
          <div className="flex items-center gap-1 text-zinc-400 text-sm">
            <MapPin size={12} />
            <span>Delhi</span>
          </div>
        </div>
        <button
          onClick={fetchWeather}
          className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="text-center py-4 text-zinc-500 text-sm">{error}</div>
      ) : weather ? (
        <>
          {/* Main Temperature */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-white">{weather.temperature}°</div>
              <div className="text-sm text-zinc-400">{weather.condition}</div>
            </div>
            <WeatherIcon size={48} className="text-[#facc15]" />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-zinc-400">
              <span>H: {weather.high}°</span>
              <span className="text-zinc-600">|</span>
              <span>L: {weather.low}°</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 justify-end">
              <span>Feels {weather.feelsLike}°</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Droplets size={14} />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 justify-end">
              <Wind size={14} />
              <span>{weather.windSpeed} km/h</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4 text-zinc-500 text-sm">Loading...</div>
      )}
    </div>
  );
}
