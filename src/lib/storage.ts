const LIKED_KEY = 'confessly_liked';
const SAVED_KEY = 'confessly_saved';

export const getLikedConfessions = (): string[] => {
  try {
    const liked = localStorage.getItem(LIKED_KEY);
    return liked ? JSON.parse(liked) : [];
  } catch {
    return [];
  }
};

export const addLikedConfession = (id: string): void => {
  const liked = getLikedConfessions();
  if (!liked.includes(id)) {
    liked.push(id);
    localStorage.setItem(LIKED_KEY, JSON.stringify(liked));
  }
};

export const removeLikedConfession = (id: string): void => {
  const liked = getLikedConfessions();
  const filtered = liked.filter(l => l !== id);
  localStorage.setItem(LIKED_KEY, JSON.stringify(filtered));
};

export const isConfessionLiked = (id: string): boolean => {
  return getLikedConfessions().includes(id);
};

export const getSavedConfessions = (): string[] => {
  try {
    const saved = localStorage.getItem(SAVED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const addSavedConfession = (id: string): void => {
  const saved = getSavedConfessions();
  if (!saved.includes(id)) {
    saved.push(id);
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }
};

export const removeSavedConfession = (id: string): void => {
  const saved = getSavedConfessions();
  const filtered = saved.filter(s => s !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(filtered));
};

export const isConfessionSaved = (id: string): boolean => {
  return getSavedConfessions().includes(id);
};
