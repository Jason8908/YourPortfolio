import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-balance',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
  ],
  templateUrl: './user-balance.component.html',
  styleUrl: './user-balance.component.css',
})
export class UserBalanceComponent {
  @Input() balance: number = 0;
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}
  ngOnInit() {}
}
