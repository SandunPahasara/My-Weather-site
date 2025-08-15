import React from 'react';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudFog, 
  CloudLightning, CloudDrizzle, Cloudy
} from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  icon, 
  size = 24,
  className = ''
}) => {
  // OpenWeatherMap icon codes: https://openweathermap.org/weather-conditions
  // 01d, 01n: clear sky
  // 02d, 02n: few clouds
  // 03d, 03n: scattered clouds
  // 04d, 04n: broken clouds
  // 09d, 09n: shower rain
  // 10d, 10n: rain
  // 11d, 11n: thunderstorm
  // 13d, 13n: snow
  // 50d, 50n: mist

  const getIconByCode = (iconCode: string) => {
    const isDay = iconCode.endsWith('d');
    const baseCode = iconCode.substring(0, 2);
    
    // Customize colors based on day/night
    const sunColor = isDay ? 'text-yellow-400' : 'text-gray-200';
    const cloudColor = isDay ? 'text-gray-100' : 'text-gray-300';
    const rainColor = 'text-blue-400';
    const snowColor = 'text-blue-100';
    const thunderColor = 'text-yellow-300';
    const fogColor = 'text-gray-300';
    
    switch (baseCode) {
      case '01': // clear sky
        return <Sun size={size} className={`${sunColor} ${className}`} />;
      case '02': // few clouds
        return <Cloud size={size} className={`${cloudColor} ${className}`} />;
      case '03': // scattered clouds
      case '04': // broken clouds
        return <Cloudy size={size} className={`${cloudColor} ${className}`} />;
      case '09': // shower rain
        return <CloudDrizzle size={size} className={`${rainColor} ${className}`} />;
      case '10': // rain
        return <CloudRain size={size} className={`${rainColor} ${className}`} />;
      case '11': // thunderstorm
        return <CloudLightning size={size} className={`${thunderColor} ${className}`} />;
      case '13': // snow
        return <CloudSnow size={size} className={`${snowColor} ${className}`} />;
      case '50': // mist
        return <CloudFog size={size} className={`${fogColor} ${className}`} />;
      default:
        return <Sun size={size} className={`${sunColor} ${className}`} />;
    }
  };
  
  return getIconByCode(icon);
};

export default WeatherIcon;