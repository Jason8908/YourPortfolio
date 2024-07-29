import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SavedJobsComponent } from './pages/saved-jobs/saved-jobs.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { CreditsComponent } from './pages/credits/credits.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'YourPortfolio' } },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/jobs', component: JobsComponent },
  { path: 'dashboard/profile', component: ProfileComponent },
  { path: 'dashboard/saved', component: SavedJobsComponent },
  { path: 'dashboard/pricing', component: PricingComponent },
  { path: 'credits', component: CreditsComponent },
  { path: '**', component: HomeComponent, data: { title: 'YourPortfolio' } },
];
