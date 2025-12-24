import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { House } from 'lucide-angular';

import { SettingsStore } from './core/store/settings.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly translate = inject(TranslateService);
  private readonly settingsStore = inject(SettingsStore);
  protected readonly title = signal('word-wonder');
  protected readonly HouseIcon = House;

  constructor() {
    this.translate.addLangs(['en', 'ar', 'fr']);
    this.translate.setFallbackLang('en');
    this.translate.use(this.settingsStore.language());
  }
}
