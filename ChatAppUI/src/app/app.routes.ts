import { Routes } from '@angular/router';
import { ChatRoomGuard } from './guards/chat-room.guard';
import { ConnectedGuard } from './guards/connected.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'chat-room/:roomCode',
        loadComponent: () => import('./components/chat-room/chat-room.component').then((m) => m.ChatRoomComponent),
        canActivate: [ChatRoomGuard]
    }
];
