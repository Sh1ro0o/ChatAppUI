import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { ResponseData } from '../../models/responses/response-data';
import { Router, RouterModule } from '@angular/router';
import { ROUTES } from '../../shared/constants/routes';
import { MatDialog } from '@angular/material/dialog';
import { InputUsernameDialogComponent } from '../dialogs/input-username-dialog/input-username-dialog.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  roomName: string = '';
  ROUTES = ROUTES;
    
  private readonly chatService = inject(ChatService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  onCreateRoom(): void {
    //input username dialog
    const dialogRef = this.dialog.open(InputUsernameDialogComponent, {
      width: '400px',
      height: '400px',
      disableClose: true,
      panelClass: 'rounded-dialog',
    });

    dialogRef.afterClosed().subscribe({
      next: (username: string) => {
        this.chatService.createChatRoom()
          .then((res: ResponseData<string>) => {
            if(res.isSuccessful) {
              console.log('Created chat room!');
              this.localStorageService.set(LocalStorageKeys.USERNAME, username);
              this.router.navigate([this.ROUTES.CHAT_ROOM, res.data]);
            }
            else {
              console.log('Failed to create!');
            }
        });
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
