import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AuthHeaderComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: User = {} as User;
  constructor(
    private cookieService: CookieService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    // Getting the user's information from the API.
    this.apiService.getUserInfo().subscribe(
      (response) => {
        this.user = response.data;
        console.log(this.user);
      },
      (error) => {
        console.log(`Error with the API: ${error}`);
        this.router.navigate(['']);
      }
    );
  }
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
