import { deleteNap } from '../utils/storage';

export default function NapTimeline({ naps, onNapDeleted }) {
  const timeToPosition = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 100;
  };

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

  const handleDeleteNap = (napId) => {
    if (confirm('Delete this nap?')) {
      deleteNap(napId);
      onNapDeleted();
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Today's Naps</h3>
      
      <div className="relative bg-gray-100 h-16 rounded-lg overflow-hidden">
        {/* Hour markers */}
        {[0, 6, 12, 18, 24].map(hour => (
          <div
            key={hour}
            className="absolute top-0 bottom-0 w-px bg-gray-300"
            style={{ left: `${(hour / 24) * 100}%` }}
          >
            <span className="absolute -bottom-6 text-xs text-gray-500 transform -translate-x-1/2">
              {hour === 0 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour-12}pm` : `${hour}am`}
            </span>
          </div>
        ))}

        {/* Nap blocks */}
        {naps.map((nap) => {
          const start = timeToPosition(nap.startTime);
          const end = timeToPosition(nap.endTime);
          const width = end - start;
          
          return (
            <div
              key={nap.id}
              className="absolute top-2 bottom-2 bg-blue-500 rounded opacity-80 hover:opacity-100 transition-opacity"
              style={{
                left: `${start}%`,
                width: `${width}%`
              }}
              title={`${formatTime(nap.startTime)} - ${formatTime(nap.endTime)} (${formatDuration(nap.duration)})`}
            >
              <div className="text-xs text-white font-medium p-1 truncate">
                {formatDuration(nap.duration)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nap list */}
      {naps.length > 0 && (
        <div className="mt-4 space-y-2">
          {naps.map((nap) => (
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
      )}

      {naps.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No naps recorded today
        </div>
      )}
    </div>
  );
}