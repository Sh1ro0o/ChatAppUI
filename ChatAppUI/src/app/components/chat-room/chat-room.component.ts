import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageRequest } from '../../models/requests/message.request';
import { ActivatedRoute } from '@angular/router';
import { MessageData } from '../../models/data/message-data';
import { UserMessageComponent } from './user-message/user-message.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';

@Component({
  selector: 'app-chat-room',
  imports: [ReactiveFormsModule, UserMessageComponent],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  sendMessageForm!: FormGroup;
  chatRoomName: string = "";
  username: string = "";

  //message data
  messages: MessageData[] = [];

  private readonly chatService = inject(ChatService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.chatRoomName = this.route.snapshot.paramMap.get('roomCode') ?? '';
    this.username = this.localStorageService.get<string>(LocalStorageKeys.USERNAME) ?? 'User';

    this.sendMessageForm = this.fb.group({
      newMessage: ['', Validators.required]
    });

    //subscribe to new messages received
    this.chatService.isNewMessageReceived$.subscribe({
      next: (receivedMessage: MessageData) => {
        this.messages.push(receivedMessage);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.chatService.leaveChatRoom();
  }

  onSubmit(): void {
    if (this.sendMessageForm.valid) {
      const messageControl: FormControl<string> = this.sendMessageForm.get('newMessage') as FormControl<string>;
      const newMessage: string = messageControl?.value || '';
      const trimmedMessage = newMessage.trim();

      if(trimmedMessage) {
        let messageRequest: MessageRequest = new MessageRequest(this.chatRoomName, this.username, trimmedMessage);

        this.chatService.sendMessage(messageRequest)
          .then((data) => {
            if(data.isSuccessful) {
              this.messages.push({message: trimmedMessage, username: this.username} as MessageData);
              messageControl?.setValue('');
            }
            else {
              //! Error displayed message could not be sent
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }
}
