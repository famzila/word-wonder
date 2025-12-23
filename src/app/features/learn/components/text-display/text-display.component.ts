import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-text-display',

  templateUrl: './text-display.html',
  styleUrl: './text-display.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextDisplay {
  text = input.required<string>();
  currentWordIndex = input<number>(-1);
  mispronuncedWords = input<number[]>([]);
  wordClick = output<string>();

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
