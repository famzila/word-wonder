import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNav } from '../../../shared/components/bottom-nav/bottom-nav';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, BottomNav],
  template: `
    <div class="min-h-screen bg-base-100 flex flex-col pb-24"> <!-- Padding bottom for fixed nav -->
      <router-outlet></router-outlet>
      <app-bottom-nav class="fixed bottom-0 left-0 right-0"></app-bottom-nav>
    </div>
  `,
  styles: []
})
export class MainLayout {}
