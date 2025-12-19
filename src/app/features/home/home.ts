import { Component, inject, effect } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Sparkles } from 'lucide-angular';
import { UploadCard } from './components/upload-card/upload-card';
import { StoryList } from './components/story-list/story-list';
import { EditText } from './components/edit-text/edit-text';
import { StoryStore } from '../../core/store/story.store';
import { Story } from '../../shared/models/word.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe, LucideAngularModule, UploadCard, StoryList, EditText],
  template: `
    <div class="flex flex-col items-center pt-8 px-4 pb-4 space-y-8 animate-fade-in-up w-full max-w-md mx-auto">
      
      <div class="text-center">
        <div class="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center shadow-lg mb-4 text-white">
          <lucide-angular [img]="SparklesIcon" class="w-10 h-10" strokeWidth="2.5"></lucide-angular>
        </div>
        <h1 class="text-4xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 tracking-tight pb-1">
          {{ 'home.title' | translate }}
        </h1>
        <p class="text-neutral/60 font-medium mt-1">
          {{ 'home.subtitle' | translate }} 🌟
        </p>
      </div>

      @if (viewMode === 'edit') {
        <app-edit-text 
            [text]="store.currentStory()?.content || ''" 
            (textChange)="store.updateCurrentStoryText($event)"
            (back)="setViewMode('home')"
            (start)="startLearning()">
        </app-edit-text>
      } 
      
      <!-- HOME MODE -->
      @else {
        <!-- Upload Card -->
        <app-upload-card 
            class="w-full"
            (onUpload)="handleUpload($event)"
            (onCamera)="handleCamera($event)">
        </app-upload-card>

        <!-- Story List -->
        <app-story-list 
            class="w-full"
            [stories]="store.stories()"
            (selectStory)="handleStorySelect($event)">
        </app-story-list>
      }

    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding-bottom: 7rem; /* Space for Bottom Nav */
    }
  `]
})
export class Home {
  // Injections
  readonly store = inject(StoryStore);
  readonly router = inject(Router);

  // Other properties
  readonly SparklesIcon = Sparkles;
  viewMode: 'home' | 'edit' = 'home';

  constructor() {
    // Effect to switch to edit mode when OCR succeeds
    effect(() => {
        if (this.store.ocrStatus() === 'success') {
            this.viewMode = 'edit';
            this.store.resetOcrStatus(); // Reset so we don't re-trigger
        }
    });
  }

  handleUpload(file: File) {
    this.store.processImage(file);
  }

  handleCamera(file: File) {
    this.store.processImage(file);
  }

  handleStorySelect(story: Story) {
    this.store.setCurrentStory(story);
    this.viewMode = 'edit';
  }

  setViewMode(mode: 'home' | 'edit') {
      this.viewMode = mode;
      if (mode === 'home') {
          this.store.setCurrentStory(null);
      }
  }

  startLearning() {
      // Navigate to Learn page
      // Since currentStory is in the store, Learn component can just pick it up
      this.router.navigate(['/learn']);
  }
}
