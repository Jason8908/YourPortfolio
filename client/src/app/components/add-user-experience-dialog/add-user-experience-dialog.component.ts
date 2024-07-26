import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserExperience } from '../../classes/experiences';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-user-experience-dialog',
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
  templateUrl: './add-user-experience-dialog.component.html',
  styleUrl: './add-user-experience-dialog.component.css',
})
export class AddUserExperienceDialogComponent {
  exp: UserExperience = {} as UserExperience;
  constructor(
    @Inject(MAT_DIALOG_DATA) public expData: UserExperience | undefined,
  ) {
    if (expData) {
      this.exp = expData;
    }
  }
}
