export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Weather[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf?: number;
  };
  weather: Weather[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h'?: number;
  };
  snow?: {
    '3h'?: number;
  };
  sys: {
    pod: string; // 'd' for day, 'n' for night
  };
  dt_txt: string;
}

export interface Location {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

export interface AlertData {
  id: string;
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}