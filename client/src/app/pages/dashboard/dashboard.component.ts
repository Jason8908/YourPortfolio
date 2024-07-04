import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { UserSkillsComponent } from '../../components/user-skills/user-skills.component';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../classes/user';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AuthHeaderComponent, UserSkillsComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: User = {} as User;
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
  ) {}

  ngOnInit() {
    const user = this.localStorage.getUser();
    if (!user) this.router.navigate(['']);
    this.user = user as User;
  }
}
