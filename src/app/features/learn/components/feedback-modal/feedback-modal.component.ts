import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule, X, Trophy, Star, RefreshCcw } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-feedback-modal',
  imports: [LucideAngularModule, TranslatePipe],
  template: `
    <dialog class="modal modal-bottom sm:modal-middle" [class.modal-open]="isOpen()" aria-labelledby="feedback-title">
      <div class="modal-box text-center relative overflow-hidden bg-base-100 border border-base-200 shadow-2xl">
        <!-- Confetti/Background decoration could go here -->
        
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" (click)="close.emit()" aria-label="Close modal">
          <lucide-angular [img]="XIcon" class="w-5 h-5"></lucide-angular>
        </button>

        <div class="flex flex-col items-center gap-4 py-6">
          <!-- Score Badge -->
          <div class="relative">
             <div class="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black shadow-inner"
                  [class]="scoreColorClass()">
                {{ score() }}
             </div>
             <!-- Icon Badge -->
             <div class="absolute -bottom-2 -right-2 bg-base-100 rounded-full p-1 shadow-md">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white" [class]="iconColorClass()">
                   <lucide-angular [img]="scoreIcon()" class="w-5 h-5"></lucide-angular>
                </div>
             </div>
          </div>

          <!-- Title -->
          <h3 id="feedback-title" class="font-heading font-bold text-2xl mt-2">{{ titleKey() | translate }}</h3>

          <!-- Feedback Text -->
          <p class="py-2 text-base-content/80 text-lg leading-relaxed max-w-xs">
            "{{ feedback() }}"
          </p>

          <!-- Action Buttons -->
          <div class="modal-action w-full justify-center mt-6">
            <button class="btn btn-primary btn-wide rounded-full text-lg shadow-lg hover:scale-105 transition-transform" 
                    (click)="close.emit()" autofocus>
              <lucide-angular [img]="ContinueIcon" class="w-5 h-5 mr-1"></lucide-angular>
              {{ 'feedback.continue' | translate }}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button (click)="close.emit()">{{ 'common.close' | translate }}</button>
      </form>
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackModal {
  score = input.required<number>();
  feedback = input.required<string>();
  isOpen = input.required<boolean>();
  close = output<void>();

  readonly XIcon = X;
  readonly TrophyIcon = Trophy;
  readonly StarIcon = Star;
  readonly ContinueIcon = RefreshCcw; 

  scoreColorClass = computed(() => {
    const s = this.score();
    if (s >= 80) return 'bg-success/20 text-success';
    if (s >= 50) return 'bg-warning/20 text-warning';
    return 'bg-error/20 text-error';
  });

  iconColorClass = computed(() => {
    const s = this.score();
    if (s >= 80) return 'bg-success';
    if (s >= 50) return 'bg-warning';
    return 'bg-error';
  });

  scoreIcon = computed(() => {
    return this.score() >= 80 ? this.TrophyIcon : this.StarIcon;
  });

  titleKey = computed(() => {
     const s = this.score();
     if (s >= 90) return 'feedback.amazing';
     if (s >= 80) return 'feedback.great_job';
     if (s >= 60) return 'feedback.good_effort';
     return 'feedback.keep_practicing';
  });
}
