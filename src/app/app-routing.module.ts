import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { SigninComponent } from './auth/signin/signin.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // default route of the module
  { path: 'login', component: LoginComponent, data: { hideMenu: true } }, // default route of the module
  {
    path: 'sales',
    loadChildren: () =>
      import('src/app/sales/sales.module').then((m) => m.SalesModule),
    canActivate: [AuthGuard],
  }, // default route of the module
  {
    path: 'parking',
    loadChildren: () =>
      import('src/app/parking/parking.module').then((m) => m.ParkingModule),
    canActivate: [AuthGuard],
  }, // default route of the module // default route of the module
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
    canActivate: [AuthGuard],
  }, // default route of the module
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
