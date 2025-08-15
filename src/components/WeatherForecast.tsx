import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import WeatherIcon from './WeatherIcon';
import { format } from 'date-fns';
import { getDailyForecast } from '../utils/weatherUtils';

const WeatherForecast: React.FC = () => {
  const { forecast, units } = useWeather();
  const [activeForecastIndex, setActiveForecastIndex] = useState(0);
  
  if (!forecast) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">5-Day Forecast</h2>
        <div className="animate-pulse">
          <div className="flex justify-between mb-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-20 bg-white bg-opacity-20 rounded w-16"></div>
            ))}
          </div>
          <div className="h-40 bg-white bg-opacity-20 rounded"></div>
        </div>
      </div>
    );
  }
  
  const dailyForecasts = getDailyForecast(forecast);
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const selectedDay = dailyForecasts[activeForecastIndex];
  
  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">5-Day Forecast</h2>
      
      <div className="flex justify-between mb-6 overflow-x-auto pb-2">
        {dailyForecasts.map((day, index) => (
          <motion.div
            key={index}
            className={`flex flex-col items-center px-2 py-3 rounded-xl cursor-pointer min-w-[80px] ${
              index === activeForecastIndex 
                ? 'bg-white bg-opacity-30' 
                : 'hover:bg-white hover:bg-opacity-10'
            }`}
            onClick={() => setActiveForecastIndex(index)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-white font-medium">
              {format(new Date(day.date), 'EEE')}
            </div>
            <WeatherIcon icon={day.icon} size={36} />
            <div className="text-white mt-1">
              {Math.round(day.maxTemp)}{tempUnit}
            </div>
            <div className="text-white/70 text-sm">
              {Math.round(day.minTemp)}{tempUnit}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="bg-white bg-opacity-10 rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={activeForecastIndex}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-white mb-3">
          {format(new Date(selectedDay.date), 'EEEE, MMMM d')}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {selectedDay.hourly.slice(0, 8).map((hour, index) => (
            <div 
              key={index} 
              className="bg-white bg-opacity-10 rounded-xl p-3 text-center"
            >
              <div className="text-white text-sm mb-1">
                {format(new Date(hour.dt * 1000), 'h a')}
              </div>
              <WeatherIcon icon={hour.weather[0].icon} size={28} />
              <div className="text-white font-medium">
                {Math.round(hour.main.temp)}{tempUnit}
              </div>
              <div className="text-white/70 text-xs capitalize">
                {hour.weather[0].description}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-10 rounded-xl p-3">
            <div className="text-white/80 text-sm mb-1">Humidity</div>
            <div className="text-white font-medium flex items-center justify-between">
              <span>Average</span>
              <span>{selectedDay.avgHumidity}%</span>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-xl p-3">
            <div className="text-white/80 text-sm mb-1">Wind</div>
            <div className="text-white font-medium flex items-center justify-between">
              <span>Average</span>
              <span>{selectedDay.avgWind.toFixed(1)} {units === 'metric' ? 'm/s' : 'mph'}</span>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-xl p-3">
            <div className="text-white/80 text-sm mb-1">Precipitation</div>
            <div className="text-white font-medium flex items-center justify-between">
              <span>Chance</span>
              <span>{Math.round(selectedDay.precipitation * 100)}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherForecast;