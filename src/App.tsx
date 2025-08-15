import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import WeatherDashboard from './components/WeatherDashboard';
import { WeatherProvider } from './context/WeatherContext';
import LoadingScreen from './components/LoadingScreen';

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WeatherProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <WeatherDashboard />
          )}
        </div>
      </WeatherProvider>
    </QueryClientProvider>
  );
}

export default App;