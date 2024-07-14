import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TopUpOption } from '../../classes/topup-option';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  templateUrl: './topup-options.component.html',
  styleUrl: './topup-options.component.css',
})
export class TopupOptionsComponent {
  options: Array<TopUpOption> = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.apiService.getTopUpOptions().subscribe(
      (response) => {
        this.options = response.data;
      },
      (error) => {
        console.log(`Error fetching topup options: ${JSON.stringify(error)}`);
        this.router.navigate(['']);
      },
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
          `Error creating checkout session: ${JSON.stringify(error)}`,
        );
      },
    );
  }
}
