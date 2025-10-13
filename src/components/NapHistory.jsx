import { useState, useEffect } from 'react';
import { getAllNapsByDate, deleteNap } from '../utils/storage';

export default function NapHistory({ onNapDeleted }) {
  const [napsByDate, setNapsByDate] = useState({});
  const [showHistory, setShowHistory] = useState(false);

  const loadNapHistory = () => {
    const allNaps = getAllNapsByDate();
    setNapsByDate(allNaps);
  };

  useEffect(() => {
    loadNapHistory();
  }, []);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (dateString === today) return 'Today';
    if (dateString === yesterday) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDeleteNap = (napId) => {
    if (confirm('Delete this nap?')) {
      deleteNap(napId);
      loadNapHistory();
      onNapDeleted();
    }
  };

  const dates = Object.keys(napsByDate).sort().reverse();
  const hasHistory = dates.length > 0;

  if (!hasHistory) {
    return (
      <div className="mt-6 text-center text-gray-500">
        No nap history yet
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="w-full text-left text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between"
      >
        <span>Nap History</span>
        <span className="text-sm text-gray-500">
          {showHistory ? '▼' : '▶'} {dates.length} {dates.length === 1 ? 'day' : 'days'}
        </span>
      </button>

      {showHistory && (
        <div className="space-y-6">
          {dates.map(date => (
            <div key={date} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                <span>{formatDate(date)}</span>
                <span className="text-sm text-gray-500">
                  {napsByDate[date].length} {napsByDate[date].length === 1 ? 'nap' : 'naps'}
                </span>
              </h3>
              
              <div className="space-y-2">
                {napsByDate[date].map((nap) => (
                  <div key={nap.id} className="bg-white p-3 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">
                          {formatTime(nap.startTime)} - {formatTime(nap.endTime)}
                        </span>
                        <div className="text-blue-600 font-semibold">
                          {formatDuration(nap.duration)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNap(nap.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg px-2"
                        title="Delete nap"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}