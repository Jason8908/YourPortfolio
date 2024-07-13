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

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonModule,
  ],
  templateUrl: './job-description.component.html',
  styleUrl: './job-description.component.css',
})
export class JobDescriptionComponent {
  readonly dialog = inject(MatDialog);
  constructor(private apiService: ApiService) {}
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
  };
  generateCoverLetter(jobData: JobData) {
    this.apiService.generateCoverLetter(jobData).subscribe((response) => {
      const buffer = response as Uint8Array;
      // Convert the buffer into a docx file blob
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      // Create a link element and click it to download the file.
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cover-letter.docx`;
      // Append the link to the body and click it.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
