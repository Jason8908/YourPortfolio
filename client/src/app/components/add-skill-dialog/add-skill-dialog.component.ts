import { Component, Inject, model, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Skill, SkillList } from '../../classes/skills';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { AddSkillDialogData } from '../../classes/add-skill-dialog-data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-skill-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './add-skill-dialog.component.html',
  styleUrl: './add-skill-dialog.component.css',
})
export class AddSkillDialogComponent {
  // Time in milliseconds to wait between each API call to the backend
  apiCooldown = 350;
  canCall = true;
  timeoutFunction: any = null;
  lastSearched = '';
  // Form information
  skillInput: string | null = null;
  skillNameToId: { [key: string]: number } = {};
  control = new FormControl('');
  skillOptions: Observable<Skill[]> = new Observable<Skill[]>();

  constructor(private apiService: ApiService, private snackbar: MatSnackBar) {}

  resetApiTimeout() {
    if (!this.timeoutFunction) return;
    clearTimeout(this.timeoutFunction);
    this.setApiTimeout();
  }

  setApiTimeout() {
    this.timeoutFunction = setTimeout(() => {
      this.canCall = true;
      this.timeoutFunction = null;
      if (this.skillInput !== this.lastSearched)
        this.updateSkillOptions(this.skillInput);
    }, this.apiCooldown);
  }

  updateSkillOptions(searchQuery: string | null) {
    if (!searchQuery) return this.setBlankSkillOptions();
    this.lastSearched = searchQuery;
    this.apiService.getSkills(searchQuery).subscribe({
      next: (response) => {
        const result = response.data as SkillList;
        this.skillOptions = new Observable<Skill[]>((observer) => {
          observer.next(result.skills);
        });
        this.skillNameToId = {};
        for (const skill of result.skills)
          this.skillNameToId[skill.name] = skill.id;
      },
      error: (err) => {
        this.snackbar.open(`Error: ${err.message}`, 'OK');
      },
    });
  }

  setBlankSkillOptions() {
    this.skillOptions = new Observable<Skill[]>();
  }

  returnOption(): number | string | null {
    if (!this.skillInput || this.skillInput.length < 1) return null;
    // If skillInput is in the skillNameToId dictionary, then return the skill ID.
    if (this.skillNameToId[this.skillInput])
      return this.skillNameToId[this.skillInput];
    // Otherwise, just return the skillInput.
    return this.skillInput;
  }

  ngOnInit() {
    this.control.valueChanges.subscribe((value) => {
      this.skillInput = value;
      if (!value) return this.setBlankSkillOptions();
      if (!this.canCall) return this.resetApiTimeout();
      this.canCall = false;
      this.setApiTimeout();
      this.updateSkillOptions(value);
    });
  }
}
