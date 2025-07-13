import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { THEMES } from '../../../shared/constants/themes.constant';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LocalStorageKeys } from '../../../enums/local-storage-keys.enum';

@Component({
  selector: 'app-theme-selector',
  imports: [],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.css'
})
export class ThemeSelectorComponent {
  themes = THEMES;

  private readonly themeService = inject(ThemeService);
  private readonly localStorageService = inject(LocalStorageService);

  selectTheme(themeValue: string) {
    this.themeService.switchTheme(themeValue);
  }
}
