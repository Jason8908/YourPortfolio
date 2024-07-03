import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { JobPreviewComponent } from '../../components/job-preview/job-preview.component';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { JobDescriptionComponent } from '../../components/job-description/job-description.component';
import { JobSearchComponent } from '../../components/job-search/job-search.component';
import { JobSearchRequest } from '../../models/jobSearch';
@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    AuthHeaderComponent,
    JobPreviewComponent,
    CommonModule,
    JobDescriptionComponent,
    JobSearchComponent,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
})
export class JobsComponent {
  jobSearchResult: any[] = [];
  currentJob: any = undefined;

  constructor(private apiService: ApiService) {}

  setItem(newId: number) {
    this.currentJob = this.jobSearchResult.find((job) => job.id == newId);
  }

  onSearch(search: JobSearchRequest) {
    this.apiService.getJobs(search).subscribe((res) => {
      this.jobSearchResult = res.data;
      this.currentJob = res.data[0];
    });
  }
}
