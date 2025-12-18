import { Component, input, output, effect, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Sparkles } from 'lucide-angular';


@Component({
  selector: 'app-edit-text',
  imports: [TranslateModule, LucideAngularModule],
  template: `
    <div class="card bg-white shadow-xl border border-base-200 animate-fade-in-up w-full max-w-2xl mx-auto">
      <div class="card-body p-8">
        
        <h2 class="font-heading text-2xl text-neutral font-black mb-6 text-center">
          Edit Your Text
        </h2>

        <div class="form-control mb-8">
          <textarea 
            name="storyText"
            [value]="text()" 
            (input)="onInput($event)"
            class="textarea textarea-bordered h-64 w-full text-lg leading-relaxed resize-none bg-orange-50/30 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-2xl p-6"
            placeholder="Enter your text here...">
          </textarea>
        </div>

        <div class="flex flex-row gap-6 justify-center">
          <!-- Back Button -->
          <button (click)="back.emit()" class="btn btn-lg bg-white border-2 border-orange-100 hover:border-orange-200 hover:bg-orange-50 text-orange-400 rounded-2xl flex-1 font-sans font-medium h-16 text-lg">
            {{ 'common.back' | translate }}
          </button>

          <!-- Start Learning Button -->
          <button (click)="start.emit()" class="btn btn-lg border-none text-white rounded-2xl flex-1 font-sans font-medium shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-orange-400 to-yellow-400 h-16 text-lg whitespace-nowrap">
            <lucide-angular [img]="SparklesIcon" class="w-6 h-6 mr-2"></lucide-angular>
            Start Learning!
          </button>
        </div>

      </div>
    </div>
  `,
  styles: []
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
