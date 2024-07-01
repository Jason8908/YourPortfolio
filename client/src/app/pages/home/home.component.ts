import { Component } from '@angular/core';
import {
  SocialAuthService,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { AuthWrapperComponent } from "../../components/auth-wrapper/auth-wrapper.component";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: [
      './home.component.css'
    ],
    imports: [GoogleSigninButtonModule, AuthWrapperComponent]
})
export class HomeComponent {
  constructor(private authService: SocialAuthService, private router: Router, private apiService: ApiService, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      // Get an access token from the GoogleLoginProvider.
      this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(token => {
        // Send the access token to the API.
        this.apiService.sendAuth(token, user.firstName, user.lastName, user.email).subscribe((response) => {
          // Storing the bearer token in a cookie.
          this.cookieService.set('bearerToken', response.data.accessToken);
          this.router.navigate(['/dashboard']);
        }, (error) => {
          console.log(`Error with the API: ${error}`);
        });
      });
    });
  }
}
