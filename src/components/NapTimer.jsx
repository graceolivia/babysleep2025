import { useState, useEffect } from 'react';
import { addNap } from '../utils/storage';
import SleepingBabyAnimation from './SleepingBabyAnimation';
import AwakeBabyAnimation from './AwakeBabyAnimation';

export default function NapTimer({ onNapAdded }) {
  const [isNapping, setIsNapping] = useState(false);
  const [napStartTime, setNapStartTime] = useState(null);
  const [napDuration, setNapDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (isNapping && napStartTime) {
      interval = setInterval(() => {
        setNapDuration(Date.now() - napStartTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isNapping, napStartTime]);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleNap = () => {
    if (isNapping) {
      const endTime = new Date();
      const nap = {
        id: Date.now(),
        date: napStartTime.toISOString().split('T')[0],
        startTime: napStartTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        duration: napDuration
      };
      addNap(nap);
      onNapAdded();
      setIsNapping(false);
      setNapStartTime(null);
      setNapDuration(0);
    } else {
      setIsNapping(true);
      setNapStartTime(new Date());
      setNapDuration(0);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={toggleNap}
        className={`px-8 py-4 text-lg font-bold text-white rounded-lg mb-6 ${
          isNapping 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isNapping ? 'Baby Awake' : 'Baby Asleep'}
      </button>
      
      <div className="flex justify-center">
        {isNapping ? <SleepingBabyAnimation /> : <AwakeBabyAnimation />}
      </div>
      
      {isNapping && (
        <div className="mt-4 text-xl font-semibold text-gray-700">
          {formatDuration(napDuration)}
        </div>
      )}
    </div>
  );
}