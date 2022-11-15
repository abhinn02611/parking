import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIS } from '../classes/appSettings';
import { Router } from '@angular/router';
import { Session } from '../classes/session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  isParking = false;
  role: string = '';
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private session: Session
  ) {
    this.role = this.session.get('role');
    if (session.get('login') === '1') {
      this.isLoggedIn = true;
    }
    if (session.get('parking') !== '') {
      this.isParking = true;
    }
  }

  public checkDomain(domain?: string) {
    const body = { businessName: domain };
    const URL = APIS.BASE_URL + APIS.PORT_DOMAIN + APIS.CHECK_DOMAIN;
    return this.httpClient.post(URL, body);
  }

  public generateForgotPassword(email: string) {
    const URL = APIS.BASE_URL_PARKING + APIS.PARKING_FORGOT_PASSWORD_GENERATE;
    const body = { email_mobile: email };
    return this.httpClient.post(URL, body);
  }

  public verifyOtpForForgotPassword(verifyOtp?: number, sessionId?: string) {
    const body = {
      otp: {
        sessionId: sessionId,
        value: verifyOtp,
      },
    };
    const URL = APIS.BASE_URL_PARKING + APIS.PARKING_FORGOT_PASSWORD_VERIFY;
    return this.httpClient.post(URL, body);
  }

  public generateNewPassword(email: string, newPassword: string) {
    const URL = APIS.BASE_URL_PARKING + APIS.PARKING_FORGOT_PASSWORD_CHANGE;
    const body = {
      email_mobile: email,
      password: newPassword,
    };
    return this.httpClient.post(URL, body);
  }

  public checkEmail(
    port?: string,
    email?: string,
    token?: string,
    prefix?: string,
    adminemail?: string
  ) {
    const body = { useremail: email };
    const URL = APIS.BASE_URL + port + APIS.CHECK_EMAIL + prefix.trim();
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-access-token', token)
      .set('x-key', adminemail);
    const options = { headers };
    return this.httpClient.post(URL, body, options);
  }

  public checkLogin(
    port?: string,
    email?: string,
    password?: string,
    token?: string,
    prefix?: string,
    adminemail?: string
  ) {
    const body = { username: email, userpass: password };
    const URL = APIS.BASE_URL + port + APIS.LOGIN + prefix;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-access-token', token)
      .set('x-key', adminemail);
    const options = { headers };
    return this.httpClient.post(URL, body, options);
  }

  public verifyOTP(
    port?: string,
    otp?: string,
    email?: string,
    token?: string,
    prefix?: string,
    adminemail?: string
  ) {
    const body = { username: email, emailOTP: otp };
    const URL = APIS.BASE_URL + port + APIS.VERIFY_OTP + prefix;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-access-token', token)
      .set('x-key', adminemail);
    const options = { headers };
    return this.httpClient.post(URL, body, options);
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
  }

  redirectToUrl(): void {
    let redirectUrl = this.session.get('redirectUrl');
    var role = this.session.get('role');

    if (redirectUrl === '') {
      if (this.isParking) {
        const parkingJSON = JSON.parse(this.session.get('parking'));

        // redirectUrl = '/parking/parksettings/' + parkingJSON.id;

        this.redirectAfterParkingLogin(parkingJSON.id, role);
      } else {
        redirectUrl = '/sales/allleads';
      }
    }
    this.session.set('redirectUrl', '');
    // this.router.navigate([redirectUrl]);
  }

  redirectAfterParkingLogin(id, userRole): void {
    this.session.set('role', userRole);
    if (userRole === 'admin') {
      this.router.navigate(['/parking/dashboard']);
    } else if (userRole === 'vendor') {
      this.router.navigate(['/parking/reports', id], { replaceUrl: false });
    } else {
      this.router.navigate(['/parking/sessions', id], { replaceUrl: false });
    }
  }
  regVerifyDomainName(domainName?: string, loginDomain?: string) {
    const body = { domainName, loginDomain };
    const URL = APIS.BASE_URL + APIS.PORT_DOMAIN + APIS.REG.VERIFY_DOMAIN_NAME;
    return this.httpClient.post(URL, body);
  }

  regClientByDomain(body?: any) {
    const URL =
      APIS.BASE_URL + APIS.PORT_DOMAIN + APIS.REG.REGISTER_CLIENT_BY_DOMAIN;
    return this.httpClient.post(URL, body);
  }

  regVerifyOTP(clientOTP?: string, clientEmail?: string) {
    const body = { clientOTP, clientEmail };
    const URL =
      APIS.BASE_URL +
      APIS.PORT_DOMAIN +
      APIS.REG.VERIFY_ACCOUNT_BY_CLIENT_USING_OTP;
    return this.httpClient.post(URL, body);
  }

  regCreatePassword(clientPassword?: string, clientEmail?: string) {
    const body = { clientPassword, clientEmail };
    const URL = APIS.BASE_URL + APIS.PORT_DOMAIN + APIS.REG.CREATE_PASSWORD;
    return this.httpClient.post(URL, body);
  }

  regImportDatabase(uniqueId?: string) {
    const body = { uniqueId };
    const URL = APIS.BASE_URL + APIS.PORT_DOMAIN + APIS.REG.IMPORT_DATABASE;
    return this.httpClient.post(URL, body);
  }

  regStartServer(clientId?: string) {
    const body = { clientId };
    const URL = APIS.BASE_URL + APIS.PORT_DOMAIN + APIS.REG.START_SERVER;
    return this.httpClient.post(URL, body);
  }

  regValidateClient(uniqueId?: string) {
    const body = { uniqueId };
    const URL = APIS.BASE_URL + APIS.PORT_DOMAIN + APIS.REG.VALIDATE_CLIENT;
    return this.httpClient.post(URL, body);
  }

  /*
   *  body ={"comapanyName": "impulsiveweb.com",
    "portNo": "1210",
    "comapanyPrefix": "imp",
    "fullName": "Sheetal Kumar",
    "adminEmail": "sheetalkumar105@gmail.com",
    "comapanyRegDate": "Fri 16 Aug 19 10:52 pm",
    "comapanyPass": "123456",
    "comapanySalt": "d862de8226fdc819d3112ff6a11ed101",
    "adminUniqId": "186" }
   */

  regInsertAdmin(body?: any, port?: string) {
    const URL = APIS.BASE_URL + port + APIS.REG.INSERT_ADMIN;
    return this.httpClient.post(URL, body);
  }

  regLoginForToken(username?: string, port?: string) {
    const body = { username };
    const URL = APIS.BASE_URL + port + APIS.REG.LOGIN_FOR_TOKEN;
    return this.httpClient.post(URL, body);
  }

  parkingLogin(loginId: string, password: string, userType: string) {
    const body = { loginId, password, userType };
    const URL = APIS.BASE_URL_PARKING + APIS.PARKING.LOGIN;
    return this.httpClient.post(URL, body);
  }
}
