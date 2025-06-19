import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { ResponseData } from '../../models/responses/response-data';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  roomName: string = '';
  
  constructor(private chatService: ChatService) { }

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
    .then((res: ResponseData<boolean>) => {
      if(res.isSuccessful) {
        console.log('Created chat room!');
      }
      else {
        console.log('Failed to create!');
      }
    });
  }

  onJoinRoom(): void {
    console.log(this.roomName);

    if (this.roomName) {
      this.chatService.joinChatRoom(this.roomName)
      .then((res: ResponseData<boolean>) => {
        if(res.isSuccessful) {
          console.log('Joined chat room!');
        }
        else {
          console.log('Failed to join!');
        }
      });
    }
  }
}
