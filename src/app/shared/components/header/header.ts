import { Component, input, output, inject } from '@angular/core';
import { Location } from '@angular/common';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  template: `
    <div class="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-40 px-4 py-2 min-h-[64px]">
      <div class="navbar-start w-1/4">
        @if (showBack()) {
          <button (click)="goBack()" class="btn btn-ghost btn-circle text-neutral hover:bg-neutral/10 hover:text-primary transition-colors">
            <lucide-angular [img]="ArrowLeftIcon" class="w-6 h-6" strokeWidth="3"></lucide-angular>
          </button>
        }
      </div>
      
      <div class="navbar-center w-1/2 flex justify-center">
        <h1 class="font-heading text-2xl text-primary font-bold tracking-wide drop-shadow-sm truncate animate-fade-in-down">
          {{ title() }}
        </h1>
      </div>
      
      <div class="navbar-end w-1/4">
        <!-- Future action buttons can go here -->
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in-down {
      animation: fadeInDown 0.3s ease-out;
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class Header {
  title = input.required<string>();
  showBack = input<boolean>(true);
  
  private location = inject(Location);
  readonly ArrowLeftIcon = ArrowLeft;

  goBack() {
    this.location.back();
  }
}
