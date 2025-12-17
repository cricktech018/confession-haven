export const MOODS = [
  { value: 'happy', emoji: '😄', label: 'Happy', color: 'mood-happy' },
  { value: 'sad', emoji: '😔', label: 'Sad', color: 'mood-sad' },
  { value: 'angry', emoji: '😡', label: 'Angry', color: 'mood-angry' },
  { value: 'numb', emoji: '😶', label: 'Numb', color: 'mood-numb' },
  { value: 'love', emoji: '❤️', label: 'Love', color: 'mood-love' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', color: 'mood-anxious' },
  { value: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'mood-frustrated' },
  { value: 'peaceful', emoji: '😌', label: 'Peaceful', color: 'mood-peaceful' },
] as const;

export const PREDEFINED_TAGS = [
  'love',
  'college',
  'family',
  'career',
  'friendship',
  'mental health',
  'regret',
  'hope',
] as const;

export const MAX_CONFESSION_LENGTH = 300;
export const MAX_COMMENT_LENGTH = 150;

export type MoodType = typeof MOODS[number]['value'];

export const getMoodByValue = (value: string) => 
  MOODS.find(m => m.value === value) || MOODS[0];

export const getMoodColor = (mood: string): string => {
  const moodMap: Record<string, string> = {
    happy: 'text-mood-happy',
    sad: 'text-mood-sad',
    angry: 'text-mood-angry',
    numb: 'text-mood-numb',
    love: 'text-mood-love',
    anxious: 'text-mood-anxious',
    frustrated: 'text-mood-frustrated',
    peaceful: 'text-mood-peaceful',
  };
  return moodMap[mood] || 'text-muted-foreground';
};

export const getMoodBgColor = (mood: string): string => {
  const moodMap: Record<string, string> = {
    happy: 'bg-mood-happy/20',
    sad: 'bg-mood-sad/20',
    angry: 'bg-mood-angry/20',
    numb: 'bg-mood-numb/20',
    love: 'bg-mood-love/20',
    anxious: 'bg-mood-anxious/20',
    frustrated: 'bg-mood-frustrated/20',
    peaceful: 'bg-mood-peaceful/20',
  };
  return moodMap[mood] || 'bg-muted';
};
