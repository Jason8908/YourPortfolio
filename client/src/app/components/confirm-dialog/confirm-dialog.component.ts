import { Component, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { ConfirmDialogData } from '../../classes/confirm-dialog-data';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  message: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    this.message = data.message || "Are you sure you want to do this?";
  }
}
