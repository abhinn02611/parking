import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIS } from '../classes/appSettings';
import Response from '../classes/response';
import { Router } from '@angular/router';
import { Session } from '../classes/session';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  xKey = '';
  xAccessToken = '';
  xSistem = '';
  xId = '';
  xRole = '';
  port = '';
  public currency = '';


  constructor(private httpClient: HttpClient, private router: Router, private session: Session) {
    if (session.get('login') === '1') {
      this.xKey = session.get('email');
      this.xAccessToken = session.get('token');
      this.xSistem = session.get('prefix');
      this.xId = session.get('id');
      this.xRole = session.get('role');
      this.port = session.get('port');
      this.currency = session.get('currency');
    }
  }

  public getProducts(domain?: string) {
    const URL = APIS.BASE_URL + this.port + APIS.SALES.PRODUCT.LIST + this.xSistem;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-access-token', this.xAccessToken)
    .set('x-key', this.xKey);
    return this.httpClient.get(URL, {headers});
  }
  public getContacts(domain?: string) {
    const URL = APIS.BASE_URL + this.port + APIS.SALES.CONTACT.LIST + this.xRole + '/' + this.xId + '/' + this.xSistem;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-access-token', this.xAccessToken)
    .set('x-key', this.xKey);
    return this.httpClient.get(URL, {headers});
  }

  public getUserRole() {
    return this.xRole;
  }

  public getUserId() {
    return this.xId;
  }
}
