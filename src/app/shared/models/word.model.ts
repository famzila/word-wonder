export interface Word {
  id: string;
  original: string;
  translation: string;
  pronunciation?: string; // e.g. /kæt/
  audioUrl?: string;
  imageUrl?: string;
  type?: 'noun' | 'verb' | 'adjective' | 'other';
  syllables?: string[]; // ['cat']
}

export interface Story {
  id: string;
  title: string;
  content: string;
  thumbnailUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  themeColor?: string; // e.g. 'bg-red-100 text-red-500'
  languageCode?: string; // e.g. 'en-US', 'fr', 'es'
}
