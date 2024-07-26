import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { Education } from '../../classes/education';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-user-education-dialog',
  standalone: true,
  imports: [
    NgIf,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatGridListModule,
  ],
  templateUrl: './add-user-education-dialog.component.html',
  styleUrl: './add-user-education-dialog.component.css'
})
export class AddUserEducationDialogComponent {
  education: Education = {} as Education;
  constructor(
    @Inject(MAT_DIALOG_DATA) public eduData: Education | undefined,
  ) {
    if (eduData) {
      this.education = eduData;
    }
  }
}
