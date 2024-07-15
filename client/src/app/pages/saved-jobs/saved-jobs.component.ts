import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { CommonModule } from '@angular/common';
import { JobPreviewComponent } from '../../components/job-preview/job-preview.component';
import { JobDescriptionComponent } from '../../components/job-description/job-description.component';
import { ApiService } from '../../services/api.service';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [
    AuthHeaderComponent,
    CommonModule,
    JobPreviewComponent,
    JobDescriptionComponent,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.css',
})
export class SavedJobsComponent {
  public savedJobs: any = [];
  public currentJob: any = undefined;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  public length: number = 0;
  public pageEvent: any;
  public loading: boolean = true;
  triggerCreditsRefresh: Subject<void> = new Subject<void>();
  balance: number = 0;

  constructor(private apiService: ApiService, private snackbar: MatSnackBar) {}

  setItem(newId: number) {
    this.currentJob = this.savedJobs.find((job: any) => job.id == newId);
  }

  getJobs() {
    this.loading = true;
    this.apiService
      .getSavedJobs(this.pageSize * this.pageIndex, this.pageSize)
      .subscribe({
        next: (res) => {
          this.savedJobs = res.data.jobs.map((job: { Job: any }) => job.Job);
          this.savedJobs.forEach((job: { saved: boolean }) => {
            job.saved = true;
          });

          this.currentJob = this.savedJobs[0];
          this.length = res.data.totalCount;
          this.loading = false;
        },
        error: (err) => {
          this.snackbar.open('Error getting saved jobs', 'OK');
          console.error(err);
        },
      });
  }

  onAIReturn() {
    this.triggerCreditsRefresh.next();
  }

  ngOnInit() {
    this.getJobs();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getJobs();
  }

  updateBalance(newBalance: number) {
    this.balance = newBalance;
  }
}
