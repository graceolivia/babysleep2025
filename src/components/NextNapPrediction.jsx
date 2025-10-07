import { useState, useEffect } from 'react';
import { predictNextNap, formatTimeRange } from '../utils/napPrediction';

export default function NextNapPrediction({ naps, babyAgeMonths = 3 }) {
  const [countdown, setCountdown] = useState('');
  const prediction = predictNextNap(naps, babyAgeMonths);
  const timeRange = formatTimeRange(prediction.startTime, prediction.endTime);
  
  const now = new Date();
  const isPastWindow = now > prediction.endTime;
  const isInWindow = now >= prediction.startTime && now <= prediction.endTime;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = prediction.startTime - now;
      
      if (timeDiff <= 0) {
        setCountdown('');
        return;
      }
      
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setCountdown(`in ${hours}h ${minutes}m`);
      } else {
        setCountdown(`in ${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [prediction.startTime]);
  
  return (
    <div className={`p-4 rounded-lg text-center ${
      isPastWindow 
        ? 'bg-red-50 border border-red-200' 
        : isInWindow 
          ? 'bg-green-50 border border-green-200'
          : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="text-sm text-gray-600 mb-1">
        {prediction.isFirstNap ? 'First nap' : 'Next nap'}
        {countdown && <span className="text-blue-600 font-medium"> {countdown}</span>}
      </div>
      <div className="text-lg font-semibold text-gray-800">
        {timeRange}
      </div>
      {isInWindow && (
        <div className="text-sm text-green-600 font-medium mt-1">
          Nap window is now!
        </div>
      )}
      {isPastWindow && (
        <div className="text-sm text-red-600 font-medium mt-1">
          Nap window has passed
        </div>
      )}
    </div>
  );
}