import { Component } from '@angular/core';
import { AuthWrapperComponent } from '../../components/auth-wrapper/auth-wrapper.component';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AuthWrapperComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: User = {} as User;
  constructor(private cookieService: CookieService, private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    // Getting the user's information from the API.
    this.apiService.getUserInfo().subscribe((response) => {
      this.user = response.data;
      console.log(this.user)
    }, (error) => {
      console.log(`Error with the API: ${error}`);
      this.router.navigate(['']);
    });
  }
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
