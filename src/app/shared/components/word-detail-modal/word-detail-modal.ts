import { Component, input, output, signal, ElementRef, viewChild, inject, ChangeDetectionStrategy, DestroyRef, computed } from '@angular/core';
import { LucideAngularModule, X, Volume2, Star, Trash2 } from 'lucide-angular';
import { Word } from '../../models/word.model';
import { TtsService } from '../../../core/services/tts.service';
import { FavoritesStore } from '../../../core/store/favorites.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-word-modal',
  imports: [LucideAngularModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #modalRef class="modal modal-bottom sm:modal-middle" aria-labelledby="modal-title" aria-describedby="modal-description">
      <div class="modal-box">
        
        <!-- Close Button -->
        <form method="dialog">
          <button aria-label="Close modal" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <lucide-angular [img]="XIcon" class="w-5 h-5"></lucide-angular>
          </button>
        </form>

        <!-- Word Title -->
        <h3 id="modal-title" class="gradient-text-primary font-heading text-4xl font-black tracking-tighter capitalize mb-6 text-center">
          {{ word()?.original }}
        </h3>

        <!-- Modal Content -->
        <div id="modal-description" class="space-y-4">
            
            <!-- Image Section -->
            @if (isLoading()) {
               <div class="skeleton h-48 w-full rounded-2xl"></div>
            } @else {
               @if (imageUrl()) {
                 <div class="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg bg-base-200">
                   <img [src]="imageUrl()" alt="Illustration for {{ word()?.original }}" class="w-full h-full object-contain">
                 </div>
               }
            }

            <!-- AI Definition -->
            <div class="bg-info/10 rounded-2xl p-6 text-center">
                <p class="text-xs font-bold text-info mb-2 tracking-wide uppercase">{{ 'word_modal.meaning_label' | translate }}</p>
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

            <!-- Syllables -->
            @if (word()?.syllables?.length) {
              <div class="flex justify-center flex-wrap gap-2">
                  @for (syl of word()!.syllables; track $index) {
                    <span class="badge badge-lg badge-warning font-heading text-lg font-bold">
                      {{ syl }}
                    </span>
                  }
              </div>
            }
        </div>

        <!-- Modal Actions -->
        <div class="modal-action">
            <button (click)="speak()" aria-label="Listen to word pronunciation" class="btn btn-secondary flex-1">
                <lucide-angular [img]="VolumeIcon" class="w-5 h-5"></lucide-angular>
                {{ 'common.listen' | translate }}
            </button>
            <button 
              (click)="toggleFavorite()" 
              aria-label="Toggle favorite status" 
              [class.btn-outline]="isFavorite()"
              [class.btn-error]="isFavorite()"
              [class.btn-primary]="!isFavorite()"
              class="btn flex-1">
                 
                 <lucide-angular 
                    [img]="isFavorite() ? TrashIcon : StarIcon" 
                    class="w-5 h-5"
                    [class.fill-current]="!isFavorite()">
                 </lucide-angular>
                 {{ isFavorite() ? ('common.remove' | translate) : ('common.save' | translate) }}
            </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
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
