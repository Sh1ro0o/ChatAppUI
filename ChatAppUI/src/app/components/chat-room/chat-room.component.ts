import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageRequest } from '../../models/requests/message.request';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageData } from './models/message-data';
import { UserMessageComponent } from './user-message/user-message.component';
import { MatDialog } from '@angular/material/dialog';
import { InputUsernameDialogComponent } from '../dialogs/input-username-dialog/input-username-dialog.component';
import { ROUTES } from '../../shared/constants/routes';
import { MessageTypeEnum } from './enums/message-type.enum';
import { SystemMessageComponent } from './system-message/system-message.component';
import { SystemMessages } from './messages/system-messages';
import { Subscription } from 'rxjs';

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

  //Subscriptions
  private newMessageSub!: Subscription;

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
        const systemMessageRequest: MessageRequest = new MessageRequest(this.chatRoomName, this.messageTypeEnum.System ,this.username, SystemMessages.joined(this.username));
        this.chatService.sendMessage(systemMessageRequest)
          .then((data) => {
            if(data.isSuccessful) {
              this.messages.push({
                username: this.username,
                message: SystemMessages.joined(this.username),
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
        this.newMessageSub = this.chatService.isNewMessageReceived$.subscribe({
          next: (receivedMessage: MessageData) => {
            console.log(receivedMessage);
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
    this.newMessageSub.unsubscribe();
  }

  onSubmit(): void {
    if (this.sendMessageForm.valid) {
      const messageControl: FormControl<string> = this.sendMessageForm.get('newMessage') as FormControl<string>;
      const newMessage: string = messageControl?.value || '';
      const trimmedMessage = newMessage.trim();

      if(trimmedMessage) {
        const messageRequest: MessageRequest = new MessageRequest(this.chatRoomName, MessageTypeEnum.User ,this.username, trimmedMessage);

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

  onLeave(): void {
    //leave chatroom and notify others
    const messageRequest: MessageRequest = new MessageRequest(this.chatRoomName, MessageTypeEnum.System ,this.username, SystemMessages.left(this.username));
    this.chatService.sendMessage(messageRequest)
      .then((data) => {
        if (data.isSuccessful) {
          this.chatService.leaveChatRoom()
            .catch((error) => {
              this.chatService.connectionStop();
          });
        }
      })
      .catch((error) => {
        console.error('Leave error', error);

        // Fallback ensure connection is stopped if leave fails
        this.chatService.connectionStop();
      });
  }
}
