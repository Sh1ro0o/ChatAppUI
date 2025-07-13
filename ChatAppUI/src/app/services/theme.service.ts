import { inject, Injectable } from '@angular/core';
import { THEMES } from '../shared/constants/themes.constant';
import { LocalStorageKeys } from '../enums/local-storage-keys.enum';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly localStorageService = inject(LocalStorageService);

  switchTheme(theme: string) {
    const htmlEl = document.documentElement;
    
    htmlEl.classList.remove(...Object.values(THEMES));
    
    //Add the selected theme class
    htmlEl.classList.add(theme);

    //Save to localStorage
    this.localStorageService.set(LocalStorageKeys.THEME, theme);
}
}