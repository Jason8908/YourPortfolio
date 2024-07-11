import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { User } from '../../classes/user';
import { Skill, SkillList } from '../../classes/skills';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgFor } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddSkillDialogComponent } from '../add-skill-dialog/add-skill-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerDialogComponent } from '../spinner-dialog/spinner-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-skills',
  standalone: true,
  imports: [
    NgFor,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
  ],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.css',
})
export class UserSkillsComponent {
  user: User | null;
  skills: Array<Skill> = [];
  skillCount: number = 0;
  readonly dialog = inject(MatDialog);
  spinnerRef: any = null;
  constructor(
    private apiService: ApiService,
    private localStorage: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.user = this.localStorage.getUser();
  }

  showSpinner() {
    if (this.spinnerRef) return;
    this.spinnerRef = this.dialog.open(SpinnerDialogComponent, {
      height: '150px',
      width: '150px',
    });
  }

  hideSpinner() {
    if (!this.spinnerRef) return;
    this.spinnerRef.close();
    this.spinnerRef = null;
  }

  setUserSkills() {
    this.showSpinner();
    if (this.user) {
      this.apiService.getUserSkills(this.user.id).subscribe(
        (response) => {
          const results: SkillList = response.data;
          this.skills = results.skills;
          this.skillCount = results.totalCount;
          this.hideSpinner();
        },
        (error) => {
          console.log(`Error with the API: ${JSON.stringify(error)}`);
        }
      );
    }
  }

  ngOnInit() {
    // Get the user's skills from the API.
    this.setUserSkills();
  }

  deleteSkill(skillId: Number) {
    if (!this.user) this.router.navigate(['']);
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this skill?',
      },
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (!result) return;
        // If the user confirms the deletion, then delete the skill.
        this.apiService.deleteUserSkill(this.user!.id, skillId).subscribe(
          () => {
            this.setUserSkills();
          },
          (error) => {
            console.log(`Error with the API: ${JSON.stringify(error)}`);
          }
        );
      },
      (error) => {
        console.log(`Error with the dialog: ${JSON.stringify(error)}`);
      }
    );
  }

  addSkill() {
    if (!this.user) this.router.navigate(['']);
    let dialogRef = this.dialog.open(AddSkillDialogComponent);
    dialogRef.afterClosed().subscribe(
      (result) => {
        // If the result is a string, then call createSkill.
        if (typeof result === 'string') {
          this.apiService.createUserSkill(this.user!.id, result).subscribe(
            () => {
              this.setUserSkills();
            },
            (error) => {
              console.log(`Error with the API: ${JSON.stringify(error)}`);
            }
          );
        } else if (typeof result === 'number') {
          // If the result is a number, then call addUserSkill.
          this.apiService.addUserSkill(this.user!.id, result).subscribe(
            () => {
              this.setUserSkills();
            },
            (error) => {
              if (error.status === 409) {
                this.snackBar.open('You already have that skill!', 'Close', {
                  duration: 2000,
                });
              } else
                console.log(`Error with the API: ${JSON.stringify(error)}`);
            }
          );
        }
      },
      (error) => {
        console.log(`Error with the dialog: ${JSON.stringify(error)}`);
      }
    );
  }
}
