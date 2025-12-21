import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { SettingsStore } from '../../core/store/settings.store';
import { LucideAngularModule, Settings as SettingsIcon, Check, Languages } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeader } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-settings',
  imports: [LucideAngularModule, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.html',
})
export class Settings {
  private store = inject(SettingsStore);
  
  readonly SettingsIcon = SettingsIcon;
  readonly CheckIcon = Check;
  readonly LanguagesIcon = Languages;

  currentLang = this.store.language;

  languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ] as const;

  setLanguage(code: 'en' | 'ar' | 'fr') {
    this.store.setLanguage(code);
  }
}
