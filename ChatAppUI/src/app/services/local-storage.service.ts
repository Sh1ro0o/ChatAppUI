//local-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class LocalStorageService {
	set(key: string, value: any) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	get<T>(key: string): T | null {
		var item = localStorage.getItem(key);

		if (item) {
			return JSON.parse(item) as T;
		}
		else {
			return null;
		}
	}

	remove(key: string) {
		localStorage.removeItem(key);
	}

	clear() {
		localStorage.clear();
	}
}