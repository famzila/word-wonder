import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

type LearnMode = 'listen' | 'practice';

interface LearnState {
  mode: LearnMode;
  isPlaying: boolean;
  isRecording: boolean;
  currentWordIndex: number;
  playbackSpeed: number;
  transcript: string;
  text: string;
  languageCode: string; // Language code for TTS/STT (e.g., 'en-US', 'fr')
  mispronuncedWords: number[]; // Indices of words with pronunciation errors
}

const initialState: LearnState = {
  mode: 'listen',
  isPlaying: false,
  isRecording: false,
  currentWordIndex: -1, // -1 means no word highlighted
  playbackSpeed: 1.0,
  transcript: '',
  mispronuncedWords: [],
  languageCode: 'en-US', // Default language
  // Default text, this might be loaded from a service later
  text: 'The fluffy cat sat on the warm mat. It was a sunny day and the cat was happy. The cat liked to play with the red ball.', 
};

export const LearnStore = signalStore(
  withState(initialState),
  withComputed(({ mode }) => ({
    isListenMode: computed(() => mode() === 'listen'),
    isPracticeMode: computed(() => mode() === 'practice'),
  })),
  withMethods((store) => ({
    setMode(mode: LearnMode): void {
      patchState(store, { mode, isPlaying: false, isRecording: false, currentWordIndex: -1 });
    },
    setIsPlaying(isPlaying: boolean): void {
      patchState(store, { isPlaying });
      if (!isPlaying) {
         // Optionally reset or keep index? usually pause keeps index.
      }
    },
    setIsRecording(isRecording: boolean): void {
      patchState(store, { isRecording });
    },
    setCurrentWordIndex(index: number): void {
      patchState(store, { currentWordIndex: index });
    },
    setPlaybackSpeed(speed: number): void {
      patchState(store, { playbackSpeed: speed });
    },
    setTranscript(transcript: string): void {
      patchState(store, { transcript });
    },
    setMispronuncedWords(indices: number[]): void {
      patchState(store, { mispronuncedWords: indices });
    },
    setText(text: string, languageCode?: string): void {
      const updates: Partial<LearnState> = { text };
      if (languageCode) {
        updates.languageCode = languageCode;
      }
      patchState(store, updates);
    },
    reset(): void {
      patchState(store, { 
        isPlaying: false, 
        isRecording: false, 
        currentWordIndex: -1, 
        transcript: '',
        mispronuncedWords: []
      });
    }
  }))
);
