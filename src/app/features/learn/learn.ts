import { Component, inject, OnDestroy, effect, viewChild, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { LucideAngularModule, Volume2, Mic, ArrowLeft } from 'lucide-angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LearnStore } from './learn.store';
import { StoryStore } from '../../core/store/story.store';
import { TtsService } from '../../core/services/tts.service';
import { SttService } from '../../core/services/stt.service';
import { Timepoint } from '../../core/models/tts-response.model';

import { TextDisplay } from './components/text-display/text-display.component';
import { PlayerControls } from './components/player-controls/player-controls.component';
import { PracticeControls } from './components/practice-controls/practice-controls.component';
import { WordDetailModal } from '../../shared/components/word-detail-modal/word-detail-modal';
import { FeedbackModal } from './components/feedback-modal/feedback-modal.component';
import { Word } from '../../shared/models/word.model';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DEFAULT_LANGUAGE_CODE, DEFAULT_APP_LANGUAGE } from '../../core/constants/app.constants';

@Component({
  selector: 'app-learn',
  imports: [
    LucideAngularModule, 
    TextDisplay, 
    PlayerControls, 
    PracticeControls,
    WordDetailModal,
    FeedbackModal,
    TranslatePipe
  ],
  providers: [LearnStore],
  templateUrl: './learn.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Learn implements OnDestroy {
  store = inject(LearnStore);
  private storyStore = inject(StoryStore);
  private ttsService = inject(TtsService);
  private sttService = inject(SttService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);

  // Icons
  readonly VolumeIcon = Volume2;
  readonly MicIcon = Mic;
  readonly BackIcon = ArrowLeft;

  // Audio State
  private currentAudio: HTMLAudioElement | null = null;
  private timepoints: Timepoint[] = [];
  private audioCleanupFn: (() => void) | null = null;
  
  // Modal State
  selectedWord: Word | null = null;
  private modalRef = viewChild<WordDetailModal>(WordDetailModal);

  // Real-time recognition subscription
  private recognitionSubscription: Subscription | null = null;
  
  // Stable matching state - constants
  private readonly SPEECH_WINDOW_SIZE = 3;
  private readonly SEARCH_HORIZON = 5;
  
  // Stable matching state - variables
  private lastHighConfidenceIndex = -1;
  private currentReadingPosition = 0;
  private detectedErrors = new Set<number>();

  constructor() {
    // Initialize text from StoryStore's currentStory
    effect(() => {
      const currentStory = this.storyStore.currentStory();
      if (currentStory?.content) {
        this.store.setText(currentStory.content, currentStory.languageCode || DEFAULT_LANGUAGE_CODE);
      }
    });

    // Effect to handle playback speed changes dynamically
    effect(() => {
        const speed = this.store.playbackSpeed();
        if (this.currentAudio) {
            this.currentAudio.playbackRate = speed;
        }
    });
  }

  // Computed total words
  get totalWords(): number {
    return this.store.text().split(/\s+/).length;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  onTabChange(mode: 'listen' | 'practice') {
    this.store.setMode(mode);
    this.resetAudio();
  }

  // --- Listen Mode Logic ---

  togglePlay() {
    if (this.store.isPlaying()) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  async playAudio() {
    if (this.currentAudio) {
        // Resume
        this.currentAudio.play();
        this.store.setIsPlaying(true);
        return;
    }

    // New Playback
    this.store.setIsPlaying(true);
    // Use the language code from the store
    // Always generate audio at normal speed (1.0) and use HTML5 playbackRate for speed control
    this.ttsService.speak(this.store.text(), this.store.languageCode(), 1.0).subscribe({
        next: (result) => {
            this.currentAudio = result.audio;
            this.timepoints = result.timepoints;
            // Set the playback rate from the store
            this.currentAudio.playbackRate = this.store.playbackSpeed();
            this.setupAudioListeners();
            this.currentAudio.play();
        },
        error: (err) => {
            console.error('TTS Error', err);
            this.store.setIsPlaying(false);
        }
    });
  }

  private setupAudioListeners() {
    if (!this.currentAudio) return;

    // Time Update for Highlighting
    const updateHandler = () => {
        if (!this.currentAudio) return;
        const currentTime = this.currentAudio.currentTime;
        
        // Find the active word based on timepoints
        // Timepoints are usually start times. 
        // We find the last timepoint that is <= currentTime
        // Note: Google TTS timepoints are in seconds
        let activeIndex = -1;
        for (let i = 0; i < this.timepoints.length; i++) {
            if (currentTime >= this.timepoints[i].timeSeconds) {
                activeIndex = i;
            } else {
                break;
            }
        }
        
        if (activeIndex !== this.store.currentWordIndex()) {
            this.store.setCurrentWordIndex(activeIndex);
        }
    };

    const endHandler = () => {
        this.store.setIsPlaying(false);
        this.store.setCurrentWordIndex(-1);
    };

    this.currentAudio.addEventListener('timeupdate', updateHandler);
    this.currentAudio.addEventListener('ended', endHandler);

    this.audioCleanupFn = () => {
        this.currentAudio?.removeEventListener('timeupdate', updateHandler);
        this.currentAudio?.removeEventListener('ended', endHandler);
        this.currentAudio?.pause();
        this.currentAudio = null;
    };
  }

  pauseAudio() {
    this.currentAudio?.pause();
    this.store.setIsPlaying(false);
  }

  resetAudio() {
    this.audioCleanupFn?.();
    this.store.reset();
  }

  onSpeedChange(speed: number) {
    this.store.setPlaybackSpeed(speed);
    // Logic handled by effect in constructor
  }

  onPositionChange(wordIndex: number) {
    // Update the current word index
    this.store.setCurrentWordIndex(wordIndex);
    
    // If audio is loaded and we have timepoints, seek to that word
    if (this.currentAudio && this.timepoints.length > 0 && wordIndex < this.timepoints.length) {
      const targetTime = this.timepoints[wordIndex].timeSeconds;
      this.currentAudio.currentTime = targetTime;
    }
  }

  // Syllable memoization cache
  private syllableCache = new Map<string, string[]>();

  onWordClick(word: string) {
    // Remove punctuation for clean display
    const cleanWord = word.replace(/[.,!?]/g, '');
    
    this.selectedWord = {
        id: '1',
        original: cleanWord,
        translation: '', // @todo: fetch from specific dictionary API
        type: 'other',
        syllables: this.approximateSyllables(cleanWord) // Generate syllables
    };
    
    // Load AI definition and image
    // Critical: Use text language for context, but APP language for definition output
    this.store.loadWordDetails(
      cleanWord, 
      this.store.text(), 
      this.translate.currentLang || DEFAULT_APP_LANGUAGE // App language for definition (e.g. 'fr' or 'ar')
    );

    this.modalRef()?.open();
  }

  // Simple heuristic for syllable estimation with memoization
  private approximateSyllables(word: string): string[] {
    // Check cache first
    if (this.syllableCache.has(word)) {
      return this.syllableCache.get(word)!;
    }
    
    const w = word.toLowerCase();
    let syllables: string[];
    
    if (w.length <= 3) {
      syllables = [w];
    } else {
      // Regex to match vowel groups, but keep them with preceding consonants if possible
      const result = w.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi);
      syllables = result ? result : [w];
    }
    
    // Cache the result
    this.syllableCache.set(word, syllables);
    return syllables;
  }

  // --- Practice Mode Logic ---

  async toggleRecording() {
    if (this.store.isRecording()) {
        this.stopRecording();
    } else {
        await this.startRecording();
    }
  }

  async startRecording() {
    try {
        this.store.setIsRecording(true);
        this.store.setCurrentWordIndex(-1);
        this.store.setMispronuncedWords([]);
        
        // Reset state
        this.lastHighConfidenceIndex = -1;
        
        // TODO: Re-enable when pronunciation feedback is ready (see stopRecording method)
        // DISABLED: Audio recording for Gemini pronunciation analysis
        // await this.sttService.startRecording();

        // Start Real-time recognition for navigation
        this.recognitionSubscription = this.sttService.startRealtimeRecognition(this.store.languageCode())
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (result) => {
                const targetWords = this.store.text().toLowerCase()
                    .split(/\s+/)
                    .map(w => w.replace(/[.,!?]/g, ''));
                
                const spokenWords = result.words;
                if (spokenWords.length === 0) return;

                // Robust Sliding Window Matching
                // We only look at the last N spoken words to determine position
                // This ignores early history weirdness and focuses on "where are we now?"
                
                const windowSize = this.SPEECH_WINDOW_SIZE;
                const searchHorizon = this.SEARCH_HORIZON;
                
                // Get the tail of spoken words
                const spokenTail = spokenWords.slice(-windowSize);
                
                // Start searching from last known position or 0
                let startSearchIndex = Math.max(0, this.store.currentWordIndex());
                
                // Try to find the spoken tail in the target text
                // We prefer matches closer to current position
                
                let bestMatchIndex = -1;
                
                // Iterate through the spoken tail (last word, then 2nd to last, etc)
                // The last word is the most important "cursor"
                const lastSpoken = spokenTail[spokenTail.length - 1];
                const cleanLastSpoken = lastSpoken.toLowerCase().replace(/[.,!?]/g, '');

                // Search ahead in target text
                for (let i = 0; i < searchHorizon; i++) {
                    const targetIdx = startSearchIndex + i;
                    if (targetIdx >= targetWords.length) break;
                    
                    const targetWord = targetWords[targetIdx];
                    
                    if (cleanLastSpoken === targetWord || this.isFuzzyMatch(cleanLastSpoken, targetWord)) {
                        // Found it ahead! Mark all skipped words as errors
                        const offset = targetIdx - this.currentReadingPosition;
                        const skippedIndices: number[] = [];
                        for (let j = 0; j < offset; j++) {
                            const skippedIndex = this.currentReadingPosition + j;
                            skippedIndices.push(skippedIndex);
                        }
                        
                        // Immediately update errors in store so they show up red
                        // Merging with existing errors
                        const currentErrors = this.store.mispronuncedWords();
                        const newErrors = [...currentErrors, ...skippedIndices];
                        // Deduplicate
                        this.store.setMispronuncedWords([...new Set(newErrors)]);

                        this.currentReadingPosition = targetIdx + 1; // Advance reading position past the matched word
                        bestMatchIndex = targetIdx;
                        break; // Found the closest match ahead!
                    }
                }
                
                if (bestMatchIndex !== -1) {
                    // Update position!
                    this.store.setCurrentWordIndex(bestMatchIndex);
                    this.lastHighConfidenceIndex = bestMatchIndex;
                }
                
                // Error Detection (Simple check for now)
                // If we skipped words, mark them? Maybe too aggressive for real-time.
                // Let's just track position accurately first.
            },
            error: (err) => {
                console.error('Recognition error', err);
                this.store.setIsRecording(false);
            }
        });
    } catch (err) {
        console.error('Failed to start recording', err);
        this.store.setIsRecording(false);
    }
  }

  /**
   * Simple fuzzy matching using Levenshtein distance
   */
  private isFuzzyMatch(word1: string, word2: string): boolean {
    if (word1 === word2) return true;
    if (Math.abs(word1.length - word2.length) > 2) return false;
    if (word1.length < 3 || word2.length < 3) return false;
    
    // Quick check for common prefixes/suffixes or typos
    return this.levenshteinDistance(word1, word2) <= 2;
  }

  private levenshteinDistance(s1: string, s2: string): number {
    const costs: number[] = new Array(s2.length + 1);
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  stopRecording() {
    this.store.setIsRecording(false);
    this.sttService.stopRealtimeRecognition();
    
    if (this.recognitionSubscription) {
        this.recognitionSubscription.unsubscribe();
        this.recognitionSubscription = null;
    }

    // TODO: Re-enable pronunciation feedback after MVP
    // Currently disabled because Gemini pronunciation analysis is not providing accurate results.
    // The feedback modal shows incorrect pronunciation scores and mispronounced words.
    // This feature needs further refinement and testing before being production-ready.
    // See: https://github.com/your-repo/issues/XXX (create issue for tracking)
    
    /* DISABLED: STT + Gemini Pronunciation Analysis
    this.sttService.stopAndAnalyze(this.store.text(), this.store.languageCode())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          // Save result to store for UI display
          this.store.setPronunciationResult(result.score, result.feedback);
          
          // Highlight mispronounced words from Gemini Analysis
          if (result.mispronouncedWords && Array.isArray(result.mispronouncedWords)) {
            // ... (existing highlight logic) ...
             const targetWords = this.store.text().toLowerCase().split(/\s+/).map(w => w.replace(/[.,!?]/g, ''));
             const currentErrors = new Set(this.store.mispronuncedWords());
             
             result.mispronouncedWords.forEach((word: string) => {
                const cleanMispronounced = word.toLowerCase().replace(/[.,!?]/g, '');
                targetWords.forEach((target, idx) => {
                    if (target === cleanMispronounced) {
                        currentErrors.add(idx);
                    }
                });
             });
             
             this.store.setMispronuncedWords(Array.from(currentErrors));
          }
        },
        error: (err) => console.error('Analysis failed', err)
      });
    */
  }

  closeFeedback() {
    this.store.setPronunciationResult(null, null);
  }

  ngOnDestroy(): void {
    this.resetAudio();
    if (this.recognitionSubscription) {
      this.recognitionSubscription.unsubscribe();
      this.recognitionSubscription = null;
    }
    this.detectedErrors.clear();
    this.syllableCache.clear();
  }
}
