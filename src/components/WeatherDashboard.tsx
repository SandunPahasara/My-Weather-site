import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import WeatherDetails from './WeatherDetails';
import SearchBar from './SearchBar';
import { useWeather } from '../context/WeatherContext';
import WeatherAlerts from './WeatherAlerts';
import { getWeatherBackground } from '../utils/weatherUtils';

const WeatherDashboard: React.FC = () => {
  const { currentWeather, isLoading, error } = useWeather();
  const [showSearch, setShowSearch] = useState(false);

  const weatherCondition = currentWeather?.weather[0]?.main || 'Clear';
  const isDay = currentWeather ? 
    new Date().getTime() / 1000 > currentWeather.sys.sunrise && 
    new Date().getTime() / 1000 < currentWeather.sys.sunset : 
    true;

  const backgroundStyle = getWeatherBackground(weatherCondition, isDay);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 max-w-md mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error.message || 'Failed to load weather data'}</p>
          <p className="mt-4 text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ${backgroundStyle}`}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-3xl font-bold text-white drop-shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Weather App
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300"
            >
              {showSearch ? 'Close' : 'Search Location'}
            </button>
          </motion.div>
        </header>

        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <SearchBar onClose={() => setShowSearch(false)} />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CurrentWeather />
          </motion.div>
          
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 gap-6">
              <WeatherAlerts />
              <WeatherDetails />
              <WeatherForecast />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;