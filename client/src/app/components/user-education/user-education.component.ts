import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AddInterestDialogComponent } from '../add-interest-dialog/add-interest-dialog.component';
import { ApiService } from '../../services/api.service';
import { Education, EducationList } from '../../classes/education';
import { AddUserEducationDialogComponent } from '../add-user-education-dialog/add-user-education-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-education',
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
  templateUrl: './user-education.component.html',
  styleUrl: './user-education.component.css'
})
export class UserEducationComponent {
  educations: Array<Education> = [];
  loading: boolean = false;
  readonly dialog = inject(MatDialog);
  constructor(private apiService: ApiService, private snackbar: MatSnackBar) {}
  addEducation() {
    if (this.loading) return;
    let dialogRef = this.dialog.open(AddUserEducationDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result)
        return;
      this.loading = true;
      this.apiService.addUserEducation(result).subscribe(
        () => {
          this.updateUserEducation();
        },
        (error) => {
          this.loading = false;
          console.log(`Error adding user education: ${JSON.stringify(error)}`);
          this.snackbar.open(`Error adding user education`, `OK`);
        }
      );
    });
  }
  updateEducation(education: Education) {
    if (this.loading) return;
    let dialogRef = this.dialog.open(AddUserEducationDialogComponent, {
      data: { ...education },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return;
      this.loading = true;
      this.apiService.updateUserEducation(result, education.id as number).subscribe(
        () => {
          this.updateUserEducation();
        },
        (error) => {
          this.loading = false;
          console.log(
            `Error updating user education: ${JSON.stringify(error)}`
          );
          this.snackbar.open(`Error updating user education`, `OK`);
        }
      );
    });
  }
  deleteEducation(id: number | undefined) {
    if (this.loading) return;
    if (!id) {
      this.snackbar.open(`Error deleting user education`, `OK`);
      return;
    }
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this education?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.apiService
          .deleteUserEducation(id as number)
          .subscribe(
            () => {
              this.updateUserEducation();
            },
            (error) => {
              this.loading = false;
              console.log(
                `Error deleting user education: ${JSON.stringify(error)}`
              );
              this.snackbar.open(`Error deleting user education`, `OK`);
            }
          );
      }
    });
  }
  updateUserEducation() {
    this.loading = true;
    this.apiService.getUserEducation().subscribe({
      next: (response) => {
        const result = response.data as EducationList;
        this.educations = result.educations;
        for (const education of this.educations) {
          education.startDate = new Date(education.startDate);
          if (education.endDate) {
            education.endDate = new Date(education.endDate);
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.log(`Error: Could not update user education: ${JSON.stringify(err)}`);
        this.snackbar.open(`Error: Could not update user education`, 'OK');
      },
    });
  }
  formatDate(date: Date): string {
    return (
      date.toLocaleString('default', { month: 'long' }) +
      ' ' +
      date.getFullYear()
    );
  }
  ngOnInit() {
    this.updateUserEducation();
  }
}
