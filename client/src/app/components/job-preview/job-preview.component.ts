import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-job-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    MatRipple,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './job-preview.component.html',
  styleUrl: './job-preview.component.css',
})
export class JobPreviewComponent {
  @Input({ required: true }) jobData = {
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
}
