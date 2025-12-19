import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule, Play, Pause, RotateCcw, Turtle, Rabbit } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-controls',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './player-controls.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    /* Custom slider styling if needed, otherwise daisyui range */
  `]
})
export class PlayerControls {
  isPlaying = input.required<boolean>();
  playbackSpeed = input.required<number>();
  currentWordIndex = input<number>(-1);
  totalWords = input<number>(0);
  
  playToggle = output<void>();
  reset = output<void>();
  speedChange = output<number>();
  positionChange = output<number>();

  readonly Play = Play;
  readonly Pause = Pause;
  readonly RotateCcw = RotateCcw;
  readonly Turtle = Turtle;
  readonly Rabbit = Rabbit;

  onSpeedChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.speedChange.emit(value);
  }

  onPositionChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.positionChange.emit(value);
  }
}
