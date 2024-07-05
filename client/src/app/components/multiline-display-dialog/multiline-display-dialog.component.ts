import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MultilineDialogData } from '../../classes/multiline-dialog-data';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-multiline-display-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgFor],
  templateUrl: './multiline-display-dialog.component.html',
  styleUrl: './multiline-display-dialog.component.css',
})
export class MultilineDisplayDialogComponent {
  title: string = '';
  message: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: MultilineDialogData) {
    this.title = data.title || 'Multiline Display';
    const lines = data.lines || [];
    this.message = lines.join('<br>');
  }
}
