import { Component } from '@angular/core';
import { HomeNavbarComponent } from "../../components/home-navbar/home-navbar.component";

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [HomeNavbarComponent],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.css'
})
export class CreditsComponent {
  constructor() { }
}
