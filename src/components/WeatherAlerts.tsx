import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'severe' | 'info';
}

const WeatherAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchWeatherAlerts = async () => {
    try {
      const lat = "6.9271"; // Example: Colombo latitude
      const lon = "79.8612"; // Example: Colombo longitude
      const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";

      const res = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      if (data.alerts && data.alerts.length > 0) {
        const mappedAlerts: Alert[] = data.alerts.map((a: any, index: number) => ({
          id: `${index}`,
          title: a.event,
          description: a.description,
          type: a.severity && a.severity.includes("Severe") ? 'severe' : 'warning'
        }));
        setAlerts(mappedAlerts);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error("Error fetching weather alerts:", error);
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  useEffect(() => {
    fetchWeatherAlerts();
  }, []);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl p-4 mb-4 flex items-start ${
              alert.type === 'severe' ? 'bg-red-600/80' :
              alert.type === 'warning' ? 'bg-amber-600/80' :
              'bg-blue-600/80'
            } backdrop-blur-md`}
          >
            <AlertTriangle size={20} className="text-white mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{alert.title}</h3>
              <p className="text-white/90 text-sm mt-1">{alert.description}</p>
            </div>
            <button 
              onClick={() => dismissAlert(alert.id)}
              className="text-white/80 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WeatherAlerts;
