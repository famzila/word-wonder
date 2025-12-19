import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { effect } from '@angular/core';

type Language = 'en' | 'ar' | 'fr';

type SettingsState = {
  language: Language;
};

const initialState: SettingsState = {
  language: (localStorage.getItem('app-settings-lang') as Language) || 'en',
};

export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setLanguage(language: Language) {
      patchState(store, { language });
    },
  })),
  withHooks({
    onInit(store) {
      const translateService = inject(TranslateService);
      
      // Effect to sync with TranslateService and LocalStorage
      effect(() => {
        const lang = store.language();
        translateService.use(lang);
        localStorage.setItem('app-settings-lang', lang);
        
        // Update document dir for Arabic
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      });
    },
  })
);
