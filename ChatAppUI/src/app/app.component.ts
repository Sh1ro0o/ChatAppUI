import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './shared/constants/routes';
import { ChatService } from './services/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ChatAppUI';
  routes = ROUTES

  chatService = inject(ChatService);

  connectToServer() {
    this.chatService.connectionStart()
      .then((success) => {
        if(success) {
          console.log('connection established!!!!');
        }
        else {
          console.log('connection failed!!!!');
        }
    })
  }
}
