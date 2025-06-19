import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './shared/constants/routes';

@Component({
  selector: 'app-root',
  imports: [RouterModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ChatAppUI';
  routes = ROUTES
}
