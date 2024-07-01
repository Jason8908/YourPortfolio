import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './auth-wrapper.component.html',
  styleUrl: './auth-wrapper.component.css',
})
export class AuthWrapperComponent {
  constructor(private apiService: ApiService, private cookieService: CookieService, private router: Router) {}

  getBearerToken() {
    return this.cookieService.get('bearerToken');
  }

  signOut() {
    this.cookieService.delete('bearerToken');
    this.router.navigate(['']);
  }

  ngOnInit() {
    const token = this.getBearerToken();
    // If no token in cookies, then navigate to the home page.
    if (!token) {
      this.router.navigate(['']);
    }
  }
}
