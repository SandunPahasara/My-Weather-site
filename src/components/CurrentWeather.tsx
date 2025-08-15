import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Droplets, Wind, ArrowUp, ArrowDown } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { formatDate } from '../utils/dateUtils';
import WeatherIcon from './WeatherIcon';
import UnitToggle from './UnitToggle';

const CurrentWeather: React.FC = () => {
  const { currentWeather, location, units } = useWeather();
  
  if (!currentWeather) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl p-6 shadow-lg h-full">
        <div className="animate-pulse">
          <div className="h-6 bg-white bg-opacity-20 rounded w-3/4 mb-4"></div>
          <div className="h-20 bg-white bg-opacity-20 rounded mb-4"></div>
          <div className="h-6 bg-white bg-opacity-20 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-white bg-opacity-20 rounded w-2/3 mb-4"></div>
          <div className="h-6 bg-white bg-opacity-20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';
  const temp = Math.round(currentWeather.main.temp);
  const feelsLike = Math.round(currentWeather.main.feels_like);
  const tempMin = Math.round(currentWeather.main.temp_min);
  const tempMax = Math.round(currentWeather.main.temp_max);
  const weatherCondition = currentWeather.weather[0].main;
  const weatherDescription = currentWeather.weather[0].description;
  const icon = currentWeather.weather[0].icon;
  
  const today = formatDate(new Date());
  
  return (
    <motion.div 
      className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl p-6 shadow-lg h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">{today}</h2>
          <div className="flex items-center text-white/90">
            <MapPin size={16} className="mr-1" />
            <span>{location.name}, {currentWeather.sys.country}</span>
          </div>
        </div>
        <UnitToggle />
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div className="text-white">
          <div className="text-7xl font-bold mb-2">{temp}{tempUnit}</div>
          <div className="text-white/90">Feels like {feelsLike}{tempUnit}</div>
        </div>
        <div className="text-right">
          <WeatherIcon icon={icon} size={80} />
          <div className="text-lg text-white capitalize mt-2">{weatherDescription}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-white">
        <div className="flex items-center bg-white/10 rounded-xl p-3">
          <ArrowUp className="mr-2 text-white/80" size={18} />
          <div>
            <div className="text-white/80 text-sm">High</div>
            <div className="font-semibold">{tempMax}{tempUnit}</div>
          </div>
        </div>
        
        <div className="flex items-center bg-white/10 rounded-xl p-3">
          <ArrowDown className="mr-2 text-white/80" size={18} />
          <div>
            <div className="text-white/80 text-sm">Low</div>
            <div className="font-semibold">{tempMin}{tempUnit}</div>
          </div>
        </div>
        
        <div className="flex items-center bg-white/10 rounded-xl p-3">
          <Droplets className="mr-2 text-white/80" size={18} />
          <div>
            <div className="text-white/80 text-sm">Humidity</div>
            <div className="font-semibold">{currentWeather.main.humidity}%</div>
          </div>
        </div>
        
        <div className="flex items-center bg-white/10 rounded-xl p-3">
          <Wind className="mr-2 text-white/80" size={18} />
          <div>
            <div className="text-white/80 text-sm">Wind</div>
            <div className="font-semibold">{currentWeather.wind.speed} {windUnit}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;