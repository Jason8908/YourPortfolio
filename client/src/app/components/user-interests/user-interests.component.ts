import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Interest, InterestList } from '../../classes/interests';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../classes/user';
import { LocalStorageService } from '../../services/local-storage.service';
import { AddInterestDialogComponent } from '../add-interest-dialog/add-interest-dialog.component';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-interests',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    AddInterestDialogComponent,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-interests.component.html',
  styleUrl: './user-interests.component.css',
})
export class UserInterestsComponent {
  user: User | null;
  interests: Array<Interest> = [];
  loading: boolean = false;
  readonly dialog = inject(MatDialog);
  constructor(
    private localStorage: LocalStorageService,
    private apiService: ApiService,
    private snackbar: MatSnackBar
  ) {
    this.user = this.localStorage.getUser();
  }

  updateInterests(): any {
    this.loading = true;
    this.apiService.getUserInterests().subscribe({
      next: (response) => {
        this.loading = false;
        const result = response.data as InterestList;
        this.interests = result.interests;
      },
      error: (err) => {
        this.loading = false;
        this.snackbar.open('Error Updating intrest', 'OK');
      },
    });
  }

  ngOnInit() {
    this.updateInterests();
  }

  addInterest() {
    if (this.loading) return;
    let dialogRef = this.dialog.open(AddInterestDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading = true;
      this.apiService.addUserInterest(result).subscribe({
        next: (response) => {
          this.updateInterests();
        },
        error: (err) => {
          this.loading = false;
          this.snackbar.open('Error Adding intrest', 'OK');
        },
      });
    });
  }

  deleteInterest(interestId: Number) {
    if (this.loading) return;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this interest?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loading = true;
      this.apiService.deleteUserInterest(interestId).subscribe({
        next: (response) => {
          this.updateInterests();
        },
        error: (err) => {
          this.loading = false;
          this.snackbar.open('Error deleting intrest', 'OK');
        },
      });
    });
  }
}
