import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, House, BookOpen, Star, Settings } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, TranslateModule],
  template: `
    <div class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] z-50 border-t border-white/20 flex flex-row justify-center gap-4 items-center h-24 px-4 py-4">
      
      <!-- Home -->
      <a routerLink="/home" routerLinkActive="active" class="group flex flex-col items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300 text-neutral/40 hover:text-primary [&.active]:bg-orange-50 [&.active]:text-primary ">
        <lucide-angular [img]="HouseIcon" class="w-7 h-7 mb-1.5 transition-transform duration-300 group-[.active]:scale-110" strokeWidth="2.5"></lucide-angular>
        <span class="font-heading text-[11px] font-medium">{{ 'common.nav.home' | translate }}</span>
      </a>

      <!-- Learn -->
      <a routerLink="/learn" routerLinkActive="active" class="group flex flex-col items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300 text-neutral/40 hover:text-secondary [&.active]:bg-blue-50 [&.active]:text-secondary ">
        <lucide-angular [img]="BookIcon" class="w-7 h-7 mb-1.5 transition-transform duration-300 group-[.active]:scale-110" strokeWidth="2.5"></lucide-angular>
        <span class="font-heading text-[11px] font-medium">{{ 'common.nav.learn' | translate }}</span>
      </a>

      <!-- Favorites -->
      <a routerLink="/favorites" routerLinkActive="active" class="group flex flex-col items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300 text-neutral/40 hover:text-accent [&.active]:bg-yellow-50 [&.active]:text-accent ">
        <lucide-angular [img]="StarIcon" class="w-7 h-7 mb-1.5 transition-transform duration-300 group-[.active]:scale-110" strokeWidth="2.5"></lucide-angular>
        <span class="font-heading text-[11px] font-medium">{{ 'common.nav.favorites' | translate }}</span>
      </a>

      <!-- Settings -->
      <a routerLink="/settings" routerLinkActive="active" class="group flex flex-col items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300 text-neutral/40 hover:text-neutral [&.active]:bg-gray-100 [&.active]:text-neutral ">
        <lucide-angular [img]="SettingsIcon" class="w-7 h-7 mb-1.5 transition-transform duration-300 group-[.active]:scale-110" strokeWidth="2.5"></lucide-angular>
        <span class="font-heading text-[11px] font-medium">{{ 'common.nav.settings' | translate }}</span>
      </a>

    </div>
  `,
  styles: [`
    :host { display: block; }
    /* Override DaisyUI btm-nav default interactions if needed, but Tailwind classes above handle most */
  `]
})
export class BottomNav {
  readonly HouseIcon = House;
  readonly BookIcon = BookOpen;
  readonly StarIcon = Star;
  readonly SettingsIcon = Settings;
}
