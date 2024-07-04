import { Component } from '@angular/core';
import {
  SocialAuthService,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../../services/local-storage.service';
import { User } from '../../classes/user';
import { CookieLabels } from '../../app.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [GoogleSigninButtonModule],
})
export class HomeComponent {
  signOut: boolean = false;
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cookieService: CookieService,
    private localStorage: LocalStorageService,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.signOut = params.get('signOut') === 'true';
    });
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      if (this.signOut) {
        this.signOut = false;
        return;
      }
      // Get an access token from the GoogleLoginProvider.
      this.authService
        .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
        .then((token) => {
          // Send the access token to the API.
          this.apiService
            .sendAuth(token, user.firstName, user.lastName, user.email)
            .subscribe(
              (response) => {
                // Storing the bearer token in a cookie.
                this.cookieService.delete(CookieLabels.AUTH_TOKEN);
                this.cookieService.set(
                  CookieLabels.AUTH_TOKEN,
                  response.data.accessToken,
                );
                // Getting and setting user information.
                this.apiService.getUserInfo().subscribe(
                  (response) => {
                    const user: User = response.data as User;
                    this.localStorage.setUser(user);
                    this.router.navigate(['dashboard']);
                  },
                  (error) => {
                    console.log(`Error with the API: ${JSON.stringify(error)}`);
                  },
                );
              },
              (error) => {
                console.log(`Error with the API: ${JSON.stringify(error)}`);
              },
            );
        });
    });
  }
}
