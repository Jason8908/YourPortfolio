import { Component } from '@angular/core';
import { AuthWrapperComponent } from '../../components/auth-wrapper/auth-wrapper.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AuthWrapperComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
