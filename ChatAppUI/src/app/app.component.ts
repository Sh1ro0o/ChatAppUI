import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './shared/constants/routes';
import { ChatService } from './services/chat.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { THEMES } from './shared/constants/themes.constant';
import { LocalStorageService } from './services/local-storage.service';
import { LocalStorageKeys } from './enums/local-storage-keys.enum';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Chat';
  routes = ROUTES
  selectedTheme: string = '';

  readonly chatService = inject(ChatService);
  readonly themeService = inject(ThemeService);
  readonly localStorageService = inject(LocalStorageService);

  ngOnInit(): void {
    this.setInitialTheme();
  }

  connectToServer() {
    this.chatService.connectionStart()
      .then((success) => {
        if(success) {
          console.log('connection established!!!!');
        }
        else {
          console.log('connection failed!!!!');
        }
    });
  }

  private setInitialTheme() {
    const storedTheme: string | null = this.localStorageService.get<string>(LocalStorageKeys.THEME);
    const validThemes = Object.values(THEMES);

    if(storedTheme && validThemes.includes(storedTheme)) {
      this.selectedTheme = storedTheme;
    }
    else {
      this.selectedTheme = THEMES.SAKURA_THEME; //default theme
    }

    this.themeService.switchTheme(this.selectedTheme);
  }
}
