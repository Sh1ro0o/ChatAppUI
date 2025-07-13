import { Component, inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ROUTES } from '../../shared/constants/routes';
import { MatDialog } from '@angular/material/dialog';
import { ResponseData } from '../../models/responses/response-data';
import { ThemeSelectorComponent } from '../shared/theme-selector/theme-selector.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterModule, ThemeSelectorComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  roomName: string = '';
  ROUTES = ROUTES;
    
  private readonly chatService = inject(ChatService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  onCreateRoom(): void {
    this.chatService.createChatRoom()
      .then((res: ResponseData<string>) => {
        if(res.isSuccessful) {
          console.log('Created chat room!');
          this.router.navigate([this.ROUTES.CHAT_ROOM, res.data]);
        }
        else {
          console.log('Failed to create!');
        }
    });
  }

  onJoinRoom(): void {
    if (this.roomName) {
      console.log('navigationg');
      this.router.navigate([this.ROUTES.CHAT_ROOM, this.roomName]);
    }
  }
}
