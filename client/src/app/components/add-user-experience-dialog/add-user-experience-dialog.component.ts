import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserExperience } from '../../classes/experiences';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-add-user-experience-dialog',
  standalone: true,
  imports: [MatDialogModule, MatInputModule, FormsModule, MatButtonModule, MatDatepickerModule, MatGridListModule],
  templateUrl: './add-user-experience-dialog.component.html',
  styleUrl: './add-user-experience-dialog.component.css'
})
export class AddUserExperienceDialogComponent {
  exp: UserExperience = {} as UserExperience;
  constructor() {}
}
