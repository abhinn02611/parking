import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIS } from '../classes/appSettings';
import Response from '../classes/response';
import { Router } from '@angular/router';
import { Session } from '../classes/session';
import * as moment from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  xKey = '';
  xAccessToken = '';
  public xSistem = '';
  public xId = '';
  public xRole = '';
  public adminId = '';
  public port = '';
  public currency = '';
  public name = '';
  public rank = '';
  public companyName = '';
  public role = new Subject<string>();
  public search = new Subject<string>();
  public userSession = new Subject<any>();
  public selectedParking = new BehaviorSubject<any>(null);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private session: Session
  ) {
    // if (session.get('login') === '1') {
    //   this.xKey = session.get('email');
    //   this.xAccessToken = session.get('token');
    //   this.xSistem = session.get('prefix');
    //   this.xId = session.get('id');
    //   this.adminId = session.get('admin_id');
    //   this.xRole = session.get('role');
    //   this.port = session.get('port');
    //   this.currency = session.get('currency');
    //   this.name = session.get('name');
    //   this.companyName = session.get('business_name');
    //   if (this.adminId === '') {
    //     this.adminId = '0';
    //   }
    //   const userResult = session.get('result');
    //   let userObject = null;
    //   try{
    //     userObject = JSON.parse(userResult);
    //     this.rank = userObject.rank;
    //   }catch (e) {
    //     console.error('Unable to parse user data');
    //   }
    // }
  }

  public getToday() {
    const today = moment();
    return today.format('ddd DD MMM YY hh:mm a');
  }

  public get(url: string) {
    const URL = APIS.BASE_URL + this.port + url + this.xSistem;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-access-token', this.xAccessToken)
      .set('x-key', this.xKey);
    return this.httpClient.get(URL, { headers });
  }

  public delete(url: string) {
    const URL = APIS.BASE_URL + this.port + url + this.xSistem;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-access-token', this.xAccessToken)
      .set('x-key', this.xKey);
    return this.httpClient.delete(URL, { headers });
  }

  public postJson(url: string, body: any) {
    const URL = APIS.BASE_URL + this.port + url + this.xSistem;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-access-token', this.xAccessToken)
      .set('x-key', this.xKey);
    body.role = this.xRole;
    body.common_idfk = this.xId;
    body.adminId = this.adminId;
    body.loginRoleName = this.name;
    body.locLatitute = 0;
    body.locLongtitute = 0;
    body.companyName = 0;
    return this.httpClient.post(URL, JSON.stringify(body), { headers });
  }

  public postJsonTest(url: string, body: any, headersKV = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    Object.keys(headersKV).map((a) => {
      headers.set(a, headersKV[a]);
    });
    body.role = this.xRole;
    body.common_idfk = this.xId;
    body.adminId = this.adminId;
    return this.httpClient.post(url, JSON.stringify(body), { headers });
  }

  public postEncoded(url: string, body: any) {
    let form = null;
    const URL = APIS.BASE_URL + this.port + url + this.xSistem;
    if (!(body instanceof FormData)) {
      form = new FormData();
      for (const key of Object.keys(body)) {
        form.append(key, body[key]);
        form.append('role', this.xRole);
        form.append('common_idfk', this.xId);
        form.append('adminId', this.adminId);
        form.append('loginRoleName', this.name);
        form.append('locLatitute', 0);
        form.append('locLongtitute', 0);
      }
    } else {
      form = body;
    }
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('x-access-token', this.xAccessToken)
      .set('x-key', this.xKey);
    return this.httpClient.post(URL, form, { headers });
  }

  public postForm(url: string, body: any) {
    let form = null;
    if (!(body instanceof FormData)) {
      form = new FormData();
      for (const key of Object.keys(body)) {
        form.append(key, body[key]);
        form.append('role', this.xRole);
        form.append('common_idfk', this.xId);
        form.append('adminId', this.adminId);
      }
    } else {
      form = body;
      form.role = this.xRole;
      form.common_idfk = this.xId;
      form.adminId = this.adminId;
    }
    const URL = APIS.BASE_URL + this.port + url + this.xSistem;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('x-access-token', this.xAccessToken)
      .set('x-key', this.xKey);
    return this.httpClient.post(URL, form, { headers });
  }

  public upload(formData: any) {
    const URL =
      APIS.BASE_URL + this.port + APIS.SALES.FILE.UPLOAD + this.xSistem;
    const headers = new HttpHeaders()
      .set('x-access-token', this.xAccessToken)
      .set('x-key', this.xKey);
    formData.append('role', this.xRole);
    formData.append('common_idfk', this.xId);
    formData.append('adminId', this.adminId);
    return this.httpClient.post(URL, formData, { headers });
  }

  public uploadAttachment(formData: any) {
    const URL =
      APIS.BASE_URL + this.port + APIS.SALES.ATTACHMENT.UPLOAD + this.xSistem;
    // const URL = "http://localhost:4000/api/auth/upload";
    const headers = new HttpHeaders()
      .set('x-access-token', this.xAccessToken)
      .set('x-key', this.xKey);
    formData.append('role', this.xRole);
    formData.append('common_idfk', this.xId);
    formData.append('adminId', this.adminId);
    return this.httpClient.post(URL, formData, { headers });
  }
}
