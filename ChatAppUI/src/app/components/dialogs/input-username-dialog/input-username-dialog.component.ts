import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LocalStorageKeys } from '../../../enums/local-storage-keys.enum';

@Component({
  selector: 'app-input-username-dialog',
  imports: [FormsModule, MatDialogModule],
  templateUrl: './input-username-dialog.component.html',
  styleUrl: './input-username-dialog.component.css'
})
export class InputUsernameDialogComponent implements OnInit {
  username: string = '';
  maxLength: number = 25;

  private readonly dialogRef = inject(MatDialogRef<InputUsernameDialogComponent>);
  private readonly localStorageService = inject(LocalStorageService);

  ngOnInit(): void {
    let existingUsername = this.localStorageService.get<string>(LocalStorageKeys.USERNAME);
    if (existingUsername) {
      this.username = existingUsername.trim().slice(0, this.maxLength);
    }
  }

  onSubmit() {
    this.localStorageService.set(LocalStorageKeys.USERNAME, this.username);
    this.dialogRef.close(this.username);
  }
}
