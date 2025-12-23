import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNav } from '../../../shared/components/bottom-nav/bottom-nav';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, BottomNav],
  template: `
    <div class="min-h-screen bg-base-100 flex flex-col relative overflow-hidden">
      <main class="flex-1 container mx-auto px-4 py-6 pb-24 max-w-md md:max-w-2xl lg:max-w-4xl relative z-10">
        <router-outlet />
      </main>

      <app-bottom-nav />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayout {}
