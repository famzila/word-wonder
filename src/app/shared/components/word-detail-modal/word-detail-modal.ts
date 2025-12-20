import { Component, input, output, signal, ElementRef, viewChild, inject, ChangeDetectionStrategy, DestroyRef, computed } from '@angular/core';
import { LucideAngularModule, X, Volume2, Star, Trash2 } from 'lucide-angular';
import { Word } from '../../models/word.model';
import { TtsService } from '../../../core/services/tts.service';
import { FavoritesStore } from '../../../core/store/favorites.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-word-modal',
  imports: [LucideAngularModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #modalRef class="modal modal-bottom sm:modal-middle" aria-labelledby="modal-title">
      <div class="modal-box bg-base-200 p-8 overflow-hidden relative rounded-[2.5rem] shadow-2xl max-w-sm mx-auto">
        
        <!-- Close Button -->
        <button (click)="close()" aria-label="Close modal" class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-neutral/40 hover:bg-neutral/10 z-10">
           <lucide-angular [img]="XIcon" class="w-5 h-5"></lucide-angular>
        </button>

        <!-- Word Title -->
        <div class="text-center mb-6">
             <h2 id="modal-title" class="font-heading text-4xl font-black text-transparent bg-clip-text bg-gradient-fun tracking-tighter select-none capitalize">
               {{ word()?.original }}
             </h2>
        </div>

        <div class="space-y-6">
            
            <!-- Image Section -->
            @if (isLoading()) {
               <div class="skeleton h-48 w-full rounded-[2rem]"></div>
            } @else {
               @if (imageUrl()) {
                 <div class="relative w-full h-48 rounded-[2rem] overflow-hidden shadow-lg">
                   <img [src]="imageUrl()" alt="Illustration for {{ word()?.original }}" class="w-full h-full object-cover">
                 </div>
               }
            }

            <!-- AI Definition -->
            <div class="bg-info/10 rounded-[2rem] p-6 text-center shadow-inner">
                <p class="text-xs font-bold text-teal-700/60 mb-2 tracking-wide uppercase">{{ 'word_modal.meaning_label' | translate }}</p>
                @if (isLoading()) {
                   <div class="flex flex-col gap-2 items-center">
                     <div class="skeleton h-4 w-3/4"></div>
                     <div class="skeleton h-4 w-1/2"></div>
                   </div>
                } @else {
                  <p class="font-medium text-neutral text-lg leading-relaxed">
                      {{ definition() || word()?.translation }}
                  </p>
                }
            </div>

            <!-- Syllables Chip (Secondary now) -->
            <div class="flex justify-center flex-wrap gap-2">
                @for (syl of word()?.syllables; track $index) {
                  <span class="badge badge-lg bg-orange-100/80 text-orange-800 font-heading text-lg font-bold py-4 px-4 border-0">
                    {{ syl }}
                  </span>
                }
            </div>


            <div class="flex gap-4 pt-2">
                <button (click)="speak()" aria-label="Listen to word pronunciation" class="btn btn-secondary border-0 flex-1 rounded-full text-white shadow-button btn-lg h-14">
                    <lucide-angular [img]="VolumeIcon" class="w-6 h-6 fill-current"></lucide-angular>
                    {{ 'common.listen' | translate }}
                </button>
                <button 
                  (click)="toggleFavorite()" 
                  aria-label="Toggle favorite status" 
                  [class.btn-outline]="isFavorite()"
                  [class.btn-error]="isFavorite()"
                  [class.bg-gradient-fun]="!isFavorite()"
                  class="btn border-0 flex-1 rounded-full shadow-button btn-lg h-14 transition-all duration-300">
                     
                     <lucide-angular 
                        [img]="isFavorite() ? TrashIcon : StarIcon" 
                        class="w-6 h-6 transition-all duration-300"
                        [class.fill-current]="!isFavorite()"
                        >
                     </lucide-angular>
                     {{ isFavorite() ? ('common.remove' | translate) : ('common.save' | translate) }}
                </button>
            </div>

        </div>
      </div>
      <form method="dialog" class="modal-backdrop bg-neutral/50">
        <button (click)="close()">close</button>
      </form>
    </dialog>
  `,
})
export class WordDetailModal {
  // 1. Injections first
  private ttsService = inject(TtsService);
  private favoritesStore = inject(FavoritesStore);
  private destroyRef = inject(DestroyRef);

  // 2. Queries/inputs/outputs next
  private modalRef = viewChild<ElementRef<HTMLDialogElement>>('modalRef');
  word = input<Word | null>(null);
  languageCode = input<string>('en-US');
  
  // AI content inputs
  definition = input<string | null>(null);
  imageUrl = input<string | null>(null);
  isLoading = input<boolean>(false);

  closeModal = output<void>();

  // 3. Signals / Computed
  // Calculate unique ID consistent with store logic
  favoriteId = computed(() => {
    const w = this.word();
    return w ? `${this.languageCode()}-${w.original.toLowerCase()}` : '';
  });

  isFavorite = computed(() => {
    const id = this.favoriteId();
    return id ? this.favoritesStore.isFavorite()(id) : false;
  });

  // 4. Other properties (readonly icons)
  readonly XIcon = X;
  readonly VolumeIcon = Volume2;
  readonly StarIcon = Star;
  readonly TrashIcon = Trash2; 

  // 5. Methods
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
            }
          });
    }
  }

  toggleFavorite() {
    const w = this.word();
    if (w) {
      this.favoritesStore.toggle(w, this.languageCode());
    }
  }
}
