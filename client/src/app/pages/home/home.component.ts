import { Component } from '@angular/core';
import {
  SocialAuthService,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthHeaderComponent } from "../../components/auth-header/auth-header.component";
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
    imports: [GoogleSigninButtonModule, AuthHeaderComponent]
})
export class HomeComponent {
  signOut: boolean = false;
  constructor(private authService: SocialAuthService, private router: Router, private route: ActivatedRoute, private apiService: ApiService, private cookieService: CookieService) {
    this.route.queryParamMap.subscribe(params => {
      this.signOut = params.get('signOut') === 'true';
    });
  }
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      if (this.signOut)
        return;
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
