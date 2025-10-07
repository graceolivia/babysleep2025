import { useState, useEffect } from 'react';
import NapTimer from './components/NapTimer';
import ManualNapEntry from './components/ManualNapEntry';
import NapTimeline from './components/NapTimeline';
import NextNapPrediction from './components/NextNapPrediction';
import CurrentTime from './components/CurrentTime';
import { getNapsForDate } from './utils/storage';

function App() {
  const [todaysNaps, setTodaysNaps] = useState([]);
  const [babyAgeMonths, setBabyAgeMonths] = useState(3);

  const loadTodaysNaps = () => {
    const today = new Date();
    const naps = getNapsForDate(today);
    setTodaysNaps(naps.sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  useEffect(() => {
    loadTodaysNaps();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Baby Sleep Tracker</h1>
          <div className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Age Setting */}
        <div className="mb-6 p-3 bg-white rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baby's Age (months)
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={babyAgeMonths}
            onChange={(e) => setBabyAgeMonths(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Current Time & Next Nap Prediction */}
        <div className="mb-6">
          <CurrentTime />
          <NextNapPrediction naps={todaysNaps} babyAgeMonths={babyAgeMonths} />
        </div>

        {/* Main Timer */}
        <div className="mb-6 flex justify-center">
          <NapTimer onNapAdded={loadTodaysNaps} />
        </div>

        {/* Manual Entry */}
        <div className="mb-6 text-center">
          <ManualNapEntry onNapAdded={loadTodaysNaps} />
        </div>

        {/* Timeline */}
        <NapTimeline naps={todaysNaps} onNapDeleted={loadTodaysNaps} />
      </div>
    </div>
  );
}

export default App;