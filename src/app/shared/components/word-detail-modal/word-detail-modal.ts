import { Component, input, output, signal, ElementRef, viewChild, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { LucideAngularModule, X, Volume2, Star } from 'lucide-angular';
import { Word } from '../../models/word.model';
import { TtsService } from '../../../core/services/tts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-word-modal',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #modalRef class="modal modal-bottom sm:modal-middle" aria-labelledby="modal-title">
      <div class="modal-box bg-base-200 p-8 overflow-hidden relative rounded-[2.5rem] shadow-2xl max-w-sm mx-auto">
        
        <!-- Close Button -->
        <button (click)="close()" aria-label="Close modal" class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-neutral/40 hover:bg-neutral/10">
           <lucide-angular [img]="XIcon" class="w-5 h-5"></lucide-angular>
        </button>

        <!-- Word Title -->
        <div class="text-center mb-6">
             <h2 id="modal-title" class="font-heading text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 tracking-tighter drop-shadow-sm select-none capitalize">
               {{ word()?.original }}
             </h2>
        </div>

        <div class="space-y-6">
            
            <!-- Syllables Chip -->
            <div class="bg-warning/10 rounded-[2rem] p-6 text-center">
                <p class="text-sm font-bold text-neutral/60 mb-3">Syllables:</p>
                <div class="flex justify-center flex-wrap gap-2">
                    @for (syl of word()?.syllables; track $index) {
                      <span class="badge badge-lg bg-orange-200/50 text-neutral font-heading text-xl font-bold py-6 px-6 border-0">
                        {{ syl }}
                      </span>
                    } @empty {
                       <span class="badge badge-lg bg-orange-200/50 text-neutral font-heading text-xl font-bold py-6 px-6 border-0">
                        {{ word()?.original }}
                      </span>
                    }
                </div>
            </div>

            <!-- Definition -->
            <div class="bg-info/10 rounded-[2rem] p-6 text-center">
                <p class="text-sm font-bold text-teal-700/60 mb-2">What does it mean?</p>
                <p class="font-medium text-neutral text-lg leading-relaxed">
                    {{ word()?.translation }}
                </p>
            </div>

            <div class="flex gap-4 pt-2">
                <button (click)="speak()" aria-label="Listen to word pronunciation" class="btn bg-teal-400 hover:bg-teal-500 border-0 flex-1 rounded-full text-white shadow-button btn-lg h-14">
                    <lucide-angular [img]="VolumeIcon" class="w-6 h-6 fill-current"></lucide-angular>
                    Listen
                </button>
                <button aria-label="Save word to favorites" class="btn border-0 flex-1 rounded-full text-white shadow-button btn-lg h-14 bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500">
                     <lucide-angular [img]="StarIcon" class="w-6 h-6 fill-current"></lucide-angular>
                     Save
                </button>
            </div>

        </div>
      </div>
      <form method="dialog" class="modal-backdrop bg-neutral/50">
        <button (click)="close()">close</button>
      </form>
    </dialog>
  `,
  styles: []
})
export class WordDetailModal {
  // 1. Injections first
  private ttsService = inject(TtsService);
  private destroyRef = inject(DestroyRef);

  // 2. Queries/inputs/outputs next
  private modalRef = viewChild<ElementRef<HTMLDialogElement>>('modalRef');
  word = input<Word | null>(null);
  languageCode = input<string>('en-US');
  closeModal = output<void>();

  // 3. Other properties (readonly icons)
  readonly XIcon = X;
  readonly VolumeIcon = Volume2;
  readonly StarIcon = Star;

  // 4. Methods
  open() {
    this.modalRef()?.nativeElement.showModal();
  }

  close() {
    this.modalRef()?.nativeElement.close();
    this.closeModal.emit();
  }

  speak() {
    const w = this.word();
    if (w) {
        this.ttsService.speak(w.original, this.languageCode(), 1)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: result => {
              if (result.audio) {
                result.audio.play();
              }
            },
            error: err => {
              console.error('Failed to speak word:', err);
              // Could show user-friendly error message here
            }
          });
    }
  }
}
