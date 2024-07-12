import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JobData } from '../../classes/job-data';
import { ApiService } from '../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MultilineDisplayDialogComponent } from '../multiline-display-dialog/multiline-display-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './job-description.component.html',
  styleUrl: './job-description.component.css',
})
export class JobDescriptionComponent {
  readonly dialog = inject(MatDialog);
  public saved = false;
  constructor(private apiService: ApiService, private snackbar: MatSnackBar) {}
  @Input({ required: true }) jobData: JobData = {
    id: 0,
    externalId: '',
    title: '',
    description: '',
    location: '',
    addresss: '',
    employer: '',
    benefits: [],
    jobTypes: [],
    link: '',
    attributes: [],
    saved: false,
  };
  generateCoverLetter(jobData: JobData) {
    this.apiService.generateCoverLetter(jobData).subscribe((response) => {
      // This response responds with a docx file using expressJs res.download, make the user download this file
      // this.dialog.open(MultilineDisplayDialogComponent, {
      //   data: { title: 'Cover Letter', lines: response.data },
      // });
    });
  }

  saveJob(jobId: number) {
    this.apiService.saveJob(jobId).subscribe((res) => {
      this.jobData.saved = true;
      this.snackbar.open('Job Saved!', 'OK', {
        duration: 5000,
      });
    });
  }

  unsaveJob(jobId: number) {
    this.apiService.unsaveJob(jobId).subscribe((res) => {
      this.jobData.saved = false;
      this.snackbar.open('Job Unsaved!', 'OK', {
        duration: 5000,
      });
    });
  }
}
