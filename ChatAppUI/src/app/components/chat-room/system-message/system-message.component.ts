import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-system-message',
  imports: [],
  templateUrl: './system-message.component.html',
  styleUrl: './system-message.component.css'
})
export class SystemMessageComponent {
  message: InputSignal<string> = input.required<string>();
}
