import { Component, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule, Volume2, Trash2, Star } from 'lucide-angular';
import { FavoritesStore, FavoriteWord } from '../../core/store/favorites.store';
import { TtsService } from '../../core/services/tts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeader } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-favorites',
  imports: [LucideAngularModule, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favorites.html',
})
export class Favorites {
  // 1. Injections
  private favoritesStore = inject(FavoritesStore);
  private ttsService = inject(TtsService);
  private destroyRef = inject(DestroyRef);

  // 2. Signals
  words = this.favoritesStore.words;
  count = this.favoritesStore.count;

  // 3. Icons
  readonly VolumeIcon = Volume2;
  readonly TrashIcon = Trash2;
  readonly StarIcon = Star;

  // 4. Methods
  play(word: FavoriteWord) {
    // Only pay attention to language if explicitly needed, but for now use the stored languageCode
    this.ttsService.speak(word.original, word.languageCode, 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => {
          if (result.audio) {
            result.audio.play();
          }
        },
        error: err => console.error('Error playing audio:', err)
      });
  }

  delete(wordId: string) {
    this.favoritesStore.remove(wordId);
  }
}
