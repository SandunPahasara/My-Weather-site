import React, { createContext, useState, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchWeatherData, fetchForecast, fetchLocationByCoords } from '../services/weatherService';
import type { WeatherData, ForecastData, Location } from '../types';

interface WeatherContextType {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  location: Location;
  isLoading: boolean;
  error: Error | null;
  setLocation: (location: Location) => void;
  units: 'metric' | 'imperial';
  toggleUnits: () => void;
  recentLocations: Location[];
  addToRecentLocations: (location: Location) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location>({ name: 'New York', lat: 40.7128, lon: -74.0060 });
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [recentLocations, setRecentLocations] = useState<Location[]>([]);

  // Get user's location on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationData = await fetchLocationByCoords(latitude, longitude);
            if (locationData) {
              setLocation(locationData);
            }
          } catch (error) {
            console.error('Error getting location:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Fetch current weather
  const { 
    data: currentWeather, 
    isLoading: isLoadingCurrent, 
    error: currentError 
  } = useQuery(
    ['currentWeather', location.lat, location.lon, units],
    () => fetchWeatherData(location.lat, location.lon, units),
    { enabled: !!location, staleTime: 1000 * 60 * 10 } // 10 minutes
  );

  // Fetch forecast
  const { 
    data: forecast, 
    isLoading: isLoadingForecast, 
    error: forecastError 
  } = useQuery(
    ['forecast', location.lat, location.lon, units],
    () => fetchForecast(location.lat, location.lon, units),
    { enabled: !!location, staleTime: 1000 * 60 * 10 } // 10 minutes
  );

  const toggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  const addToRecentLocations = (newLocation: Location) => {
    setRecentLocations(prev => {
      // Check if location already exists
      const exists = prev.some(loc => loc.name === newLocation.name);
      if (exists) return prev;
      
      // Add new location and keep only last 5 locations
      const updated = [newLocation, ...prev].slice(0, 5);
      return updated;
    });
  };

  const isLoading = isLoadingCurrent || isLoadingForecast;
  const error = currentError || forecastError;

  return (
    <WeatherContext.Provider value={{
      currentWeather,
      forecast,
      location,
      setLocation,
      isLoading,
      error: error as Error,
      units,
      toggleUnits,
      recentLocations,
      addToRecentLocations
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};