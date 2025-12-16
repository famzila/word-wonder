import { Component, output } from '@angular/core';
import { LucideAngularModule, BookOpen } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Story } from '../../../../shared/models/word.model';

@Component({
  selector: 'app-story-list',
  imports: [LucideAngularModule, TranslateModule],
  template: `
    <div class="w-full space-y-4">
      
      <div class="divider text-neutral/40 text-xs font-bold uppercase tracking-widest my-8">
        {{ 'home.section_stories' | translate }}
      </div>

      <div class="flex flex-col gap-3">
        @for (story of stories; track story.id) {
            <button (click)="selectStory.emit(story)" class="card card-side bg-white shadow-sm border border-base-200 p-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-left group">
                <figure [class]="'w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ml-2 my-auto transition-colors ' + (story.themeColor || 'bg-orange-100 text-orange-500')">
                    <!-- Placeholder icon if no image -->
                    <lucide-angular [img]="BookIcon" class="w-8 h-8" strokeWidth="2.5"></lucide-angular>
                </figure>
                <div class="card-body p-4 py-2 gap-1 justify-center block min-w-0">
                    <h3 class="font-heading text-lg font-bold text-neutral truncate w-full leading-tight group-hover:text-primary transition-colors">
                        {{ story.title }}
                    </h3>
                    <p class="text-neutral/50 text-xs font-medium truncate w-full">
                        {{ story.content }}
                    </p>
                </div>
            </button>
        }
      </div>

    </div>
  `,
  styles: []
})
export class StoryList {
  selectStory = output<Story>();
  
  readonly BookIcon = BookOpen;

  // Mock Data matching mockup
  stories: Story[] = [
    {
      id: '1',
      title: 'La Petite Étoile',
      content: 'The fluffy cat sat on the warm mat. It was a sunny day...',
      difficulty: 'easy',
      themeColor: 'bg-red-100 text-red-500' // Pinkish
    },
    {
      id: '2',
      title: "Amis de l'Océan",
      content: 'Today we went to the zoo. We saw big elephants and tall...',
      difficulty: 'medium',
      themeColor: 'bg-cyan-100 text-cyan-600' // Teal/Blue
    },
    {
       id: '3',
       title: 'Magie du Jardin',
       content: 'In the magic garden, beautiful flowers bloom every day...',
       difficulty: 'hard',
       themeColor: 'bg-yellow-100 text-yellow-600' // Yellow
    }
  ];
}
