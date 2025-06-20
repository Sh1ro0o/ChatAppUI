import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { ResponseData } from '../../models/responses/response-data';
import { Router, RouterModule } from '@angular/router';
import { ROUTES } from '../../shared/constants/routes';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  roomName: string = '';
  ROUTES = ROUTES;
    
  private chatService = inject(ChatService);
  private router = inject(Router);

  ngOnInit(): void {
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
      this.chatService.joinChatRoom(this.roomName)
      .then((res: ResponseData<string>) => {
        if(res.isSuccessful) {
          console.log('Joined chat room!');
          this.router.navigate([this.ROUTES.CHAT_ROOM, res.data]);
        }
        else {
          console.log('Failed to join!');
        }
      });
    }
  }
}
