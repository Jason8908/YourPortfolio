import { Component, Input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CookieLabels } from '../../app.constants';
import { ApiService } from '../../services/api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    NgIf,
  ],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.css',
})
export class HomeNavbarComponent {
  @Input() isAuth: boolean = false;
  onAuthChange = output<boolean>();
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private apiService: ApiService
  ) {}
  ngOnInit() {
    this.apiService.getUserInfo().subscribe(
      () => {
        this.isAuth = true;
        this.emitAuthChange(this.isAuth);
      },
      (error) => {
        this.cookieService.delete(CookieLabels.AUTH_TOKEN, '/');
        console.log(error);
        this.isAuth = false;
        this.emitAuthChange(this.isAuth);
      }
    );
  }
  signOut() {
    this.cookieService.delete(CookieLabels.AUTH_TOKEN, '/');
    this.isAuth = false;
    this.emitAuthChange(this.isAuth);
  }
  emitAuthChange(newState: boolean) {
    this.onAuthChange.emit(newState);
  }
}
