import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-input-username-dialog',
  imports: [FormsModule, MatDialogModule],
  templateUrl: './input-username-dialog.component.html',
  styleUrl: './input-username-dialog.component.css'
})
export class InputUsernameDialogComponent {
  username: string = '';

  private readonly dialogRef = inject(MatDialogRef<InputUsernameDialogComponent>);

  onSubmit() {
    this.dialogRef.close(this.username);
  }
}
