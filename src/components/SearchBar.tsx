import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { searchLocation } from '../services/weatherService';
import type { Location } from '../types';

interface SearchBarProps {
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const { setLocation, recentLocations, addToRecentLocations } = useWeather();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        setError(null);
        try {
          const locations = await searchLocation(query);
          setResults(locations);
          if (locations.length === 0) {
            setError('No locations found. Try a different search term.');
          }
        } catch (error) {
          console.error('Error searching locations:', error);
          setError('Failed to search locations. Please try again.');
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setError(null);
      }
    }, 500);
    
    return () => clearTimeout(searchTimer);
  }, [query]);
  
  const handleSelectLocation = (location: Location) => {
    setLocation(location);
    addToRecentLocations(location);
    setQuery('');
    setResults([]);
    setIsSearching(false);
    onClose();
  };
  
  return (
    <div ref={searchRef} className="relative">
      <motion.div 
        className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl p-6 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4">
          <Search size={20} className="text-white mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            placeholder="Search for any city in the world..."
            className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/70"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white">
              <X size={18} />
            </button>
          )}
        </div>
        
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {recentLocations.length > 0 && !query && (
                <>
                  <h3 className="text-white/80 text-sm mb-2">Recent Locations</h3>
                  <div className="space-y-2 mb-4">
                    {recentLocations.map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl p-3 cursor-pointer transition-colors duration-200"
                        onClick={() => handleSelectLocation(location)}
                      >
                        <MapPin size={16} className="text-white/80 mr-2" />
                        <span className="text-white">{location.name}</span>
                        {location.state && (
                          <span className="text-white/70 ml-1">, {location.state}</span>
                        )}
                        {location.country && (
                          <span className="text-white/70 ml-1">, {location.country}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {isLoading && (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                </div>
              )}
              
              {results.length > 0 && (
                <>
                  <h3 className="text-white/80 text-sm mb-2">Search Results</h3>
                  <div className="space-y-2">
                    {results.map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl p-3 cursor-pointer transition-colors duration-200"
                        onClick={() => handleSelectLocation(location)}
                      >
                        <MapPin size={16} className="text-white/80 mr-2" />
                        <span className="text-white">{location.name}</span>
                        {location.state && (
                          <span className="text-white/70 ml-1">, {location.state}</span>
                        )}
                        {location.country && (
                          <span className="text-white/70 ml-1">, {location.country}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {error && (
                <div className="text-white/80 text-center py-4">
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchBar;