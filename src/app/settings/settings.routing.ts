import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PATHS } from 'src/app/classes/appSettings';
import { ProfileComponent } from './components/profile/profile.component';
import { DataComponent } from './components/data/data.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: PATHS.SETTINGS_DASHBOARD, component: DashboardComponent },
  { path: PATHS.SETTINGS_PROFILE, component: ProfileComponent },
  { path: PATHS.SETTINGS_TEAM, component: DashboardComponent },
  { path: PATHS.SETTINGS_BILLING, component: DashboardComponent },
  { path: PATHS.SETTINGS_APPS, component: DashboardComponent },
  { path: PATHS.SETTINGS_DATA, component: DataComponent },
];

export const SettingsRoutingModule: ModuleWithProviders<any> = RouterModule.forChild(routes);
