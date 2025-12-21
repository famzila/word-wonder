import { Component, input, computed } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header',
  imports: [LucideAngularModule, TranslatePipe],
  template: `
    <header class="pt-12 px-2 pb-2 text-center bg-base-100">
      <div [class]="iconContainerClasses()" class="animate-float">
        <lucide-angular [img]="icon()" [class]="iconClasses()" strokeWidth="2.5"></lucide-angular>
      </div>
      
      <h1 class="page-header-title">
        {{ title() | translate }}
      </h1>
      
      @if (subtitle()) {
        <p class="page-header-subtitle">
          {{ subtitle() | translate }}
        </p>
      }

      @if (badge()) {
        <div class="mt-4 inline-block">
          <span class="badge bg-white border-0 shadow-sm text-neutral/50 font-bold px-4 py-3 h-auto">
            {{ badge() }}
          </span>
        </div>
      }
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PageHeader {
  // Inputs
  icon = input.required<any>(); // Lucide icon class
  title = input.required<string>();
  subtitle = input<string | null>(null);
  badge = input<string | null>(null);
  iconBgColor = input<string>('bg-gradient-to-br from-orange-400 to-yellow-400');
  iconColor = input<string>('text-white');
  
  // Computed classes
  iconContainerClasses = computed(() => {
    const bgColor = this.iconBgColor();
    // Use utility class for default gradient, otherwise custom classes
    if (bgColor === 'bg-gradient-to-br from-orange-400 to-yellow-400') {
      return 'icon-container-primary mx-auto mb-6';
    }
    return `w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ${bgColor}`;
  });
  
  iconClasses = computed(() => `w-8 h-8 ${this.iconColor()}`);
}
