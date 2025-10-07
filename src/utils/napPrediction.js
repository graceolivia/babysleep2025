import wakeWindowsData from '../wake-windows.json';

export const getWakeWindowForAge = (ageInMonths) => {
  const windows = wakeWindowsData.wake_windows;
  
  // Find the closest age match
  const closestWindow = windows.reduce((prev, curr) => {
    return Math.abs(curr.age_months - ageInMonths) < Math.abs(prev.age_months - ageInMonths)
      ? curr
      : prev;
  });
  
  return closestWindow;
};

export const predictNextNap = (naps, ageInMonths = 3) => {
  if (naps.length === 0) {
    // If no naps today, suggest first nap based on typical morning routine
    const now = new Date();
    const firstNapStart = new Date(now);
    firstNapStart.setHours(9, 0, 0, 0); // 9 AM default first nap
    
    const wakeWindow = getWakeWindowForAge(ageInMonths);
    const firstNapEnd = new Date(firstNapStart);
    firstNapEnd.setMinutes(firstNapEnd.getMinutes() + wakeWindow.max_minutes);
    
    return {
      startTime: firstNapStart,
      endTime: firstNapEnd,
      isFirstNap: true
    };
  }

  // Get the last nap
  const lastNap = naps[naps.length - 1];
  const [endHours, endMinutes] = lastNap.endTime.split(':').map(Number);
  
  const today = new Date();
  const lastNapEnd = new Date(today);
  lastNapEnd.setHours(endHours, endMinutes, 0, 0);
  
  const wakeWindow = getWakeWindowForAge(ageInMonths);
  
  // Calculate next nap window
  const nextNapStart = new Date(lastNapEnd);
  nextNapStart.setMinutes(nextNapStart.getMinutes() + wakeWindow.min_minutes);
  
  const nextNapEnd = new Date(lastNapEnd);
  nextNapEnd.setMinutes(nextNapEnd.getMinutes() + wakeWindow.max_minutes);
  
  return {
    startTime: nextNapStart,
    endTime: nextNapEnd,
    isFirstNap: false
  };
};

export const formatTimeRange = (startTime, endTime) => {
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
  };
  
  return `${formatTime(startTime)}–${formatTime(endTime)}`;
};