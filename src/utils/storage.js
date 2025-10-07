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