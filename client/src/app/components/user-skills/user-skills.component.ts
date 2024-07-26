import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { User } from '../../classes/user';
import { Skill, SkillList } from '../../classes/skills';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgFor, NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddSkillDialogComponent } from '../add-skill-dialog/add-skill-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-skills',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.css',
})
export class UserSkillsComponent {
  user: User | null;
  skills: Array<Skill> = [];
  skillCount: number = 0;
  loading: boolean = false;
  readonly dialog = inject(MatDialog);
  constructor(
    private apiService: ApiService,
    private localStorage: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.user = this.localStorage.getUser();
  }

  setUserSkills() {
    this.loading = true;
    if (this.user) {
      this.apiService.getUserSkills().subscribe(
        (response) => {
          const results: SkillList = response.data;
          this.skills = results.skills;
          this.skillCount = results.totalCount;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          console.log(`Error with the API: ${JSON.stringify(error)}`);
          this.snackBar.open(`Error retrieving skills`, 'OK');
        }
      );
    }
  }

  ngOnInit() {
    // Get the user's skills from the API.
    this.setUserSkills();
  }

  deleteSkill(skillId: Number) {
    if (this.loading) return;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this skill?',
      },
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (!result) return;
        // If the user confirms the deletion, then delete the skill.
        this.apiService.deleteUserSkill(skillId).subscribe(
          () => {
            this.setUserSkills();
          },
          (error) => {
            console.log(`Error with the API: ${JSON.stringify(error)}`);
            this.snackBar.open(`Error when deleting skill`, 'OK');
          }
        );
      },
      (error) => {
        console.log(`Error with the dialog: ${JSON.stringify(error)}`);
        this.snackBar.open(`Error when deleting skill`, 'OK');
      }
    );
  }

  addSkill() {
    if (this.loading) return;
    let dialogRef = this.dialog.open(AddSkillDialogComponent);
    dialogRef.afterClosed().subscribe(
      (result) => {
        // If the result is a string, then call createSkill.
        if (typeof result === 'string') {
          this.apiService.createUserSkill(result).subscribe(
            () => {
              this.setUserSkills();
            },
            (error) => {
              console.log(`Error with the API: ${JSON.stringify(error)}`);
              this.snackBar.open(`Error when adding skill`, 'OK');
            }
          );
        } else if (typeof result === 'number') {
          // If the result is a number, then call addUserSkill.
          this.apiService.addUserSkill(result).subscribe(
            () => {
              this.setUserSkills();
            },
            (error) => {
              if (error.status === 409) {
                this.snackBar.open('You already have that skill!', 'OK', {
                  duration: 5000,
                });
              } else
                console.log(`Error with the API: ${JSON.stringify(error)}`);
              this.snackBar.open(`Error adding skill`, 'OK');
            }
          );
        }
      },
      (error) => {
        console.log(`Error with the dialog: ${JSON.stringify(error)}`);
        this.snackBar.open(`Error adding skill`, 'OK');
      }
    );
  }
}
