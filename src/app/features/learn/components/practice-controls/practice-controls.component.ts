import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule, Mic } from 'lucide-angular';

@Component({
  selector: 'app-practice-controls',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card bg-base-200 shadow-xl p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 min-h-[250px]">
      
      <button 
        class="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg relative"
        [class.bg-error]="isRecording()"
        [class.text-white]="true"
        [class.bg-primary]="!isRecording()"
        [class.hover:scale-105]="!isRecording()"
        [class.shadow-primary/40]="!isRecording()"
        (click)="toggleRecording.emit()"
        [attr.aria-label]="isRecording() ? 'Stop recording' : 'Start recording'"
      >
        <!-- Subtle ring effect when recording -->
        @if (isRecording()) {
          <span class="absolute inset-0 rounded-full border-4 border-orange-300/60"></span>
        }
        
        <lucide-angular [img]="Mic" class="w-10 h-10 relative z-10" strokeWidth="3"></lucide-angular>
      </button>

      <p class="text-neutral/60 font-bold animate-pulse" [class.invisible]="!isRecording()">
        Listening...
      </p>
      
      @if (!isRecording()) {
         <p class="text-neutral/40 font-bold">
            Tap to start recording
         </p>
      }

    </div>
  `
})
export class PracticeControls {
  isRecording = input.required<boolean>();
  toggleRecording = output<void>();

  readonly Mic = Mic;
}
