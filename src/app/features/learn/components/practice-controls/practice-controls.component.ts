import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Mic, MicOff } from 'lucide-angular';

@Component({
  selector: 'app-practice-controls',
  imports: [LucideAngularModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card bg-base-200 shadow-xl p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 min-h-[250px]">
      
      <button 
        class="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg relative"
        [class.animate-pulse-glow]="isRecording()"
        [class.bg-error]="isRecording()"
        [class.text-white]="true"
        [class.bg-primary]="!isRecording()"
        [class.hover:scale-105]="!isRecording()"
        [class.shadow-primary/40]="!isRecording()"
        (click)="toggleRecording.emit()"
        [attr.aria-label]="(isRecording() ? 'learn.practice.stop_recording' : 'learn.practice.start_recording') | translate"
      >
        <!-- Subtle ring effect when recording -->
        @if (isRecording()) {
          <span class="absolute inset-0 rounded-full border-4 border-orange-300/60"></span>
        }
        
        <lucide-angular [img]="isRecording() ? MicOff : Mic" class="w-10 h-10 relative z-10" strokeWidth="3"></lucide-angular>
      </button>


      @if (isRecording()) {
        <p class="text-neutral/60 font-bold animate-pulse">
          {{ 'learn.practice.listening' | translate }}
        </p>
      }
      
      @if (!isRecording()) {
         <p class="text-neutral/40 font-bold">
            {{ 'learn.practice.tap_to_record' | translate }}
         </p>
      }

    </div>
  `
})
export class PracticeControls {
  isRecording = input.required<boolean>();
  toggleRecording = output<void>();

  readonly Mic = Mic;
  readonly MicOff = MicOff;
}
