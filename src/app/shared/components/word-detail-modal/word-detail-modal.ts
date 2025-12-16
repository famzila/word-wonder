import { Component, input, output, signal, ElementRef, viewChild } from '@angular/core';
import { LucideAngularModule, X, Volume2, Star } from 'lucide-angular';
import { Word } from '../../models/word.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-word-modal',
  imports: [LucideAngularModule, TranslateModule],
  template: `
    <dialog #modalRef class="modal modal-bottom sm:modal-middle">
      <div class="modal-box bg-base-100 p-0 overflow-hidden relative border-4 border-base-100 dark:border-base-300">
        
        <!-- Decoration Header -->
        <div class="h-24 bg-base-200 w-full relative overflow-hidden flex items-center justify-center">
             <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-primary)_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
             <h2 class="font-heading text-4xl text-primary font-black drop-shadow-sm rotate-[-2deg]">
               {{ word()?.original }}
             </h2>
             <button (click)="close()" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-neutral/40">
               <lucide-angular [img]="XIcon" class="w-5 h-5"></lucide-angular>
             </button>
        </div>

        <div class="p-6 space-y-6">
            
            <!-- Syllables Chip -->
            <div class="bg-base-200 rounded-3xl p-4 text-center">
                <p class="text-xs font-bold text-neutral/50 uppercase tracking-wider mb-2">Syllables</p>
                <div class="flex justify-center gap-1">
                    @for (syl of word()?.syllables; track $index) {
                      <span class="badge badge-lg badge-accent text-neutral font-heading text-lg py-4 border-0 shadow-sm">
                        {{ syl }}
                      </span>
                    } @empty {
                       <span class="badge badge-lg badge-accent text-neutral font-heading text-lg py-4 border-0 shadow-sm">
                        {{ word()?.original }}
                      </span>
                    }
                </div>
            </div>

            <!-- Definition -->
            <div class="bg-info/10 rounded-3xl p-4 text-center border-2 border-info/20">
                <p class="text-xs font-bold text-info uppercase tracking-wider mb-2">What does it mean?</p>
                <p class="font-medium text-neutral text-lg">
                    {{ word()?.translation }}
                </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
                <button class="btn btn-secondary flex-1 rounded-full text-white shadow-lg btn-lg hover:scale-105 transition-transform">
                    <lucide-angular [img]="VolumeIcon" class="w-6 h-6"></lucide-angular>
                    Listen
                </button>
                <button class="btn btn-primary flex-1 rounded-full text-white shadow-lg btn-lg hover:scale-105 transition-transform">
                     <lucide-angular [img]="StarIcon" class="w-6 h-6"></lucide-angular>
                     Save
                </button>
            </div>

        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button (click)="close()">close</button>
      </form>
    </dialog>
  `,
  styles: []
})
export class WordDetailModal {
  word = input<Word | null>(null);
  closeModal = output<void>();

  private modalRef = viewChild<ElementRef<HTMLDialogElement>>('modalRef');

  readonly XIcon = X;
  readonly VolumeIcon = Volume2;
  readonly StarIcon = Star;

  open() {
    this.modalRef()?.nativeElement.showModal();
  }

  close() {
    this.modalRef()?.nativeElement.close();
    this.closeModal.emit();
  }
}
