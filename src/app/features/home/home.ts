import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Sparkles } from 'lucide-angular';
import { UploadCard } from './components/upload-card/upload-card';
import { StoryList } from './components/story-list/story-list';
import { Story } from '../../shared/models/word.model';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe, LucideAngularModule, UploadCard, StoryList],
  template: `
    <div class="flex flex-col items-center pt-8 px-4 pb-4 space-y-8 animate-fade-in-up">
      
      <!-- Brand Header -->
      <div class="text-center flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center shadow-lg mb-4 text-white">
          <lucide-angular [img]="SparklesIcon" class="w-10 h-10" strokeWidth="2.5"></lucide-angular>
        </div>
        <h1 class="text-4xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 tracking-tight pb-1">
          {{ 'home.title' | translate }}
        </h1>
        <p class="text-neutral/60 font-medium mt-1">
          {{ 'home.subtitle' | translate }} 🌟
        </p>
      </div>

      <!-- Main Content -->
      <div class="w-full max-w-sm space-y-2">
        
        <!-- Upload Action -->
        <app-upload-card
            (onUpload)="handleUpload()"
            (onCamera)="handleCamera()"
        ></app-upload-card>

        <!-- Stories -->
        <app-story-list 
            (selectStory)="handleStorySelect($event)"
        ></app-story-list>

      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class Home {
  readonly SparklesIcon = Sparkles;

  handleUpload() {
    console.log('Upload clicked');
  }

  handleCamera() {
    console.log('Camera clicked');
  }

  handleStorySelect(story: Story) {
    console.log('Story selected', story);
    // Navigate to learn/play page with this story
  }
}
