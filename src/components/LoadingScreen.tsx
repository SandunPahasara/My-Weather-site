import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex justify-center mb-6"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative">
            <Sun size={60} className="text-yellow-400" />
            <motion.div
              className="absolute -right-6 top-2"
              animate={{ 
                x: [0, 10, 0],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Cloud size={40} className="text-white" />
            </motion.div>
          </div>
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-2">Weather App</h1>
        <p className="text-white/80">Loading your forecast...</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;