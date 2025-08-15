import type { ForecastData } from '../types';

export const getWeatherBackground = (condition: string, isDay: boolean): string => {
  // These classes apply gradients and colors based on weather and time
  switch (condition.toLowerCase()) {
    case 'clear':
      return isDay 
        ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
        : 'bg-gradient-to-br from-blue-900 to-indigo-950';
    case 'clouds':
      return isDay 
        ? 'bg-gradient-to-br from-blue-300 to-slate-500' 
        : 'bg-gradient-to-br from-slate-800 to-slate-950';
    case 'rain':
    case 'drizzle':
      return isDay 
        ? 'bg-gradient-to-br from-slate-400 to-slate-600' 
        : 'bg-gradient-to-br from-slate-700 to-slate-900';
    case 'thunderstorm':
      return 'bg-gradient-to-br from-slate-600 to-slate-900';
    case 'snow':
      return isDay 
        ? 'bg-gradient-to-br from-blue-100 to-blue-300' 
        : 'bg-gradient-to-br from-blue-800 to-blue-950';
    case 'mist':
    case 'fog':
    case 'haze':
      return isDay 
        ? 'bg-gradient-to-br from-gray-300 to-gray-500' 
        : 'bg-gradient-to-br from-gray-700 to-gray-900';
    default:
      return isDay 
        ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
        : 'bg-gradient-to-br from-blue-800 to-indigo-950';
  }
};

export const getUVIndex = (weatherId: number): { value: string; level: string } => {
  // Mock UV index based on weather condition
  // In a real app, this would come from a separate API call
  if (weatherId >= 800 && weatherId <= 801) {
    // Clear or few clouds
    return { value: '8', level: 'Very High' };
  } else if (weatherId >= 802 && weatherId <= 804) {
    // Cloudy
    return { value: '4', level: 'Moderate' };
  } else if (weatherId >= 700 && weatherId <= 781) {
    // Atmosphere (fog, haze, etc.)
    return { value: '3', level: 'Low' };
  } else if (weatherId >= 600 && weatherId <= 622) {
    // Snow
    return { value: '2', level: 'Low' };
  } else if (weatherId >= 500 && weatherId <= 531) {
    // Rain
    return { value: '1', level: 'Low' };
  } else {
    return { value: '0', level: 'Low' };
  }
};

export const getDailyForecast = (forecast: ForecastData) => {
  const dailyData: any[] = [];
  const groupedByDay: Record<string, any[]> = {};
  
  // Group forecast items by day
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0];
    
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    
    groupedByDay[day].push(item);
  });
  
  // Process each day's data
  Object.entries(groupedByDay).forEach(([date, items]) => {
    const temps = items.map(item => item.main.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    
    // Calculate averages
    const avgHumidity = Math.round(
      items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length
    );
    
    const avgWind = items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length;
    
    // Get the highest precipitation chance
    const precipitation = Math.max(...items.map(item => item.pop || 0));
    
    // Get the most frequent weather condition for the day
    const weatherCounts: Record<string, number> = {};
    let mostFrequentWeather = items[0].weather[0];
    
    items.forEach(item => {
      const weatherId = item.weather[0].id;
      weatherCounts[weatherId] = (weatherCounts[weatherId] || 0) + 1;
      
      if (weatherCounts[weatherId] > (weatherCounts[mostFrequentWeather.id] || 0)) {
        mostFrequentWeather = item.weather[0];
      }
    });
    
    // Find the noon time icon for the day (or closest to it)
    const noon = new Date(`${date}T12:00:00`);
    const noonTimestamp = noon.getTime() / 1000;
    let closestToNoon = items[0];
    let minDiff = Math.abs(items[0].dt - noonTimestamp);
    
    items.forEach(item => {
      const diff = Math.abs(item.dt - noonTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestToNoon = item;
      }
    });
    
    dailyData.push({
      date,
      maxTemp,
      minTemp,
      avgHumidity,
      avgWind,
      precipitation,
      weather: mostFrequentWeather,
      icon: closestToNoon.weather[0].icon,
      hourly: items
    });
  });
  
  // Sort by date
  return dailyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};