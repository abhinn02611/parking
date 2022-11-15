import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../classes/session';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-parking-forgot-password',
  templateUrl: './parking-forgot-password.component.html',
  styleUrls: ['./parking-forgot-password.component.scss'],
})
export class ParkingForgotPasswordComponent implements OnInit {
  @ViewChild('otp1') otp1: ElementRef;
  @ViewChild('otp2') otp2: ElementRef;
  @ViewChild('otp3') otp3: ElementRef;
  @ViewChild('otp4') otp4: ElementRef;
  @ViewChild('otp5') otp5: ElementRef;
  @ViewChild('otp6') otp6: ElementRef;

  domain = '';
  email: string = '';
  password = '';
  newPassword = '';
  confirmNewPassword = '';
  response = {};
  timervalue = 30;
  timerview = 1;
  sessionId: string = '';
  errorMessageDomain = '';
  errorMessageEmail = '';
  errorMessageOTP = '';
  errorMessageNewPassword = '';
  loading: boolean = false;
  otp = '';
  otppart1 = '';
  otppart2 = '';
  otppart3 = '';
  otppart4 = '';
  otppart5 = '';
  otppart6 = '';
  sistem = {
    sistem_client_prefix: '',
    sistem_client_business_name: '',
    sistem_client_port: '',
    sistem_client_logo: '',
    sistem_client_email: '',
    sistem_client_currency: '',
    sistem_client_token: '',
  };
  role = '';
  verificationRes = {
    name: '',
    profile_pic: '',
    company_name: '',
    id: '',
  };
  step = 1;

  constructor(
    private authService: AuthService,
    private session: Session,
    private route: Router
  ) {
    // if (authService.isLoggedIn) {
    //   authService.redirectToUrl();
    // }
  }

  ngOnInit() {
    this.step = 1;
  }

  checkDomain() {
    this.errorMessageDomain = '';
    if (this.domain === '') {
      return;
    }
    this.authService.checkDomain(this.domain).subscribe(
      (data) => {
        if (data[0].status === 'success') {
          this.sistem = data[0].result[0];
          this.step = 2;
        } else {
          this.errorMessageDomain = data[0].result;
        }
      },
      (err) => console.error(err)
    );
  }

  generateForgotPassword() {
    let email = this.email.toString();
    this.loading = true;
    this.authService.generateForgotPassword(email).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.Status === 'Success') {
          this.sessionId = data.Details;
          this.step = 2;
        } else {
          this.errorMessageEmail = data[0].result;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.loading = false;
        this.errorMessageEmail = err.message;
      }
    );
  }

  VerifyForgotPassword() {
    const otp =
      this.otppart1 +
      '' +
      this.otppart2 +
      '' +
      this.otppart3 +
      '' +
      this.otppart4 +
      '' +
      this.otppart5 +
      '' +
      this.otppart6;

    console.log(otp);
    this.loading = true;
    this.authService.verifyOtpForForgotPassword(+otp, this.sessionId).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.step = 3;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.loading = true;
        this.errorMessageOTP = err.message;
      }
    );
  }

  generateNewPassword() {
    if (
      this.password &&
      this.confirmNewPassword &&
      this.password === this.confirmNewPassword
    ) {
      this.loading = true;
      this.authService
        .generateNewPassword(this.email, this.newPassword)
        .subscribe(
          (data: any) => {
            console.log(data);
            this.loading = false;
            this.route.navigate(['/login']);
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            this.loading = true;
            this.errorMessageNewPassword = err.message;
          }
        );
    } else {
      this.errorMessageNewPassword =
        'Password and confirmPassword should be same';
    }
  }
}
