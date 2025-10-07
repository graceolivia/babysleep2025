import { useState, useEffect } from 'react';

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mb-3">
      <div className="text-sm text-gray-500">Current time</div>
      <div className="text-lg font-medium text-gray-700">{currentTime}</div>
    </div>
  );
}