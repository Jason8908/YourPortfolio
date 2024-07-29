import { Component, Input, output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../classes/user';
import { CookieLabels } from '../../app.constants';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileNoticeComponent } from "../profile-notice/profile-notice.component";

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    ProfileNoticeComponent
],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.css',
})
export class AuthHeaderComponent {
  user: User = {} as User;
  balance: number = 0;
  onBalanceChange = output<number>();
  snackbarShown: boolean = false;
  @Input() triggerCreditsRefresh: Observable<void> | undefined;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  getBearerToken() {
    return this.cookieService.get(CookieLabels.AUTH_TOKEN);
  }

  signOut() {
    this.cookieService.delete(CookieLabels.AUTH_TOKEN, '/');
    if (!this.snackbarShown) {
      this.snackbar.open('You have been signed out.', 'Dismiss');
      this.snackbarShown = true;
    }
    this.router.navigate(['']);
  }

  setNewBalance(newBalance: number) {
    this.balance = newBalance;
    this.onBalanceChange.emit(this.balance);
  }

  ngOnInit() {
    const token = this.getBearerToken();
    // If no token in cookies, then navigate to the home page.
    if (!token) {
      if (!this.snackbarShown) {
        this.snackbar.open('Please sign in again.', 'OK');
        this.snackbarShown = true;
      }
      this.router.navigate(['']);
    }

    this.apiService.getUserInfo().subscribe(
      (response) => {
        this.user = response.data as User;
      },
      (error) => {
        console.log(`Error with the API: ${JSON.stringify(error)}`);
        if (!this.snackbarShown) {
          this.snackbar.open('Please sign in again.', 'OK');
          this.snackbarShown = true
        }
        this.router.navigate(['']);
      }
    );

    this.apiService.getUserBalance().subscribe(
      (response) => {
        this.setNewBalance(response.data.credits);
      },
      (error) => {
        console.log(`Error with the API: ${JSON.stringify(error)}`);
        if (!this.snackbarShown) {
          this.snackbar.open('Please sign in again.', 'OK');
          this.snackbarShown = true;
        }
        this.router.navigate(['']);
      }
    );

    if (this.triggerCreditsRefresh) {
      this.triggerCreditsRefresh.subscribe(() => {
        this.apiService.getUserBalance().subscribe(
          (response) => {
            this.setNewBalance(response.data.credits);
          },
          (error) => {
            console.log(`Error with the API: ${JSON.stringify(error)}`);
            if (!this.snackbarShown) {
              this.snackbar.open('Please sign in again.', 'OK');
              this.snackbarShown = true;
            }
            this.router.navigate(['']);
          }
        );
      });
    }
  }
}
