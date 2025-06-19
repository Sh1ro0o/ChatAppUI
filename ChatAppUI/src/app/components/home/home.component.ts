import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.connectionStart();
  }

  onCreateLobby(): void {
    this.chatService.createChatLobby();
  }
}
