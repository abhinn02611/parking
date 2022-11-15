import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PATHS } from '../classes/appSettings';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllsessionsComponent } from './allsessions/allsessions.component';
import { AllpassesComponent } from './allpasses/allpasses.component';
import { ParksettingsComponent } from './parksettings/parksettings.component';
import { ReportsComponent } from './reports/reports.component';
import { AdminGuard } from '../auth/admin-auth.guard';
import { UsersComponent } from './users/users.component';
import { UsersessionsComponent } from './usersessions/usersessions.component';

const routes: Routes = [
  { path: '', component: AllsessionsComponent },
  {
    path: PATHS.PARKING_DASHBOARD,
    component: DashboardComponent,
    pathMatch: 'full',
  },

  {
    path: PATHS.PARKING_USERS + '/' + PATHS.PARKING_SESSIONS,
    component: UsersessionsComponent,
    pathMatch: 'full',
  },

  {
    path: PATHS.PARKING_USERS,
    component: UsersComponent,
    pathMatch: 'full',
  },

  {
    path: PATHS.PARKING_SESSIONS + '/:id',
    component: AllsessionsComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard],
  },
  {
    path: PATHS.PARKING_PASSES + '/:id',
    component: AllpassesComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard],
  },
  {
    path: PATHS.PARKING_REPORTS + '/:id',
    component: ReportsComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard],
  },
  {
    path: PATHS.PARKING_SETTINGS_HOME + '/:id',
    component: ParksettingsComponent,
    pathMatch: 'full',
    canActivate: [AdminGuard],
  },
];

export const ParkingRoutingModule: ModuleWithProviders<any> =
  RouterModule.forChild(routes);
