import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';

const UnitToggle: React.FC = () => {
  const { units, toggleUnits } = useWeather();
  
  return (
    <motion.div 
      className="bg-white bg-opacity-20 rounded-full p-1 flex"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <button
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
          units === 'metric' 
            ? 'bg-white text-slate-800' 
            : 'text-white hover:bg-white/10'
        }`}
        onClick={() => units === 'imperial' && toggleUnits()}
      >
        °C
      </button>
      <button
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
          units === 'imperial' 
            ? 'bg-white text-slate-800' 
            : 'text-white hover:bg-white/10'
        }`}
        onClick={() => units === 'metric' && toggleUnits()}
      >
        °F
      </button>
    </motion.div>
  );
};

export default UnitToggle;