import { useState } from 'react';
import { addNap } from '../utils/storage';

export default function ManualNapEntry({ onNapAdded }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [napDate, setNapDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startTime || !endTime || !napDate) return;

    const start = new Date(`${napDate}T${startTime}`);
    const end = new Date(`${napDate}T${endTime}`);
    
    if (end <= start) {
      alert('End time must be after start time');
      return;
    }

    const nap = {
      id: Date.now(),
      date: napDate,
      startTime,
      endTime,
      duration: end - start
    };

    addNap(nap);
    onNapAdded();
    setStartTime('');
    setEndTime('');
    setNapDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  return (
    <div className="mt-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Add Manual Entry
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Manual Nap Entry</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={napDate}
                onChange={(e) => setNapDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Nap
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}