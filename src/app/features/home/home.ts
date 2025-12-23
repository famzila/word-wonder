import { Component, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Sparkles } from 'lucide-angular';
import { UploadCard } from './components/upload-card/upload-card';
import { StoryList } from './components/story-list/story-list';
import { EditText } from './components/edit-text/edit-text';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { StoryStore } from '../../core/store/story.store';
import { Story } from '../../shared/models/word.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, UploadCard, StoryList, EditText, PageHeader],
  template: `
    <div class="p-4 max-w-lg mx-auto flex flex-col gap-6">
      
      <!-- Page Header -->
      <app-page-header 
        [icon]="SparklesIcon" 
        title="home.title"
        subtitle="home.subtitle">
      </app-page-header>

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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  // Injections
  readonly store = inject(StoryStore);
  readonly router = inject(Router);
  readonly translate = inject(TranslateService);

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
    // Translate the story content if it's a key
    const translatedStory = {
        ...story,
        title: this.translate.instant(story.title),
        content: this.translate.instant(story.content)
    };
    this.store.setCurrentStory(translatedStory);
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
