import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatChipsModule],
  templateUrl: './job-description.component.html',
  styleUrl: './job-description.component.css',
})
export class JobDescriptionComponent {
  @Input({ required: true }) jobData: any = {
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
