import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { environment } from "../../environments/environment";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: 'root',
})

export class ChatService {
    private connection!: signalR.HubConnection;
    private apiUrl: string = environment.apiUrl;

    constructor(
        private localStorageService: LocalStorageService
    ) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.apiUrl}/chat`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        console.log('constructed')
    }

    connectionStart() {
        console.log('connectionStart')
        this.connection.start()
        .then(() => console.log('SignalR Connected.'))
        .catch(err => {
            console.error('SignalR connection error:', err);
        });
    }

    connectionStop() {
        this.connection.stop()
        .then(() => 'SignalR Disconnected')
        .catch(err => {
            console.error('SignalR connection error:', err)
        });
    }

    createChatLobby() {
        this.connection.invoke('createLobby')
        .then(() => console.log('Lobby created!'))
        .catch(err => {
            console.error('SignalR connection error:', err);
        });
    }
}