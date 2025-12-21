import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, House, BookOpen, Star, Settings } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, TranslateModule],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-2xl z-50 border-t border-white/20" aria-label="Main navigation">
      <ul class="flex flex-row justify-around items-center h-24 px-4 py-4 list-none m-0">
        
        <!-- Home -->
        <li>
          <a routerLink="/home" routerLinkActive="active" class="group flex flex-col items-center justify-center w-15 h-15 rounded-3xl transition-all duration-300 text-neutral/40 hover:text-primary [&.active]:bg-primary/10 [&.active]:text-primary ">
            <lucide-angular [img]="HouseIcon" class="transition-transform duration-300 group-[.active]:scale-110" strokeWidth="2.5"></lucide-angular>
            <span class="font-heading text-xs font-medium">{{ 'common.nav.home' | translate }}</span>
          </a>
        </li>

        <!-- Learn -->
        <li>
          <a routerLink="/learn" routerLinkActive="active" class="group flex flex-col items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300 text-neutral/40 hover:text-secondary [&.active]:bg-secondary/10 [&.active]:text-secondary ">
            <lucide-angular [img]="BookIcon" class="transition-transform duration-300 group-[.active]:scale-110" strokeWidth="2.5"></lucide-angular>
            <span class="font-heading text-xs font-medium">{{ 'common.nav.learn' | translate }}</span>
          </a>
        </li>

        <!-- Favorites -->
        <li>
          <a routerLink="/favorites" routerLinkActive="active" class="group flex flex-col items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300 text-neutral/40 hover:text-accent [&.active]:bg-accent/10 [&.active]:text-accent ">
            <lucide-angular [img]="StarIcon" class="transition-transform duration-300 group-[.active]:scale-110" strokeWidth="2.5"></lucide-angular>
            <span class="font-heading text-xs font-medium">{{ 'common.nav.favorites' | translate }}</span>
          </a>
        </li>

        <!-- Settings -->
        <li>
          <a routerLink="/settings" routerLinkActive="active" class="group flex flex-col items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300 text-neutral/40 hover:text-neutral [&.active]:bg-neutral/10 [&.active]:text-neutral ">
            <lucide-angular [img]="SettingsIcon" class="transition-transform duration-300 group-[.active]:scale-110" strokeWidth="2.5"></lucide-angular>
            <span class="font-heading text-xs font-medium">{{ 'common.nav.settings' | translate }}</span>
          </a>
        </li>

      </ul>
    </nav>
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
