const STORAGE_KEY = 'baby-naps';

export const saveNaps = (naps) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(naps));
};

export const loadNaps = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addNap = (nap) => {
  const naps = loadNaps();
  naps.push(nap);
  saveNaps(naps);
  return naps;
};

export const getNapsForDate = (date) => {
  const naps = loadNaps();
  const dateStr = date.toISOString().split('T')[0];
  return naps.filter(nap => nap.date === dateStr);
};

export const deleteNap = (napId) => {
  const naps = loadNaps();
  const updatedNaps = naps.filter(nap => nap.id !== napId);
  saveNaps(updatedNaps);
  return updatedNaps;
};

export const getAllNapsByDate = () => {
  const naps = loadNaps();
  const napsByDate = {};
  
  naps.forEach(nap => {
    if (!napsByDate[nap.date]) {
      napsByDate[nap.date] = [];
    }
    napsByDate[nap.date].push(nap);
  });
  
  // Sort naps within each day by start time
  Object.keys(napsByDate).forEach(date => {
    napsByDate[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });
  
  return napsByDate;
};

export const getUniqueDates = () => {
  const naps = loadNaps();
  const dates = [...new Set(naps.map(nap => nap.date))];
  return dates.sort().reverse(); // Most recent first
};