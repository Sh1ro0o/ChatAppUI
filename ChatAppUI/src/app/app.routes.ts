import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'chat-room/:roomCode',
        loadComponent: () => import('./components/chat-room/chat-room.component').then((m) => m.ChatRoomComponent),
    }
];
