import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-interest-dialog',
  standalone: true,
  imports: [MatDialogModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './add-interest-dialog.component.html',
  styleUrl: './add-interest-dialog.component.css',
})
export class AddInterestDialogComponent {
  interestInput: string | null = null;
  constructor() {}
}
