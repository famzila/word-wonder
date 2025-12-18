import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Story } from '../../shared/models/word.model';
import { OcrService } from '../services/ocr.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of, map } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type StoryState = {
  stories: Story[];
  currentStory: Story | null;
  ocrStatus: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
};

const initialState: StoryState = {
  stories: [
    {
      id: '1',
      title: 'La Petite Étoile',
      content: 'The fluffy cat sat on the warm mat. It was a sunny day and the cat was happy. The cat liked to play with the red ball.',
      difficulty: 'easy',
      themeColor: 'bg-red-100 text-red-500'
    },
    {
      id: '2',
      title: "Amis de l'Océan",
      content: 'Today we went to the zoo. We saw big elephants and tall giraffes. The monkeys were funny. They jumped from tree to tree.',
      difficulty: 'medium',
      themeColor: 'bg-cyan-100 text-cyan-600'
    },
    {
       id: '3',
       title: 'Magie du Jardin',
       content: 'In the magic garden, beautiful flowers bloom every day. The butterflies dance in the air. The birds sing sweet songs.',
       difficulty: 'hard',
       themeColor: 'bg-yellow-100 text-yellow-600'
    }
  ],
  currentStory: null,
  ocrStatus: 'idle',
  error: null
};

export const StoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, ocrService = inject(OcrService)) => ({
    
    setCurrentStory(story: Story | null) {
      patchState(store, { currentStory: story });
    },

    updateCurrentStoryText(text: string) {
      const current = store.currentStory();
      if (current) {
        patchState(store, {
          currentStory: { ...current, content: text }
        });
      }
    },
    
    resetOcrStatus() {
        patchState(store, { ocrStatus: 'idle', error: null });
    },

    processImage: rxMethod<File>(
      pipe(
        tap(() => patchState(store, { ocrStatus: 'loading', error: null })),
        switchMap((file) => 
          ocrService.extractText(file).pipe(
            tapResponse({
              next: ({ text }: { text: string }) => {
                const newStory: Story = {
                  id: Date.now().toString(),
                  title: 'Captured Text',
                  content: text,
                  difficulty: 'medium', // Default
                  themeColor: 'bg-purple-100 text-purple-600'
                };
                patchState(store, { 
                  ocrStatus: 'success', 
                  currentStory: newStory,
                  stories: [newStory, ...store.stories()] // Add to list (optional)
                });
              },
              error: (err: any) => {
                console.error('OCR Error:', err);
                patchState(store, { 
                  ocrStatus: 'error', 
                  error: 'Failed to extract text. Please try again.' 
                });
              }
            })
          )
        )
      )
    )
  }))
);
