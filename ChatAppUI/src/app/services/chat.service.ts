import { inject, Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { environment } from "../../environments/environment";
import { ResponseData } from "../models/responses/response-data";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { ROUTES } from "../shared/constants/routes";
import { MessageData } from "../components/chat-room/models/message-data";
import { MessageRequest } from "../models/requests/message.request";

@Injectable({
  providedIn: 'root',
})

export class ChatService {
	private connection!: signalR.HubConnection;
	private apiUrl: string = environment.apiUrl;

	private isConnectedSubject = new BehaviorSubject<boolean>(false);
	isConnected$: Observable<boolean> = this.isConnectedSubject.asObservable();

	private isNewMessageReceivedSubject = new Subject<MessageData>();
	isNewMessageReceived$: Observable<MessageData> = this.isNewMessageReceivedSubject.asObservable();

	private router = inject(Router);

	constructor( ) {
		//Connect
		this.connection = new signalR.HubConnectionBuilder()
			.withUrl(`${this.apiUrl}/chat`)
			.configureLogging(signalR.LogLevel.Information)
			.build();

		//OnClose
		this.connection.onclose(() => {
			this.router.navigate([ROUTES.HOME]);
			this.isConnectedSubject.next(false);
		});

		//OnMessageReceived
		this.connection.on('ReceiveMessage', (message) => this.receiveMessage(message));
	}

	/************************/
	/*<---- CONNECTION ---->*/
	/************************/
	connectionStart(): Promise<boolean> {
		console.log('connection start');
			return this.connection.start()
					.then(() => {
							this.isConnectedSubject.next(true);
							return true;
					})
					.catch(() => {
							this.isConnectedSubject.next(false);
							return false;
					});
	}

	connectionStop(): Promise<boolean> {
			return this.connection.stop()
					.then(() => true)
					.catch(() => false);
	}

	/*************************/
	/*<---- HUB METHODS ---->*/
	/*************************/
	createChatRoom(): Promise<ResponseData<string>> {
			return this.connection.invoke('CreateRoom')
					.then((data: ResponseData<string>) => data)
					.catch((error) => {
							const result: ResponseData<string> = {
									isSuccessful: false,
									errorMessage: 'Connection failed!'
							};

							return result;
					});
	}

	joinChatRoom(roomName: string): Promise<ResponseData<string>> {
			return this.connection.invoke('JoinRoom', roomName)
					.then((data: ResponseData<string>) => data)
					.catch((error) => {
							const result: ResponseData<string> = {
									isSuccessful: false,
									errorMessage: 'Connection failed!',
							};

							return result;
					});
	}

	leaveChatRoom(): Promise<ResponseData<boolean>> {
		return this.connection.invoke('LeaveRoom')
				.then((data: ResponseData<boolean>) => data)
				.catch((error) => {
							const result: ResponseData<boolean> = {
									isSuccessful: false,
									errorMessage: 'Connection failed!',
							};

							return result;
					});
	}

	sendMessage(messageRequest: MessageRequest) {
		return this.connection.invoke('SendMessage', messageRequest)
					.then((data: ResponseData<boolean>) => data)
					.catch((error) => {
							const result: ResponseData<boolean> = {
									isSuccessful: false,
									errorMessage: 'Message failed to send!',
							};

							return result;
					});
	}

	/****************************/
	/*<---- CLIENT METHODS ---->*/
	/****************************/
	receiveMessage(message: MessageData) {
		this.isNewMessageReceivedSubject.next(message);
	}
}