import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Session } from '../../classes/session';
import { switchMap } from 'rxjs/operators';
import { ParkingService } from 'src/app/parking/parking.service';
import { Observable, of } from 'rxjs';
import { APIS } from 'src/app/classes/appSettings';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'sistem-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  @ViewChild('otp1') otp1: ElementRef;
  @ViewChild('otp2') otp2: ElementRef;
  @ViewChild('otp3') otp3: ElementRef;
  @ViewChild('otp4') otp4: ElementRef;
  @ViewChild('otp5') otp5: ElementRef;
  @ViewChild('otp6') otp6: ElementRef;

  loading: boolean = false;
  email = '';
  password = '';
  errorLogin = '';
  userType = 'operator';
  adminParking = '';
  step: number = 0;
  emailErrorMessage: string = '';

  // domain = '';
  // response = {};
  // timervalue = 30;
  // timerview = 1;
  // errorMessageDomain = '';
  // errorMessageEmail = '';
  // errorMessageOTP = '';
  // otp = '';
  // otppart1 = '';
  // otppart2 = '';
  // otppart3 = '';
  // otppart4 = '';
  // otppart5 = '';
  // otppart6 = '';
  // sistem = {
  //   sistem_client_prefix: '',
  //   sistem_client_business_name: '',
  //   sistem_client_port: '',
  //   sistem_client_logo: '',
  //   sistem_client_email: '',
  //   sistem_client_currency: '',
  //   sistem_client_token: '',
  // };
  // role = '';
  // verificationRes = {
  //   name: '',
  //   profile_pic: '',
  //   company_name: '',
  //   id: '',
  // };

  constructor(
    private authService: AuthService,
    private session: Session,
    private parkingService: ParkingService,
    private toastrService: ToastrService
  ) {
    if (authService.isLoggedIn) {
      authService.redirectToUrl();
    }
  }

  ngOnInit() {
    this.step = 1;
  }

  login() {
    this.loading = true;
    this.errorLogin = '';
    this.authService
      .parkingLogin(this.email, this.password, this.userType)
      .pipe(switchMap((data) => this.startSession(data)))
      .subscribe(
        (parking_id) => {
          var role = this.session.get('role');
          this.authService.redirectAfterParkingLogin(parking_id, role);
          this.toastrService.success('You have successfully logged In');
          this.loading = false;
        },
        (err) => {
          console.error(err);
          this.loading = false;
        },

        () => {
          this.loading = false;
        }
      );
  }

  switchToNextStep(step: number) {
    if (!this.email) {
      this.emailErrorMessage = 'Email value cannot be null.';
    } else if (this.checkEmailValidation() && step) {
      this.step++;
    } else {
      this.emailErrorMessage = 'Please enter the valid email address';
    }
  }

  switchToBackStep(step: number) {
    if (step) {
      this.step--;
    }
  }

  handleEmailInputChange() {
    if (this.checkEmailValidation()) {
      this.emailErrorMessage = '';
    }
  }

  handleEmailBlurEvent() {
    if (!this.email) {
      this.emailErrorMessage = 'Email value cannot be null.';
    } else if (!this.checkEmailValidation()) {
      this.emailErrorMessage = 'Please enter the valid email address';
    }
  }

  checkEmailValidation() {
    let emailValidationRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailValidationRegex.test(String(this.email).toLowerCase());
  }

  startSession(result: any): Observable<any> {
    this.session.set('user', JSON.stringify(result.user));
    this.session.set('role', result.user.type);
    this.session.set('token', result.token);
    if (result.user.type === 'admin' || result.user.type === 'Admin') {
      this.getParkings();
    }
    this.session.set(
      'parking',
      result.user.parking ? JSON.stringify(result.user.parking) : ''
    );
    this.session.set(
      'parkings',
      result.user.parkings ? JSON.stringify(result.user.parkings) : '[]'
    );
    if (result.user.parkings && result.user.parkings.length > 0) {
      this.session.set('parking', JSON.stringify(result.user.parkings[0]));
    }
    this.session.set('login', '1');
    this.getvehicleTypes();

    return of(
      result?.user?.parking
        ? result?.user?.parking?.id
        : result?.user?.parkings?.[0]?.id
    );
  }

  getParkings() {
    this.parkingService.get(APIS.PARKING.ADDPARKING.GETPARKING).subscribe(
      (data: any) => {
        this.session.set('parkings', data ? JSON.stringify(data) : '[]');
        this.session.set('parking', JSON.stringify(data[0]));
        let user = JSON.parse(this.session.get('user'));
        user.parkings = data;
        this.session.set('user', JSON.stringify(user));
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getvehicleTypes = () => {
    this.parkingService.get(APIS.PARKING.VEHICLE_TYPES.LIST).subscribe(
      (data: Array<any>) => {
        this.session.set('vehicle', JSON.stringify(data));
      },
      (err) => {
        console.error(err);
      }
    );
  };
}

// startSession(result: any) {
//   this.session.set('result', JSON.stringify(result));
//   this.session.set('token', this.sistem.sistem_client_token);
//   this.session.set('prefix', this.sistem.sistem_client_prefix);
//   this.session.set('email', this.sistem.sistem_client_email);
//   this.session.set('logo', this.sistem.sistem_client_logo);
//   this.session.set('currency', this.sistem.sistem_client_currency);
//   this.session.set('business_name', this.sistem.sistem_client_business_name);
//   this.session.set('port', this.sistem.sistem_client_port);
//   this.session.set('role', this.role);
//   this.session.set('id', result.role_login_id);
//   this.session.set(
//     'name',
//     result.role_login_fname +
//       ' ' +
//       (result.role_login_lastname ? result.role_login_lastname : '')
//   );
//   this.session.set('profile_pic', result.role_login_profile_pic);
//   this.session.set('login', '1');
// }

// checkDomain() {
//   this.errorMessageDomain = '';
//   if (this.domain === '') {
//     return;
//   }
//   this.authService.checkDomain(this.domain).subscribe(
//     data => {
//       if (data[0].status === 'success') {
//         this.sistem = data[0].result[0];
//         this.step = 2;
//       } else {
//         this.errorMessageDomain = data[0].result;
//       }
//     },
//     err => console.error(err),
//   );
// }

// checkEmail() {
//   this.errorMessageEmail = '';
//   this.authService
//     .checkEmail(
//       this.sistem.sistem_client_port,
//       this.email,
//       this.sistem.sistem_client_token,
//       this.sistem.sistem_client_prefix,
//       this.sistem.sistem_client_email
//     )
//     .subscribe(
//       (data) => {
//         if (data[0].status === 'success') {
//           this.step = 3;
//         } else {
//           this.errorMessageEmail =
//             "The email you have entered doesn't match match our records. Please double check and try again.";
//         }
//       },
//       (err) => console.error(err)
//     );
// this.step = 3;

// if (this.email === this.sistem.sistem_client_email) {
//   this.step = 3;
// } else {
//   this.errorMessageEmail = 'The email you have entered doesn\'t match match our records. Please double check and try again.';
// }

// checkPassword() {
//   this.errorMessageEmail = '';
//   this.authService
//     .checkLogin(
//       this.sistem.sistem_client_port,
//       this.email,
//       this.password,
//       this.sistem.sistem_client_token,
//       this.sistem.sistem_client_prefix,
//       this.sistem.sistem_client_email
//     )
//     .subscribe(
//       (data) => {
//         if (data[0].status === 'success') {
//           this.otp = data[0].OTP;
//           this.timervalue = 30;
//           this.timerview = 1;
//           this.step = 4;
//           this.startTimer();
//         } else {
//           this.errorMessageEmail = 'Invalid Login';
//         }
//       },
//       (err) => console.error(err)
//     );
// }

// startTimer() {
//   const interval = setInterval(() => {
//     if (this.timervalue < 1) {
//       clearInterval(interval);
//       this.timerview = 0;
//     }
//     this.decreaseTimer();
//   }, 1000);
// }

// decreaseTimer() {
//   this.timervalue = this.timervalue - 1;
// }

// moveNextInput = (next, e) => {
//   if (e.keyCode === 8) {
//     if (next > 2) {
//       this['otp' + (next - 2)].nativeElement.focus();
//     }
//     return;
//   }
//   if (next < 7) {
//     this['otp' + next].nativeElement.focus();
//   }
// };

// verifyOTP() {
//   this.errorMessageOTP = '';
//   const otp =
//     this.otppart1 +
//     '' +
//     this.otppart2 +
//     '' +
//     this.otppart3 +
//     '' +
//     this.otppart4 +
//     '' +
//     this.otppart5 +
//     '' +
//     this.otppart6;
//   this.authService
//     .verifyOTP(
//       this.sistem.sistem_client_port,
//       otp,
//       this.email,
//       this.sistem.sistem_client_token,
//       this.sistem.sistem_client_prefix,
//       this.sistem.sistem_client_email
//     )
//     .subscribe(
//       (data) => {
//         if (data[0].status === 'success') {
//           const result = data[0].result[0];
//           this.role = data[0].role;
//           this.verificationRes.name = result[this.role + '_name'];
//           this.verificationRes.profile_pic =
//             result[this.role + '_profile_pic'];
//           this.verificationRes.id = result[this.role + '_id'];
//           this.verificationRes.company_name = result.company_name;
//           this.startSession(result);
//           this.authService.isLoggedIn = true;
//           this.authService.redirectToUrl();
//         } else {
//           this.errorMessageOTP = 'Invalid OTP';
//         }
//       },
//       (err) => console.error(err)
//     );
// }

// Result Data
//   [{status: "success", result: [,…], role: "country head", branch_id: 8, branch_name: "Delhi",…}]
// 0: {status: "success", result: [,…], role: "country head", branch_id: 8, branch_name: "Delhi",…}
// branch_id: 8
// branch_name: "Delhi"
// report_url: "https://www.google.com/"
// result: [,…]
// 0: {role_login_id: 11, role_login_salutation: "", role_login_fname: "Himanshu", role_login_lastname: null,…}
// admin_idfk: 1
// branch_id: 8
// common_idfk: null
// rank: 2
// role_login_address: "Gwalior"
// role_login_city: "MADHYA PRADESH"
// role_login_dob: "none"
// role_login_email: "himanshu@kormoan.in"
// role_login_fname: "Himanshu"
// role_login_id: 11
// role_login_lastname: null
// role_login_mobile: ""
// role_login_mobile2: ""
// role_login_otp: null
// role_login_pin: null
// role_login_profile_pic: "1613388076316Attachment_Mon_15_Feb_21_04_49_45_pm.png"
// role_login_reg_date: "Mon 1 Feb 21 5:25 pm"
// role_login_role: "country head"
// role_login_salutation: ""
// role_login_state: ""
// role_login_status: "1"
// storage: 1
// role: "country head"
// status: "success"
