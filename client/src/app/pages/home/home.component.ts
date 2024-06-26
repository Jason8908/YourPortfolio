import { Component } from '@angular/core';
import {
  SocialAuthService,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GoogleSigninButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private authService: SocialAuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log(user);
      //perform further logic
      user && this.router.navigate(['dashboard']);
    });
  }
}
