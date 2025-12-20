import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, map } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { GeminiService } from '../../core/services/gemini.service';
import { ImageService } from '../../core/services/image.service';

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
  
  // Word Detail State
  selectedWordDefinition: string | null;
  selectedWordImage: string | null;
  isWordLoading: boolean;
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
  selectedWordDefinition: null,
  selectedWordImage: null,
  isWordLoading: false,
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
        mispronuncedWords: [],
        selectedWordDefinition: null,
        selectedWordImage: null,
        isWordLoading: false
      });
    }
  })),
  withMethods((store) => {
      const geminiService = inject(GeminiService);
      const imageService = inject(ImageService);

      return {
          async loadWordDetails(word: string, context: string, lang: string) {
              patchState(store, { isWordLoading: true, selectedWordDefinition: null, selectedWordImage: null });
              
              try {
                  // 1. Get Definition and Query
                  const details = await geminiService.generateWordDetails(word, context, lang);
                  patchState(store, { selectedWordDefinition: details.definition });

                  // 2. Get Image if query exists
                  if (details.imageSearchQuery) {
                      imageService.searchImage(details.imageSearchQuery).subscribe({
                          next: (url) => patchState(store, { selectedWordImage: url, isWordLoading: false }),
                          error: () => patchState(store, { isWordLoading: false })
                      });
                  } else {
                      patchState(store, { isWordLoading: false });
                  }

              } catch (err) {
                  console.error(err);
                  patchState(store, { 
                      isWordLoading: false, 
                      selectedWordDefinition: 'Definition unavailable.' 
                  });
              }
          }
      };
  })
);
