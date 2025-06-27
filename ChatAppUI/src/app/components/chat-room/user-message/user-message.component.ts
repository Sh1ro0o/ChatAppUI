import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-user-message',
  imports: [],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.css'
})
export class UserMessageComponent {
  username: InputSignal<string> = input.required<string>();
  message: InputSignal<string> = input.required<string>();
}
