import { computed, effect, inject, Injectable } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Word } from '../../shared/models/word.model';

export interface FavoriteWord extends Word {
  languageCode: string; // Required for TTS
  addedAt: Date;
  sourceStoryId?: string;
  // inherited from Word: id, original, translation, pronunciation, etc.
}

type FavoritesState = {
  words: FavoriteWord[];
};

const STORAGE_KEY = 'word_wonder_favorites';

const initialState: FavoritesState = {
  words: []
};

export const FavoritesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    count: computed(() => store.words().length),
    isFavorite: computed(() => (id: string) => store.words().some((w) => w.id === id)),
  })),
  withMethods((store) => ({
    add(word: Word, languageCode: string, sourceStoryId?: string) {
      // Create a unique ID for the favorite
      // Use language code + original word (lowercase) to prevent duplicates across similar words in same language
      const favoriteId = `${languageCode}-${word.original.toLowerCase()}`;
      
      const newFavorite: FavoriteWord = {
        ...word,
        id: favoriteId, // Override the ID with our composite unique ID
        languageCode,
        addedAt: new Date(),
        sourceStoryId
      };

      // Check if already exists to prevent duplicates (idempotency)
      const exists = store.words().some(w => w.id === favoriteId);
      if (!exists) {
        patchState(store, (state) => ({ words: [...state.words, newFavorite] }));
      }
    },

    remove(wordId: string) {
      patchState(store, (state) => ({
        words: state.words.filter((w) => w.id !== wordId)
      }));
    },

    toggle(word: Word, languageCode: string, sourceStoryId?: string) {
       const favoriteId = `${languageCode}-${word.original.toLowerCase()}`;
       const exists = store.words().some(w => w.id === favoriteId);
       
       if (exists) {
         this.remove(favoriteId);
       } else {
         this.add(word, languageCode, sourceStoryId);
       }
    }
  })),
  withHooks({
    onInit(store) {
      // Load from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const words = JSON.parse(stored);
          patchState(store, { words });
        } catch (e) {
          console.error('Failed to parse favorites from localStorage', e);
        }
      }
      
      // Sync to localStorage on change
      effect(() => {
        const words = store.words();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
      });
    }
  })
);
