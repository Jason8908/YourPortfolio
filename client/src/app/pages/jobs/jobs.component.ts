import { Component, inject } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { JobPreviewComponent } from '../../components/job-preview/job-preview.component';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { JobDescriptionComponent } from '../../components/job-description/job-description.component';
import { JobSearchComponent } from '../../components/job-search/job-search.component';
import { JobSearchRequest } from '../../classes/jobSearch';
import { SpinnerDialogComponent } from '../../components/spinner-dialog/spinner-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

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
  spinnerRef: any = null;
  readonly dialog = inject(MatDialog);
  public currentQuery: any;
  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentQuery = {};
  }

  showSpinner() {
    if (this.spinnerRef) return;
    this.spinnerRef = this.dialog.open(SpinnerDialogComponent, {
      height: '150px',
      width: '150px',
    });
  }

  hideSpinner() {
    if (!this.spinnerRef) return;
    this.spinnerRef.close();
    this.spinnerRef = null;
  }

  setItem(newId: number) {
    this.currentJob = this.jobSearchResult.find((job) => job.id == newId);
  }

  onSearch(search: JobSearchRequest) {
    this.showSpinner();
    this.apiService.getJobs(search).subscribe({
      next: (res) => {
        this.jobSearchResult = res.data;
        this.jobSearchResult.forEach((job) => {
          job.saved = job.UserJobs?.length > 0;
        });
        this.currentJob = this.jobSearchResult[0];
        this.hideSpinner();
      },
      error: (err) => {
        this.hideSpinner();
        this.snackBar.open(err.toString(), 'OK');
      },
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (!params['query'] || !params['location']) {
        this.router.navigate(['dashboard']);
      } else {
        this.currentQuery = {
          query: params['query'],
          location: params['location'],
        };
        this.onSearch(this.currentQuery);
      }
    });
  }
}
