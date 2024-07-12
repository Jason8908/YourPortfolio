import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { UserSkillsComponent } from '../../components/user-skills/user-skills.component';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../classes/user';
import { LocalStorageService } from '../../services/local-storage.service';
import { JobSearchComponent } from '../../components/job-search/job-search.component';
import { MatCardModule } from '@angular/material/card';
import { JobSearchRequest } from '../../classes/jobSearch';
import { query } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AuthHeaderComponent,
    UserSkillsComponent,
    RouterModule,
    JobSearchComponent,
    MatCardModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: User = {} as User;
  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  onSearch(search: JobSearchRequest) {
    this.router.navigate([`dashboard/jobs`], {
      queryParams: {
        query: search.query,
        location: search.location,
      },
    });
  }

  ngOnInit() {
    const user = this.localStorage.getUser();
    if (!user) this.router.navigate(['']);
    this.user = user as User;
  }
}
