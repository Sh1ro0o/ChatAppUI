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

    createChatRoom(): Promise<ResponseData<boolean>> {
        return this.connection.invoke('CreateRoom')
            .then((data: ResponseData<boolean>) => data)
            .catch((error) => {
                const result: ResponseData<boolean> = {
                    isSuccessful: false,
                    errorMessage: 'Connection failed',
                    data: false
                };

                return result;
            });
    }

    joinChatRoom(roomName: string): Promise<ResponseData<boolean>> {
        return this.connection.invoke('JoinRoom', roomName)
            .then((data: ResponseData<boolean>) => data)
            .catch((error) => {
                const result: ResponseData<boolean> = {
                    isSuccessful: false,
                    errorMessage: 'Connection failed',
                    data: false
                };

                return result;
            });
    }
}