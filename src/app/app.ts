import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, House } from 'lucide-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private translate = inject(TranslateService);
  protected readonly title = signal('word-wonder');
  protected readonly HouseIcon = House;

  constructor() {
    this.translate.addLangs(['en']);
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }
}
