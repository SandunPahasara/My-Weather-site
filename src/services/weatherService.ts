import axios from 'axios';
import type { WeatherData, ForecastData, Location } from '../types';

// Using OpenWeatherMap API
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const fetchWeatherData = async (
  lat: number, 
  lon: number, 
  units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchForecast = async (
  lat: number, 
  lon: number, 
  units: 'metric' | 'imperial' = 'metric'
): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

export const searchLocation = async (query: string): Promise<Location[]> => {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY
      }
    });
    return response.data.map((location: any) => ({
      name: location.name,
      lat: location.lat,
      lon: location.lon,
      country: location.country,
      state: location.state
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
};

export const fetchLocationByCoords = async (
  lat: number, 
  lon: number
): Promise<Location | null> => {
  try {
    const response = await axios.get(`${GEO_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
        appid: API_KEY
      }
    });
    
    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      return {
        name: location.name,
        lat: location.lat,
        lon: location.lon,
        country: location.country,
        state: location.state
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching location by coordinates:', error);
    throw error;
  }
};