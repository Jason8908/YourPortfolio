import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { CookieLabels } from '../../app.constants';
import { NgIf } from '@angular/common';
import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NgIf, HomeNavbarComponent, MatButtonModule, MatIconModule],
})
export class HomeComponent {
  isAuth: boolean = false;
  loginUrl = `${environment.apiEndpoint}/api/auth/login/google`;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cookieService: CookieService,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      // If the token is present, store it in a cookie and navigate to the dashboard.
      if (token) {
        this.cookieService.set(CookieLabels.AUTH_TOKEN, token, undefined, '/');
        this.router.navigate(['/dashboard']);
        console.log('After navigation!');
      }
    });
  }

  ngOnInit(): void {
    this.apiService.getUserInfo().subscribe(
      () => {
        this.isAuth = true;
      },
      (error) => {
        this.cookieService.delete(CookieLabels.AUTH_TOKEN, '/');
        console.log(error);
      },
    );
  }

  redirectToGoogle() {
    window.location.href = this.loginUrl;
  }

  updateAuth(newState: boolean) {
    this.isAuth = newState;
  }
}
