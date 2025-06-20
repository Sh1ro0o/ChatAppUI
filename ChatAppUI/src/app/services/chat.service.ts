import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { environment } from "../../environments/environment";
import { LocalStorageService } from "./local-storage.service";
import { ResponseData } from "../models/responses/response-data";

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
    }

    connectionStart(): Promise<boolean> {
        return this.connection.start()
            .then(() => true)
            .catch(() => false);
    }

    connectionStop(): Promise<boolean> {
        return this.connection.stop()
            .then(() => true)
            .catch(() => false);
    }

    createChatRoom(): Promise<ResponseData<string>> {
        return this.connection.invoke('CreateRoom')
            .then((data: ResponseData<string>) => data)
            .catch((error) => {
                const result: ResponseData<string> = {
                    isSuccessful: false,
                    errorMessage: 'Connection failed'
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
                    errorMessage: 'Connection failed',
                };

                return result;
            });
    }
}