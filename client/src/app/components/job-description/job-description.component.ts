import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JobData } from '../../classes/job-data';
import { ApiService } from '../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoverLetterDialogComponent } from '../cover-letter-dialog/cover-letter-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './job-description.component.html',
  styleUrl: './job-description.component.css',
})
export class JobDescriptionComponent {
  readonly dialog = inject(MatDialog);
  public saved = false;
  @Input() balance: number = 0;
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
  @Output() onAIReturn = new EventEmitter<void>();
  loading: boolean = false;
  constructor(private apiService: ApiService, private snackbar: MatSnackBar) {}
  generateCoverLetter(jobData: JobData, selectedAIModel: string | undefined, selectedTemplate: string | undefined) {
    this.loading = true;
    this.apiService
      .generateCoverLetter(jobData, selectedAIModel, selectedTemplate)
      .subscribe((response) => {
        this.loading = false;
        const buffer = response as Uint8Array;
        // Convert the buffer into a docx file blob
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        // Create a link element and click it to download the file.
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cover-letter.docx`;
        // Append the link to the body and click it.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Emit an event to refresh the user's balance
        this.onAIReturn.emit();
      }, (err) => {
        this.loading = false;
        if (err.status === 429) {
          this.snackbar.open(`Received too many requests in one minute for this model. Please try again later or choose a different model.`, 'OK');
          return;
        }
        this.snackbar.open(`Error generating cover letter.`, 'OK');
      });
  }

  generateResume(jobData: JobData, selectedAIModel: string | undefined, selectedTemplate: string | undefined) {
    this.loading = true;
    this.apiService
      .generateResume(jobData, selectedAIModel, selectedTemplate)
      .subscribe((response) => {
        this.loading = false;
        const buffer = response as Uint8Array;
        // Convert the buffer into a docx file blob
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        // Create a link element and click it to download the file.
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume.docx`;
        // Append the link to the body and click it.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Emit an event to refresh the user's balance
        this.onAIReturn.emit();
      }, (err) => {
        this.loading = false;
        if (err.status === 429) {
          this.snackbar.open(`Received too many requests in one minute for this model. Please try again later or choose a different model.`, 'OK');
          return;
        }
        this.snackbar.open(`Error generating resume.`, 'OK');
      });
  }

  promptAIModelSelection(jobData: JobData, type: string) {
    const dialogRef = this.dialog.open(CoverLetterDialogComponent, {
      data: { credits: this.balance, type: type === 'letter' ? 'Cover Letter' : 'Resume' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { selectedAIModel, selectedType } = result;
        switch (type) {
          case 'letter':
            this.generateCoverLetter(jobData, selectedAIModel, selectedType);
            break;
          case 'resume':
            this.generateResume(jobData, selectedAIModel, selectedType);
            break;
        }
      }
    });
  }

  saveJob(jobId: number) {
    this.loading = true;
    this.apiService.saveJob(jobId).subscribe({
      next: (res) => {
        this.jobData.saved = true;
        this.loading = false;
        this.snackbar.open('Job Saved!', 'OK', {
          duration: 5000,
        });
      },
      error: (err) => {
        this.loading = false;
        this.snackbar.open(`Error: ${err.message}`, 'OK');
      },
    });
  }

  unsaveJob(jobId: number) {
    this.loading = true;
    this.apiService.unsaveJob(jobId).subscribe({
      next: (res) => {
        this.loading = false;
        this.jobData.saved = false;
        this.snackbar.open('Job Unsaved!', 'OK', {
          duration: 5000,
        });
      },
      error: (err) => {
        this.loading = false;
        this.snackbar.open(`Error: ${err.message}`, 'OK');
      },
    });
  }
}
