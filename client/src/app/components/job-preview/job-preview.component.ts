import { Component, Input, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-preview',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatCardModule, MatChipsModule],
  templateUrl: './job-preview.component.html',
  styleUrl: './job-preview.component.css',
})
export class JobPreviewComponent {
  @Input({ required: true }) jobData = {
    title: '',
    employer: '',
    jobTypes: [],
  };
}
