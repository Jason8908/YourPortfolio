import { Component } from '@angular/core';
import { SocialUser, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './auth-wrapper.component.html',
  styleUrl: './auth-wrapper.component.css',
})
export class AuthWrapperComponent {
  constructor(private authService: SocialAuthService) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      console.log(user);
    });
  }
}
