import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth.routing';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { SigninComponent } from './signin/signin.component';
import { ParkingForgotPasswordComponent } from './parking-forgot-password/parking-forgot-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    SigninComponent,
    ParkingForgotPasswordComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    BrowserModule,
    AuthRoutingModule,
    FormsModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
