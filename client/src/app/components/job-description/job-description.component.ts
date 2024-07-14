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
import { TransmitCreditsData } from '../../classes/transmit-credits-data';
import { CoverLetterDialogComponent } from '../cover-letter-dialog/cover-letter-dialog.component';

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
  constructor(private apiService: ApiService, private snackbar: MatSnackBar) {}
  ngOnInit() {
    console.log(this.balance);
  }
  generateCoverLetter(jobData: JobData, selectedAIModel: string | undefined) {
    this.apiService
      .generateCoverLetter(jobData, selectedAIModel)
      .subscribe((response) => {
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
      });
  }

  promptAIModelSelection(jobData: JobData) {
    const dialogRef = this.dialog.open(CoverLetterDialogComponent, {
      data: { credits: this.balance },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.generateCoverLetter(jobData, result);
      }
    });
  }

  saveJob(jobId: number) {
    this.apiService.saveJob(jobId).subscribe({
      next: (res) => {
        this.jobData.saved = true;
        this.snackbar.open('Job Saved!', 'OK', {
          duration: 5000,
        });
      },
      error: (err) => {
        this.snackbar.open(`Error: ${err.message}`, 'OK');
      },
    });
  }

  unsaveJob(jobId: number) {
    this.apiService.unsaveJob(jobId).subscribe({
      next: (res) => {
        this.jobData.saved = false;
        this.snackbar.open('Job Unsaved!', 'OK', {
          duration: 5000,
        });
      },
      error: (err) => {
        this.snackbar.open(`Error: ${err.message}`, 'OK');
      },
    });
  }
}
