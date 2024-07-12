import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { CommonModule } from '@angular/common';
import { JobPreviewComponent } from '../../components/job-preview/job-preview.component';
import { JobDescriptionComponent } from '../../components/job-description/job-description.component';
import { ApiService } from '../../services/api.service';

const PAGE_LENGTH = 10;

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [
    AuthHeaderComponent,
    CommonModule,
    JobPreviewComponent,
    JobDescriptionComponent,
  ],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.css',
})
export class SavedJobsComponent {
  public savedJobs: any = [];
  public currentJob: any = undefined;
  private page: number = 0;

  constructor(private apiService: ApiService) {}

  setItem(newId: number) {
    this.currentJob = this.savedJobs.find((job: any) => job.id == newId);
  }

  getJobs() {
    this.apiService
      .getSavedJobs(PAGE_LENGTH * this.page, PAGE_LENGTH)
      .subscribe((res) => {
        console.log(res);
        this.savedJobs = res.data.jobs.map((job: { Job: any }) => job.Job);
        this.savedJobs.forEach((job: { saved: boolean }) => {
          job.saved = true;
        });

        this.currentJob = this.savedJobs[0];
      });
  }

  nextPage() {
    this.page++;
    this.getJobs();
  }

  prevPage() {
    this.page--;
    this.getJobs();
  }

  ngOnInit() {
    this.getJobs();
  }
}
