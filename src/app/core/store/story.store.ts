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
      title: 'stories.star.title',
      content: 'stories.star.content',
      difficulty: 'easy',
      themeColor: 'bg-error/10 text-error',
      languageCode: 'en-US'
    },
    {
      id: '2',
      title: 'stories.ocean.title',
      content: 'stories.ocean.content',
      difficulty: 'medium',
      themeColor: 'bg-info/10 text-info',
      languageCode: 'en-US'
    },
    {
       id: '3',
       title: 'stories.garden.title',
       content: 'stories.garden.content',
       difficulty: 'hard',
       themeColor: 'bg-warning/10 text-warning',
       languageCode: 'en-US'
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
              next: ({ text, languageCode }: { text: string, languageCode: string }) => {
                const newStory: Story = {
                  id: Date.now().toString(),
                  title: 'Captured Text',
                  content: text,
                  difficulty: 'medium', // Default
                  themeColor: 'bg-secondary/10 text-secondary',
                  languageCode: languageCode // Store the detected language
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
