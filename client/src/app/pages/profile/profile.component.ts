import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { UserSkillsComponent } from '../../components/user-skills/user-skills.component';
import { UserInterestsComponent } from '../../components/user-interests/user-interests.component';
import { UserExperiencesComponent } from '../../components/user-experiences/user-experiences.component';
import { UserEducationComponent } from "../../components/user-education/user-education.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    UserSkillsComponent,
    AuthHeaderComponent,
    UserInterestsComponent,
    UserExperiencesComponent,
    UserEducationComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {}
