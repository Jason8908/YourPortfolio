import { Component, inject, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Interest, InterestList } from '../../classes/interests';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../classes/user';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
import { AddInterestDialogComponent } from '../add-interest-dialog/add-interest-dialog.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-interests',
  standalone: true,
  imports: [
    NgFor,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    AddInterestDialogComponent,
  ],
  templateUrl: './user-interests.component.html',
  styleUrl: './user-interests.component.css',
})
export class UserInterestsComponent {
  user: User | null;
  interests: Array<Interest> = [];
  readonly dialog = inject(MatDialog);
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private apiService: ApiService,
  ) {
    this.user = this.localStorage.getUser();
  }

  updateInterests(): any {
    if (!this.user) return this.router.navigate(['']);
    this.apiService.getUserInterests(this.user.id).subscribe((response) => {
      const result = response.data as InterestList;
      this.interests = result.interests;
    });
  }

  ngOnInit() {
    this.updateInterests();
  }

  addInterest() {
    if (!this.user) this.router.navigate(['']);
    let dialogRef = this.dialog.open(AddInterestDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.apiService
        .addUserInterest(this.user!.id, result)
        .subscribe((response) => {
          this.updateInterests();
        });
    });
  }

  deleteInterest(interestId: Number) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this interest?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.apiService
        .deleteUserInterest(this.user!.id, interestId)
        .subscribe((response) => {
          this.updateInterests();
        });
    });
  }
}
