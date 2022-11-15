import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Session } from 'src/app/classes/session';
import { COUNTRIES_JSON } from 'src/app/classes/countries';

@Component({
  selector: 'sistem-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('otp1') otp1: ElementRef;
  @ViewChild('otp2') otp2: ElementRef;
  @ViewChild('otp3') otp3: ElementRef;
  @ViewChild('otp4') otp4: ElementRef;
  @ViewChild('otp5') otp5: ElementRef;
  @ViewChild('otp6') otp6: ElementRef;

  otp = '';
  otppart1 = '';
  otppart2 = '';
  otppart3 = '';
  otppart4 = '';
  otppart5 = '';
  otppart6 = '';

  currencies = [
    {
      value: 'Rs',
      label: 'Rupees'
    },
    {
      value: '$',
      label: 'Doller'
    },
    {
      value: '€',
      label: 'Euro'
    }
  ];

  countries = [];
  errors = {
    inputName: '',
    inputEmail: '',
    inputMobile: '',
    inputJob: '',
    inputCountry: '',
    inputCurrency: '',
    inputPassword: ''
  };
  passwordType = 'password';
  viewStep = 1;
  processingStep = 0;
  errorMessage = '';
  inputWebsite = '';
  inputSystemDomain = '';

  registerId = 213;

  inputName = '';
  inputEmail = '';
  inputMobile = '';
  inputJob = '';
  inputCountry = '';
  inputCurrency = '';

  inputPassword = '';

  uniqueId = '';
  portNo = '';
  regClient = {
    sistem_reg_date: '',
    sistem_reg_salt: ''
  };

  validateRes = {
    sistem_client_logo: '',
    sistem_client_currency: '',
    sistem_client_port: '',
    sistem_client_prefix: '',
    sistem_client_company_name: '',
    sistem_client_fullname: '',
    sistem_client_email: '',
    sistem_client_business_name: ''
  };


  constructor(private authService: AuthService, private session: Session) {
    this.countries = COUNTRIES_JSON.map(v => {
      return {
        value: v.countryname,
        label: v.countryname
      };
    });
  }

  ngOnInit() {

  }

  moveNext = () => {
    this.viewStep++;
  }

  moveNextInput = (next, e) => {
    if (e.keyCode === 8) {
      if (next > 2) {
        this['otp' + (next - 2)].nativeElement.focus();
      }
      return;
    }
    if (next < 7) {
      this['otp' + (next)].nativeElement.focus();
    }
  }

  togglePasswordType = () => {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  submitForm = () => {

  }

  submitValidateDomain = () => {
    if (this.processingStep === 1) {
      return;
    }
    this.errorMessage = '';
    if (this.inputSystemDomain.trim() === '' || this.inputWebsite.trim() === '') {
      return;
    }
    this.processingStep = 1;
    this.authService.regVerifyDomainName(this.inputWebsite, this.inputSystemDomain).subscribe(
      data => {
        this.processingStep = 0;
        if (data[0].status === 'success') {
          this.registerId = data[0].result;
          this.moveNext();
        } else {
          this.errorMessage = data[0].result;
        }
      },
      err => {
        this.processingStep = 0;
        this.errorMessage = JSON.stringify(err.error);
        console.error(err);
      },
    );
  }

  validateRegistrationData = () => {
    this.errors.inputCountry = '';
    this.errors.inputCurrency = '';
    this.errors.inputEmail = '';
    this.errors.inputJob = '';
    this.errors.inputMobile = '';
    this.errors.inputName = '';
    let valid = true;
    if (this.inputName.trim() === '') {
      valid = false;
      this.errors.inputName = 'Please enter Full Name';
    }
    if (this.inputEmail.trim() === '') {
      valid = false;
      this.errors.inputEmail = 'Please enter Email';
    }
    if (this.inputMobile.trim() === '') {
      valid = false;
      this.errors.inputMobile = 'Please enter Phone';
    } else {
      const isnum = /^\d+$/.test(this.inputMobile);
      if (!isnum) {
        valid = false;
        this.errors.inputMobile = 'Please enter valid phone';
      }
    }
    if (this.inputJob.trim() === '') {
      valid = false;
      this.errors.inputJob = 'Please enter Job Title';
    }
    if (this.inputCountry.trim() === '') {
      valid = false;
      this.errors.inputCountry = 'Please select Country';
    }
    if (this.inputCurrency.trim() === '') {
      valid = false;
      this.errors.inputCurrency = 'Please select Currency';
    }
    return valid;
  }

  submitRegisterClient = () => {
    if (this.validateRegistrationData() === false) {
      return;
    }
    if (this.processingStep === 2) {
      return;
    }
    this.errorMessage = '';
    this.processingStep = 2;
    const body = {
      fullName: this.inputName,
      userEmail: this.inputEmail,
      userPhone: this.inputMobile,
      jobTitle: this.inputJob,
      countryName: this.inputCountry,
      registerId: this.registerId,
      currencyName: this.inputCurrency
    };
    this.authService.regClientByDomain(body).subscribe(
      data => {
        this.processingStep = 0;
        if (data[0].status === 'success') {
          this.moveNext();
        } else {
          this.errorMessage = data[0].result;
        }
      },
      err => {
        this.processingStep = 0;
        this.errorMessage = JSON.stringify(err.error);
        console.error(err);
      },
      () => console.log('done loading reg')
    );
  }

  submitVerifyOTP = () => {
    this.otp = this.otppart1 + '' + this.otppart2 + '' + this.otppart3 + '' + this.otppart4 + '' + this.otppart5 + '' + this.otppart6;
    if (this.otp.length !== 6) {
      return;
    }
    if (this.processingStep === 3) {
      return;
    }
    this.errorMessage = '';
    this.processingStep = 3;
    this.authService.regVerifyOTP(this.otp, this.inputEmail).subscribe(
      data => {
        this.processingStep = 0;
        if (data[0].status === 'success') {
          this.moveNext();
        } else {
          this.errorMessage = data[0].result;
        }
      },
      err => {
        this.processingStep = 0;
        this.errorMessage = JSON.stringify(err.error);
        console.error(err);
      },
      () => console.log('done loading otp')
    );
  }

  submitPassword = () => {
    if (this.inputPassword.trim() === '') {
      this.errors.inputPassword = 'Password should not be blank';
      return;
    } else {
      if (this.inputPassword.trim().length < 6 || this.inputPassword.trim() === '12356') {
        this.errors.inputPassword = 'Please enter a strong Password';
        return;
      }
    }
    if (this.processingStep === 4) {
      return;
    }
    this.errorMessage = '';
    this.processingStep = 4;
    this.authService.regCreatePassword(this.inputPassword, this.inputEmail).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.uniqueId = data[0].result;
          this.portNo = data[0].port_no;
          this.regClient = data[0].regClient;
          this.importDatabase();
        } else {
          this.processingStep = 0;
          this.errorMessage = (typeof (data[0].result) === 'object') ? JSON.stringify(data[0].result) : data[0].result;
        }
      },
      err => {
        this.processingStep = 0;
        this.errorMessage = JSON.stringify(err.error);
        console.error(err);
      },
      () => console.log('done loading password')
    );
  }

  importDatabase = () => {
    this.errorMessage = '';
    this.authService.regImportDatabase(this.uniqueId).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.startServer();
        } else {
          this.processingStep = 0;
          this.errorMessage = (typeof (data[0].result) === 'object') ? JSON.stringify(data[0].result) : data[0].result;
        }
      },
      err => {
        this.processingStep = 0;
        this.errorMessage = JSON.stringify(err.error);
        console.error(err);
      },
      () => console.log('done loading database')
    );
  }

  startServer = () => {
    this.errorMessage = '';
    this.authService.regStartServer(this.uniqueId).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.validateClient();
        } else {
          this.processingStep = 0;
          this.errorMessage = (typeof (data[0].result) === 'object') ? JSON.stringify(data[0].result) : data[0].result;
        }
      },
      err => {
        this.processingStep = 0;
        this.errorMessage = JSON.stringify(err.error);
        console.error(err);
      },
      () => console.log('done loading start server')
    );
  }

  validateClient = () => {
    this.errorMessage = '';
    this.authService.regValidateClient(this.uniqueId).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.validateRes = data[0].result.req.data[0];

          this.insertAdmin();
        } else {
          this.processingStep = 0;
          this.errorMessage = (typeof (data[0].result) === 'object') ? JSON.stringify(data[0].result) : data[0].result;
        }
      },
      err => {
        this.errorMessage = JSON.stringify(err.error) + ' We will retry in 5 seconds.';
        console.error(err);
        setTimeout(() => this.validateClient(), 5000);
      },
      () => console.log('done loading validate Client')
    );
  }

  insertAdmin = () => {
    this.errorMessage = '';
    const body = {
      comapanyName: this.inputWebsite,
      portNo: this.portNo,
      comapanyPrefix: this.inputSystemDomain,
      fullName: this.inputName,
      adminEmail: this.inputEmail,
      comapanyRegDate: this.regClient.sistem_reg_date,
      comapanyPass: this.inputPassword,
      comapanySalt: this.regClient.sistem_reg_salt,
      adminUniqId: this.uniqueId
    };
    this.authService.regInsertAdmin(body, this.portNo).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.loginForToken();
        } else {
          this.processingStep = 0;
          this.errorMessage = (typeof (data[0].result) === 'object') ? JSON.stringify(data[0].result) : data[0].result;
        }
      },
      err => {
        this.processingStep = 0;
        this.errorMessage = JSON.stringify(err.error);
        console.error(err);
      },
      () => console.log('done loading inser admin')
    );
  }

  loginForToken = () => {
    this.errorMessage = '';
    this.authService.regLoginForToken(this.inputEmail, this.portNo).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.processingStep = 0;
          const resdata = data[0].result.req.data;

          this.session.set('token', resdata.token);
          this.session.set('prefix', this.validateRes.sistem_client_prefix);
          this.session.set('email', this.validateRes.sistem_client_email);
          this.session.set('logo', this.validateRes.sistem_client_logo);
          this.session.set('currency', this.validateRes.sistem_client_currency);
          this.session.set('business_name', this.validateRes.sistem_client_business_name);
          this.session.set('port', this.validateRes.sistem_client_port);
          this.session.set('role', resdata.user.role);
          this.session.set('name', this.validateRes.sistem_client_fullname);
          this.session.set('company_name', this.validateRes.sistem_client_company_name);
          this.session.set('profile_pic', '');
          this.session.set('login', '1');
          this.authService.isLoggedIn = true;
          this.authService.redirectToUrl();
        } else {
          this.processingStep = 0;
          this.errorMessage = (typeof (data[0].result) === 'object') ? JSON.stringify(data[0].result) : data[0].result;
        }
      },
      err => {
        this.processingStep = 0;
        this.errorMessage = JSON.stringify(err.error);
        console.error(err);
      },
      () => console.log('done loading database')
    );
  }















}
