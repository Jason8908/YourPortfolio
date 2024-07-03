import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.css',
})
export class AuthHeaderComponent {
  user: any;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  getBearerToken() {
    return this.cookieService.get('bearerToken');
  }

  signOut() {
    this.cookieService.delete('bearerToken');
    this.router.navigate([''], { queryParams: { signOut: 'true' } });
  }

  ngOnInit() {
    const token = this.getBearerToken();
    // If no token in cookies, then navigate to the home page.
    if (!token) {
      this.router.navigate(['']);
    }

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
