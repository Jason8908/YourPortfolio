import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TopUpOption } from '../../classes/topup-option';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-topup-options',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    NgFor,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './topup-options.component.html',
  styleUrl: './topup-options.component.css',
})
export class TopupOptionsComponent {
  options: Array<TopUpOption> = [];
  public loading: boolean = true;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}
  ngOnInit() {
    this.loading = true;
    this.apiService.getTopUpOptions().subscribe(
      (response) => {
        this.options = response.data;
        this.loading = false;
      },
      (error) => {
        console.log(`Error fetching topup options: ${JSON.stringify(error)}`);
        this.snackbar.open('Error fetching topup options', 'OK');
        this.router.navigate(['dashboard']);
      }
    );
  }
  purchaseTopup(option: TopUpOption) {
    const priceId = option.priceId;
    this.apiService.createCheckoutUrl(priceId).subscribe(
      (response) => {
        const url = response.data;
        window.location.href = url;
      },
      (error) => {
        console.log(
          `Error creating checkout session: ${JSON.stringify(error)}`
        );
        this.snackbar.open('Error creating checkout session', 'OK');
      }
    );
  }
}
