import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { ROUTES } from "../shared/constants/routes";
import { inject } from "@angular/core";
import { ChatService } from "../services/chat.service";
import { Injectable } from '@angular/core';
import { ResponseData } from "../models/responses/response-data";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ChatRoomGuard implements CanActivate {
	private router = inject(Router);
	private chatService = inject(ChatService);

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
		console.log('chat room guard');

		const roomCode = route.params['roomCode'];
		if (!roomCode) {
			return Promise.resolve(this.navigateToHome());
		}
		
		//Connection check
		let isConnected = await firstValueFrom(this.chatService.isConnected$);
		if (!isConnected) {
			//Reconnect
			const isReconnected = await this.chatService.connectionStart();
			if (!isReconnected) {
				//Redirect on failure
				return this.navigateToHome();
			}
		}

		return this.chatService.joinChatRoom(roomCode)
			.then((res: ResponseData<string>) => {
					if(res.isSuccessful) {
						return true;
					}
					else {
						return this.navigateToHome();
					}
			});
	}

	private navigateToHome(): UrlTree {
		return this.router.createUrlTree([ROUTES.HOME]);
	}
}