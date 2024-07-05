import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner-dialog',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinner-dialog.component.html',
  styleUrl: './spinner-dialog.component.css',
})
export class SpinnerDialogComponent {
  constructor() {}
}
