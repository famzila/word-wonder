import { Component, input, output, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Sparkles } from 'lucide-angular';


@Component({
  selector: 'app-edit-text',
  imports: [TranslatePipe, LucideAngularModule],
  template: `
    <div class="card-standard animate-fade-in-up w-full max-w-2xl mx-auto">
      <div class="card-body-large">
        
        <h2 class="font-heading text-2xl text-neutral font-black mb-6 text-center">
          {{ 'edit_text.title' | translate }}
        </h2>

        <div class="form-control mb-8">
          <textarea 
            name="storyText"
            [value]="text()" 
            (input)="onInput($event)"
            class="textarea textarea-bordered h-64 w-full text-lg leading-relaxed resize-none bg-orange-50/30 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-2xl p-6"
            [placeholder]="'edit_text.placeholder' | translate">
          </textarea>
        </div>

        <div class="flex flex-row gap-6 justify-center">
          <!-- Back Button -->
          <button (click)="back.emit()" class="btn btn-lg btn-outline btn-primary flex-1 text-lg">
            {{ 'common.back' | translate }}
          </button>

          <!-- Start Learning Button -->
          <button (click)="start.emit()" class="btn btn-gradient-primary flex-1 text-lg whitespace-nowrap">
            <lucide-angular [img]="SparklesIcon" class="w-6 h-6 mr-2"></lucide-angular>
            {{ 'edit_text.start_btn' | translate }}
          </button>
        </div>

      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditText {
  text = input.required<string>();
  back = output<void>();
  textChange = output<string>();
  start = output<void>();

  readonly SparklesIcon = Sparkles;

  onInput(event: Event) {
    const newValue = (event.target as HTMLTextAreaElement).value;
    this.textChange.emit(newValue);
  }
}
