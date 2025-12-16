import { Component, inject, signal, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Header } from '../../../shared/components/header/header';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-focus-layout',
  imports: [RouterOutlet, Header],
  template: `
    <div class="min-h-screen bg-base-100 flex flex-col">
      <app-header [title]="title() ?? ''" [showBack]="true"></app-header>
      <div class="flex-1 p-4">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: []
})
export class FocusLayout {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Simple logic to find the deepest child route's title data
  title = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.route;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.data['title'] || '';
      })
    )
  );
}
