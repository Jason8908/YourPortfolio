import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-notice',
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './profile-notice.component.html',
  styleUrl: './profile-notice.component.css'
})
export class ProfileNoticeComponent {
  profileComplete: boolean = true;
  constructor(private apiService: ApiService) { }
  ngOnInit() {
    this.checkProfileComplete();
  }
  checkProfileComplete() {
    this.profileComplete = true;
    // Skills
    this.apiService.getUserSkills().subscribe({
      next: (response) => {
        if (response.data.totalCount < 1) {
          this.profileComplete = false;
        }
      }
    });
    // Interests
    this.apiService.getUserInterests().subscribe({
      next: (response) => {
        if (response.data.totalCount < 1) {
          this.profileComplete = false;
        }
      }
    });
    // Experiences
    this.apiService.getUserExperiences().subscribe({
      next: (response) => {
        if (response.data.totalCount < 1) {
          this.profileComplete = false;
        }
      }
    });
    // Educations
    this.apiService.getUserEducation().subscribe({
      next: (response) => {
        if (response.data.totalCount < 1) {
          this.profileComplete = false;
        }
      }
    });
  }
}
