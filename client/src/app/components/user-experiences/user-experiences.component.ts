import { NgFor, NgIf } from '@angular/common';
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
import { User } from '../../classes/user';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-experiences',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    AddInterestDialogComponent,
    MatExpansionModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-experiences.component.html',
  styleUrl: './user-experiences.component.css',
})
export class UserExperiencesComponent {
  experiences: Array<UserExperience> = [];
  readonly dialog = inject(MatDialog);
  loading: boolean = false;
  constructor(
    private apiService: ApiService,
    private snackbar: MatSnackBar
  ) {}

  updateUserExperiences(): any {
    this.loading = true;
    this.apiService.getUserExperiences().subscribe({
      next: (response) => {
        const result = response.data as ExperienceList;
        this.experiences = result.experiences;
        for (const experience of this.experiences) {
          experience.startDate = new Date(experience.startDate);
          if (experience.endDate) {
            experience.endDate = new Date(experience.endDate);
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snackbar.open(`Error: Could not update user experience`, 'OK');
      },
    });
  }

  ngOnInit() {
    this.updateUserExperiences();
  }

  addExperience() {
    if (this.loading) return;
    let dialogRef = this.dialog.open(AddUserExperienceDialogComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading = true;
      this.apiService.addUserExperience(result).subscribe(
        () => {
          this.updateUserExperiences();
        },
        (error) => {
          this.loading = false;
          console.log(`Error adding user experience: ${JSON.stringify(error)}`);
          this.snackbar.open(`Error adding user experience`, `OK`);
        }
      );
    });
  }

  updateExperience(expData: UserExperience) {
    if (this.loading) return;
    let dialogRef = this.dialog.open(AddUserExperienceDialogComponent, {
      width: '800px',
      data: { ...expData },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading = true;
      this.apiService.updateUserExperience(result).subscribe(
        () => {
          this.updateUserExperiences();
        },
        (error) => {
          this.loading = false;
          console.log(
            `Error updating user experience: ${JSON.stringify(error)}`
          );
          this.snackbar.open(`Error updating user experience`, `OK`);
        }
      );
    });
  }

  deleteExperience(experienceId: Number) {
    if (this.loading) return;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this experience?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.apiService
          .deleteUserExperience(experienceId)
          .subscribe(
            () => {
              this.updateUserExperiences();
            },
            (error) => {
              this.loading = false;
              console.log(
                `Error deleting user experience: ${JSON.stringify(error)}`
              );
              this.snackbar.open(`Error deleting user experience`, `OK`);
            }
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
