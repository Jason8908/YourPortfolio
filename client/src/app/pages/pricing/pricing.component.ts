import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { UserBalanceComponent } from '../../components/user-balance/user-balance.component';
import { TopupOptionsComponent } from '../../components/topup-options/topup-options.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [AuthHeaderComponent, UserBalanceComponent, TopupOptionsComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
})
export class PricingComponent {
  balance: number = 0;
  constructor() {}
  updateBalance(newBalance: number) {
    this.balance = newBalance;
  }
}
