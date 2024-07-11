import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../classes/user';
import { CookieLabels } from '../../app.constants';

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
  user: User = {} as User;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router,
  ) {}

  getBearerToken() {
    return this.cookieService.get(CookieLabels.AUTH_TOKEN);
  }

  signOut() {
    this.cookieService.delete(CookieLabels.AUTH_TOKEN, '/');
    this.router.navigate(['']);
  }

  ngOnInit() {
    const token = this.getBearerToken();
    // If no token in cookies, then navigate to the home page.
    if (!token) {
      this.router.navigate(['']);
    }

    this.apiService.getUserInfo().subscribe(
      (response) => {
        this.user = response.data as User;
      },
      (error) => {
        console.log(`Error with the API: ${JSON.stringify(error)}`);
        this.router.navigate(['']);
      },
    );
  }
}
