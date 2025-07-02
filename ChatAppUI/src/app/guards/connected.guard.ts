import { inject, Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { ChatService } from "../services/chat.service";
import { ROUTES } from "../shared/constants/routes";
import { firstValueFrom, map, Observable, Subscription, take } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ConnectedGuard implements CanActivate {
	private router = inject(Router);
	private chatService = inject(ChatService);

	async canActivate(): Promise<boolean | UrlTree> {
		//Connection check
		console.log('connected guard');
		let isConnected = await firstValueFrom(this.chatService.isConnected$);
		if (isConnected) {
			return true;
		}
		
		//Reconnect
		const isReconnected = await this.chatService.connectionStart();
		if (isReconnected) {
			return true;
		}

		//Redirect on failure
		return this.navigateToHome();
	}

	private navigateToHome(): UrlTree {
		return this.router.createUrlTree([ROUTES.HOME]);
	}
}