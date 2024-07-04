import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AddInterestDialogComponent } from '../add-interest-dialog/add-interest-dialog.component';
import { UserExperience, ExperienceList } from '../../classes/experiences';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddUserExperienceDialogComponent } from '../add-user-experience-dialog/add-user-experience-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
import { User } from '../../classes/user';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-experiences',
  standalone: true,
  imports: [
    NgFor,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    AddInterestDialogComponent,
    MatExpansionModule,
  ],
  templateUrl: './user-experiences.component.html',
  styleUrl: './user-experiences.component.css',
})
export class UserExperiencesComponent {
  user: User | null;
  experiences: Array<UserExperience> = [];
  readonly dialog = inject(MatDialog);
  constructor(
    private apiService: ApiService,
    private localStorage: LocalStorageService,
    private router: Router,
  ) {
    this.user = this.localStorage.getUser();
  }

  updateUserExperiences(): any {
    if (!this.user) return this.router.navigate(['']);
    this.apiService.getUserExperiences(this.user.id).subscribe((response) => {
      const result = response.data as ExperienceList;
      this.experiences = result.experiences;
      for (const experience of this.experiences) {
        experience.startDate = new Date(experience.startDate);
        if (experience.endDate) {
          experience.endDate = new Date(experience.endDate);
        }
      }
    });
  }

  ngOnInit() {
    this.updateUserExperiences();
  }

  addExperience() {
    let dialogRef = this.dialog.open(AddUserExperienceDialogComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.apiService.addUserExperience(this.user!.id, result).subscribe(
        () => {
          this.updateUserExperiences();
        },
        (error) => {
          console.log(`Error adding user experience: ${JSON.stringify(error)}`);
        },
      );
    });
  }

  deleteExperience(experienceId: Number) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this experience?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService
          .deleteUserExperience(this.user!.id, experienceId)
          .subscribe(
            () => {
              this.updateUserExperiences();
            },
            (error) => {
              console.log(
                `Error deleting user experience: ${JSON.stringify(error)}`,
              );
            },
          );
      }
    });
  }

  formatDate(date: Date): string {
    return (
      date.toLocaleString('default', { month: 'long' }) +
      ' ' +
      date.getFullYear()
    );
  }
}
