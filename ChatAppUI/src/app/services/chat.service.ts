import { inject, Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { environment } from "../../environments/environment";
import { LocalStorageService } from "./local-storage.service";
import { ResponseData } from "../models/responses/response-data";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { ROUTES } from "../shared/constants/routes";

@Injectable({
  providedIn: 'root',
})

export class ChatService {
    private connection!: signalR.HubConnection;
    private apiUrl: string = environment.apiUrl;

    private isConnectedSubject = new BehaviorSubject<boolean>(false);
    isConnected$: Observable<boolean> = this.isConnectedSubject.asObservable();

    private router = inject(Router);

    constructor(
    ) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.apiUrl}/chat`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.onclose(() => {
            this.router.navigate([ROUTES.HOME]);
            this.isConnectedSubject.next(false);
        });
    }

    connectionStart(): Promise<boolean> {
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