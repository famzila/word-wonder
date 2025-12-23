import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule, Play, Trash2, Volume2 } from 'lucide-angular';
import { Word } from '../../models/word.model';

@Component({
  selector: 'app-word-card',
  imports: [LucideAngularModule],
  template: `
    <div class="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all active:scale-[0.98]">
      <div class="card-body p-4 flex flex-row items-center gap-4">
        
        <!-- Icon/Thumbnail Placeholder -->
        <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
           <!-- If image exists, show it, else show play icon or similar -->
           @if (word().imageUrl) {
             <img [src]="word().imageUrl" class="w-full h-full object-cover rounded-2xl" />
           } @else {
             <lucide-angular [img]="PlayIcon" class="w-6 h-6" strokeWidth="3"></lucide-angular>
           }
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3 class="font-heading text-lg font-bold text-neutral truncate">
            {{ word().original }}
          </h3>
          <p class="text-neutral/50 text-xs font-bold truncate">
            {{ word().translation }}
          </p>
          <!-- Tags/Chips -->
           <div class="flex gap-2 mt-1">
             <span class="badge badge-sm badge-warning/20 text-warning font-bold border-0 px-2 h-5">
               noun
             </span>
           </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2">
            <button class="btn btn-circle btn-sm btn-ghost">
                <lucide-angular [img]="VolumeIcon" class="w-5 h-5"></lucide-angular>
            </button>
        </div>

      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordCard {
  word = input.required<Word>();
  
  readonly PlayIcon = Play;
  readonly TrashIcon = Trash2;
  readonly VolumeIcon = Volume2;
}
