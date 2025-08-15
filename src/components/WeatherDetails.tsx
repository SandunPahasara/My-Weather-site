import React from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, Wind, Gauge, Sun, Sunrise, Sunset, 
  Eye, Cloud, ThermometerSun 
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { format } from 'date-fns';
import { getUVIndex } from '../utils/weatherUtils';

const WeatherDetails: React.FC = () => {
  const { currentWeather, units } = useWeather();
  
  if (!currentWeather) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Weather Details</h2>
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-24 bg-white bg-opacity-20 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  const sunriseTime = format(new Date(currentWeather.sys.sunrise * 1000), 'h:mm a');
  const sunsetTime = format(new Date(currentWeather.sys.sunset * 1000), 'h:mm a');
  const windUnit = units === 'metric' ? 'm/s' : 'mph';
  const pressureUnit = units === 'metric' ? 'hPa' : 'inHg';
  const pressureValue = units === 'metric' 
    ? currentWeather.main.pressure 
    : (currentWeather.main.pressure * 0.02953).toFixed(2);
  const visibilityValue = units === 'metric'
    ? (currentWeather.visibility / 1000).toFixed(1)
    : (currentWeather.visibility / 1609.34).toFixed(1);
  const visibilityUnit = units === 'metric' ? 'km' : 'mi';
  
  // Mock UV index (not provided by the free OpenWeatherMap API)
  const uvIndex = getUVIndex(currentWeather.weather[0].id);
  
  const detailItems = [
    {
      icon: <ThermometerSun size={22} className="text-yellow-300" />,
      title: 'Feels Like',
      value: `${Math.round(currentWeather.main.feels_like)}${units === 'metric' ? '°C' : '°F'}`,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Droplets size={22} className="text-blue-300" />,
      title: 'Humidity',
      value: `${currentWeather.main.humidity}%`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Wind size={22} className="text-teal-300" />,
      title: 'Wind',
      value: `${currentWeather.wind.speed} ${windUnit}`,
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: <Gauge size={22} className="text-purple-300" />,
      title: 'Pressure',
      value: `${pressureValue} ${pressureUnit}`,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: <Sun size={22} className="text-amber-300" />,
      title: 'UV Index',
      value: uvIndex.value,
      subtitle: uvIndex.level,
      color: 'from-amber-500 to-red-500'
    },
    {
      icon: <Eye size={22} className="text-gray-300" />,
      title: 'Visibility',
      value: `${visibilityValue} ${visibilityUnit}`,
      color: 'from-gray-500 to-slate-500'
    },
    {
      icon: <Sunrise size={22} className="text-orange-300" />,
      title: 'Sunrise',
      value: sunriseTime,
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Sunset size={22} className="text-red-300" />,
      title: 'Sunset',
      value: sunsetTime,
      color: 'from-red-500 to-pink-500'
    }
  ];
  
  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Weather Details</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {detailItems.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white bg-opacity-10 rounded-xl p-4 flex flex-col"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${item.color} mr-2`}>
                {item.icon}
              </div>
              <span className="text-white/80 text-sm">{item.title}</span>
            </div>
            <div className="text-white font-semibold text-lg mt-auto">{item.value}</div>
            {item.subtitle && (
              <div className="text-white/70 text-xs">{item.subtitle}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;