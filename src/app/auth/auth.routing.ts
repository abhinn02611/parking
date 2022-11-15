import { ParkingForgotPasswordComponent } from './parking-forgot-password/parking-forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { hideMenu: true } },
  {
    path: 'forgot-password',
    component: ParkingForgotPasswordComponent,
    data: { hideMenu: true },
  },

  { path: 'signup', component: RegisterComponent, data: { hideMenu: true } },
  // { path: 'signin', component: SigninComponent, data: { hideMenu: true } },
];

export const AuthRoutingModule: any = RouterModule.forChild(routes);
