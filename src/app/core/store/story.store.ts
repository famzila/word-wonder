import { inject } from '@angular/core';
import { DEFAULT_LANGUAGE_CODE } from '../constants/app.constants';
import { patchState, signalStore, withMethods, withState, withHooks } from '@ngrx/signals';
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
      languageCode: DEFAULT_LANGUAGE_CODE
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
                // 1. Generate dynamic title from first 4 words
                const words = text.split(/\s+/).slice(0, 4);
                const title = words.join(' ') + (words.length >= 4 ? '...' : '');

                // 2. Check for duplicates
                const existingStory = store.stories().find(s => s.content.trim() === text.trim());
                
                if (existingStory) {
                   // If duplicate, just select it without adding
                   patchState(store, { 
                     ocrStatus: 'success', 
                     currentStory: existingStory
                   });
                   return;
                }

                const newStory: Story = {
                  id: Date.now().toString(),
                  title: title,
                  content: text,
                  difficulty: 'medium', // Default
                  themeColor: 'bg-secondary/10 text-secondary',
                  languageCode: languageCode // Store the detected language
                };
                
                // Save custom story to local storage
                const existingCustomStories = JSON.parse(localStorage.getItem('word-wonder-custom-stories') || '[]');
                const updatedCustomStories = [newStory, ...existingCustomStories];
                localStorage.setItem('word-wonder-custom-stories', JSON.stringify(updatedCustomStories));

                patchState(store, { 
                  ocrStatus: 'success', 
                  currentStory: newStory,
                  stories: [newStory, ...store.stories()] 
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
  })),
  withHooks({
    onInit(store) {
      const savedCustomStories = localStorage.getItem('word-wonder-custom-stories');
      if (savedCustomStories) {
          try {
              const customStories: Story[] = JSON.parse(savedCustomStories);
              patchState(store, {
                  stories: [...customStories, ...store.stories()]
              });
          } catch (e) {
              console.error('Failed to parse custom stories', e);
          }
      }
    }
  })
);
