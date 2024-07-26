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
import { Subject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    AuthHeaderComponent,
    JobPreviewComponent,
    CommonModule,
    JobDescriptionComponent,
    JobSearchComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
})
export class JobsComponent {
  jobSearchResult: any[] = [];
  currentJob: any = undefined;
  spinnerRef: any = null;
  balance: number = 0;
  readonly dialog = inject(MatDialog);
  public currentQuery: any;
  public loading: boolean = true;
  triggerCreditsRefresh: Subject<void> = new Subject<void>();
  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentQuery = {};
  }

  onAIReturn() {
    this.triggerCreditsRefresh.next();
  }

  // showSpinner() {
  //   if (this.spinnerRef) return;
  //   this.spinnerRef = this.dialog.open(SpinnerDialogComponent, {
  //     height: '150px',
  //     width: '150px',
  //   });
  // }

  // hideSpinner() {
  //   if (!this.spinnerRef) return;
  //   this.spinnerRef.close();
  //   this.spinnerRef = null;
  // }

  setItem(newId: number) {
    this.currentJob = this.jobSearchResult.find((job) => job.id == newId);
  }

  onSearch(search: JobSearchRequest) {
    this.loading = true;
    this.apiService.getJobs(search).subscribe({
      next: (res) => {
        this.jobSearchResult = res.data;
        this.currentJob = this.jobSearchResult[0];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Error retreiving jobs', 'OK');
      },
    });
  }

  updateBalance(newBalance: number) {
    this.balance = newBalance;
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
