import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageRequest } from '../../models/requests/message.request';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageData } from '../../models/data/message-data';
import { UserMessageComponent } from './user-message/user-message.component';
import { MatDialog } from '@angular/material/dialog';
import { InputUsernameDialogComponent } from '../dialogs/input-username-dialog/input-username-dialog.component';
import { ROUTES } from '../../shared/constants/routes';
import { MessageTypeEnum } from '../../enums/message-data-types.enum';
import { SystemMessageRequest } from '../../models/requests/system-message.request';
import { SystemMessageComponent } from './system-message/system-message.component';

@Component({
  selector: 'app-chat-room',
  imports: [ReactiveFormsModule, UserMessageComponent, SystemMessageComponent],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  sendMessageForm!: FormGroup;
  chatRoomName: string = "";
  username: string = "";
  messageTypeEnum = MessageTypeEnum;
  ROUTES = ROUTES;

  //message data
  messages: MessageData[] = [];

  private readonly chatService = inject(ChatService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.chatRoomName = this.route.snapshot.paramMap.get('roomCode') ?? '';
    this.username = 'User';

    this.sendMessageForm = this.fb.group({
      newMessage: ['', Validators.required]
    });

    //Input username dialog
    const dialogRef = this.dialog.open(InputUsernameDialogComponent, {
      width: '400px',
      height: '400px',
      disableClose: true,
      panelClass: 'rounded-dialog',
    });

    dialogRef.afterClosed().subscribe({
      next: (username: string) => {
        this.username = username;
        //Notify others user has joined
        let systemMessageRequest: SystemMessageRequest = new SystemMessageRequest(this.chatRoomName, this.username);
        this.chatService.sendMessage(systemMessageRequest)
          .then((data) => {
            if(data.isSuccessful) {
              this.messages.push({
                username: this.username, 
                message: `${this.username} has joined!`,
                type: MessageTypeEnum.System
              } as MessageData);
            }
            else {
              this.router.navigate([this.ROUTES.HOME]); //redirect home if failed
            }
          })
          .catch((error) => {
            console.error(error);
          });

        //subscribe to new messages received
        this.chatService.isNewMessageReceived$.subscribe({
          next: (receivedMessage: MessageData) => {
            this.messages.push(receivedMessage);
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });

    
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
              this.messages.push({
                message: trimmedMessage, 
                username: this.username, 
                type: MessageTypeEnum.User
              } as MessageData);

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
