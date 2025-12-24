import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RTL_LANGUAGES, DEFAULT_LANGUAGE_CODE } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-text-display',
  imports: [TranslatePipe],
  templateUrl: './text-display.html',
  styleUrl: './text-display.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextDisplay {
  text = input.required<string>();
  languageCode = input<string>(DEFAULT_LANGUAGE_CODE);
  currentWordIndex = input<number>(-1);
  mispronuncedWords = input<number[]>([]);
  wordClick = output<string>();

  direction = computed(() => {
    const lang = this.languageCode().split('-')[0].toLowerCase();
    return RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
  });

  words = computed(() => {
    return this.text().split(/\s+/).map((word, index) => ({ word, index }));
  });

  onWordClick(word: string) {
    // Remove punctuation for better definitions? 
    // For now, emit raw word, can process later.
    const cleanWord = word.replace(/[.,!?]/g, '');
    this.wordClick.emit(cleanWord);
  }
}
