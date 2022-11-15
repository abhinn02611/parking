import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIS } from '../classes/appSettings';
// import Response from '../classes/response';
import { Router } from '@angular/router';
import { Session } from '../classes/session';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  xKey = '';
  xAccessToken = '';
  xSistem = '';
  xId = '';
  xRole = '';
  port = '';
  private _active = new Subject<string>();
  active = this._active.asObservable();
  public currency = '';
  private _content = {
    JSON: 'JSON',
    FORMDATA: 'FORMDATA',
  };

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private session: Session
  ) {}

  uploadParkingImages(files: FormData) {
    const URL = APIS.BASE_URL_PARKING + APIS.PARKING.ADDPARKING.PARKINGIMAGES;
    return this.httpClient.post(URL, files);
  }

  public get(url: string) {
    const URL = APIS.BASE_URL_PARKING + url;
    return this.httpClient
      .get(URL, {
        headers: this.getHeader(this._content.JSON),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            this.session.destroy();
            this.router.navigate(['/signin']);
          }
          return throwError(error.message || error);
        })
      );
  }

  public put(url: string, data: any) {
    const URL = APIS.BASE_URL_PARKING + url;
    return this.httpClient
      .put(URL, data, {
        headers: this.getHeader(this._content.JSON),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            this.session.destroy();
            this.router.navigate(['/signin']);
          }
          return throwError(error.message || error);
        })
      );
  }

  public delete(url: string) {
    const URL = APIS.BASE_URL_PARKING + url;
    return this.httpClient
      .delete(URL, {
        headers: this.getHeader(this._content.JSON),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            this.session.destroy();
            this.router.navigate(['/signin']);
          }
          return throwError(error.message || error);
        })
      );
  }

  public postJson(url: string, data: any) {
    const URL = APIS.BASE_URL_PARKING + url;
    return this.httpClient
      .post(URL, data, {
        headers: this.getHeader(this._content.JSON),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            this.session.destroy();
            this.router.navigate(['/signin']);
          }
          return throwError(error.message || error);
        })
      );
  }

  public putJson(url: string, data: any) {
    const URL = APIS.BASE_URL_PARKING + url;
    return this.httpClient
      .put(URL, data, {
        headers: this.getHeader(this._content.JSON),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            this.session.destroy();
            this.router.navigate(['/signin']);
          }
          return throwError(error.message || error);
        })
      );
  }

  public deleteJson(url: string, data: any) {
    const URL = APIS.BASE_URL_PARKING + url;
    return this.httpClient
      .delete(URL, {
        headers: this.getHeader(this._content.JSON),
        body: data,
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            this.session.destroy();
            this.router.navigate(['/signin']);
          }
          return throwError(error.message || error);
        })
      );
  }

  public postFormdata(url: string, data: any) {
    const URL = APIS.BASE_URL_PARKING + url;
    return this.httpClient
      .post(URL, data, {
        headers: this.getHeader(this._content.FORMDATA),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            this.session.destroy();
            this.router.navigate(['/signin']);
          }
          return throwError(error.message || error);
        })
      );
  }

  public getHeader(type: string): HttpHeaders {
    const token = this.session.get('token');
    if (this._content.JSON === type) {
      return new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('x-requested-with', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token);
    }
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  public getParkingName() {
    const parking = this.session.get('parking');
    if (parking == '') {
      return '';
    }
    const parkingJSON = JSON.parse(parking);
    return parkingJSON.name;
  }

  getVehicleDetail(vehicleId: any) {
    let vehicles = JSON.parse(this.session.get('vehicle'));
    let vehicleData = vehicles.find((V) => {
      return V.id === vehicleId;
    });
    return vehicleData;
  }

  getVehicleOptions() {
    let vehicles = JSON.parse(this.session.get('vehicle'));
    return vehicles.map((v: any) => {
      return { label: v.name, value: v.id };
    });
  }

  getParkingOption() {
    let parkings = JSON.parse(this.session.get('parkings'));
   return parkings.map((v: any) => {
      return { label: v.name, value: v.id };
    });
  }

  getVehiclePath(vehicleType: string) {
    switch (vehicleType) {
      case 'Bike':
        return this.getBikePath();
      case 'Car':
        return this.getCarPath();
      case 'Auto':
        return this.getAutoPath();
      case 'Bus':
        return this.getBusPath();
      case 'Cycle':
        return this.getBicyclePath();
      default:
        return [];
    }
  }

  getBikePath() {
    return [
      'M32.34,13.59H39c.51,1.29,1.08,2.56,1.53,3.88.28.86.74,1.23,1.63,1.07.7-.13,1,.14,1.3.85.59,1.66,1.27,3.28,1.94,4.95l1-.21a20.14,20.14,0,0,1,7.54-.32,1.27,1.27,0,0,1,1.21,1.33s0,.07,0,.11a1.34,1.34,0,0,1-1.44,1.24h-.08c-.26,0-.51-.07-.76-.09a16.56,16.56,0,0,0-6.42.55,18.33,18.33,0,0,1,.73,1.91c.2.74.57.94,1.35.9A7.23,7.23,0,0,1,56,35.28c.1.42.18.85.27,1.27v1c-.06.26-.13.53-.18.8a7.21,7.21,0,0,1-4.24,5.39,19,19,0,0,1-1.84.64H47.91c-.45-.13-.91-.23-1.35-.4a7,7,0,0,1-4.84-5.58,7.15,7.15,0,0,1,2.57-7c.25-.22.57-.67.5-.92A21,21,0,0,0,43.86,28a15.32,15.32,0,0,0-7.14,10.6H25.92l-.54-3.66-2.66,1v1.08a7.24,7.24,0,0,1-4.79,6.94c-.5.18-1,.31-1.52.46H14.32a6.08,6.08,0,0,0-.6-.21,7.29,7.29,0,0,1-5.38-5.37c-.1-.36-.19-.71-.28-1.06V36.56c.06-.3.14-.6.19-.91a7.33,7.33,0,0,1,8.56-5.81h.05a7.6,7.6,0,0,1,4.93,3.46l2.36-.88a14.92,14.92,0,0,0-5.25-4.86,27.5,27.5,0,0,0-9-3.18c-.85-.16-1.59-.39-1.88-1.31v-.39c.65-1.14.92-1.29,2.21-1,1.5.35,3,.66,4.49,1.14a28.9,28.9,0,0,0,8,1.46,16.22,16.22,0,0,0,12.8-4.55c.67-.68,1.23-1.52,2.51-1.16a10.72,10.72,0,0,1-.51-1.33c-.18-.8-.64-1-1.43-1-1.07.06-2.15,0-3.22,0-.82,0-1.38-.49-1.3-1.3C31.62,14.51,32.06,14.06,32.34,13.59Zm10.5,11.78c-.27-.71-.54-1.38-.8-2.05-.81-2.08-.81-2.05-3-2.1A2.51,2.51,0,0,0,37,22a15.94,15.94,0,0,1-7.61,4.23c-2,.47-4.14.67-6.09,1l3.6,4.22c.76-.27,1.61-.59,2.48-.88A1.37,1.37,0,0,1,30.76,33a1.5,1.5,0,0,1-.42.15c-.79.3-1.59.58-2.44.89a4.34,4.34,0,0,1,.21.88c0,.93.53,1.1,1.36,1.06,1.42-.07,2.84-.06,4.26,0a1,1,0,0,0,1.2-.85v0a16.73,16.73,0,0,1,6.6-8.88c.4-.27.83-.52,1.31-.82ZM20,36.85l-3.71,1.31c-1,.37-1.8.12-2.08-.66s.11-1.5,1.2-1.9L19,34.28a4.38,4.38,0,0,0-5.66-1.35,4.58,4.58,0,0,0,2.86,8.6,4.47,4.47,0,0,0,3.73-4.68ZM46,33.52a4.44,4.44,0,0,0-1.1,5.83,4.59,4.59,0,0,0,8.33-3.7,4.34,4.34,0,0,0-4.66-3.1c.47,1.21.94,2.41,1.4,3.61s.18,1.78-.6,2.1-1.5-.07-1.93-1.14-1-2.39-1.44-3.61Z',
    ];
  }

  getAutoPath() {
    return [
      'M48.12,34.81a23.67,23.67,0,0,0-3.29-15.58,4.75,4.75,0,0,0,2.49-3c.22-.79.29-1.36,0-1.78S46.4,14,45.58,14H18.37A6.46,6.46,0,0,0,17,14a6.16,6.16,0,0,0-5.44,6.77c0,5.18,0,10.37,0,15.59a3.64,3.64,0,0,1,0,.66,6.81,6.81,0,1,0,11.8,5.47h17a6.81,6.81,0,1,0,7.77-7.64Zm-2.21-5.68H42.44V19.68A20.81,20.81,0,0,1,45.91,29.13ZM46,31.58a18.78,18.78,0,0,1-.2,3.27,6.87,6.87,0,0,0-3.56,1.92c0-1.21,0-2.42,0-3.68V31.58ZM16.59,46.45a4.91,4.91,0,1,1,4.91-4.91A4.92,4.92,0,0,1,16.59,46.45ZM23.2,39.9a6.82,6.82,0,0,0-6.61-5.18,6.69,6.69,0,0,0-2.79.61V31.58h4.08c1.6,0,3.21,0,4.82,0l.15,0a.77.77,0,0,1,.79.78c.16.85.82,5.38,1,6.23l.3,1.53h-1.1A.75.75,0,0,1,23.2,39.9Zm9.36-8.2h1.91v8.36h-1.9V31.7ZM30,40.07H27.34c0-.16-.07-.32-.1-.48-.25-1.25-1-6.23-1.21-7.46a3.16,3.16,0,0,0-2.16-2.81.4.4,0,0,1-.22-.27c0-2.18,0-4.37,0-6.55V20.1c0-.36.11-.55.65-.55H30Zm6.75,0V40c0-1.34,0-6.27,0-7.6V31.7h.85a1,1,0,0,0,0-1.9H32.52L32.47,28V19.61H40l0,20.44H36.77ZM24.83,17.27c-2.61,0-3.49.87-3.49,3.46V28.5c0,.22,0,.45,0,.7H14.2l-.4,0v-2c0-.78,0-1.56,0-2.34,0-1.55,0-3.11,0-4.7,0-.07,0-.14,0-.21a3.63,3.63,0,0,1,1.06-2.59,3.58,3.58,0,0,1,2.58-1.09c6.62-.05,13.35,0,19.86,0h7.48a2.2,2.2,0,0,1-2.3,1.1ZM47.1,46.45A4.91,4.91,0,1,1,52,41.54,4.92,4.92,0,0,1,47.1,46.45Z',
    ];
  }

  getCarPath() {
    return [
      'M56.59,29.25A3.47,3.47,0,0,0,53,25.92H51.6c-.91,0-1.85,0-2.8,0a.52.52,0,0,1-.58-.39L48,25c-.36-.95-.73-1.93-1.17-2.86a12,12,0,0,0-11.09-7.33H35.6c-2.82-.08-5.68-.08-8.5,0H27a11.9,11.9,0,0,0-10.61,6.46,35.3,35.3,0,0,0-1.81,4.24.58.58,0,0,1-.68.44c-.69,0-1.38,0-2.05,0H10.67A3.44,3.44,0,0,0,7.3,29.44v3.88a3.22,3.22,0,0,0,0,1,3.53,3.53,0,0,0,4,3h6c.56,2.88,2.2,4.47,4.64,4.46H22a4.71,4.71,0,0,0,4.58-4.43h13a4.73,4.73,0,0,0,4.5,4.43h.13c2.42,0,4.07-1.58,4.64-4.44h4.41a3.46,3.46,0,0,0,3.34-3.56V29.51A1.13,1.13,0,0,0,56.59,29.25ZM33.23,25.88V17.31l.23,0a10.63,10.63,0,0,1,12.2,8.61Zm9.46,9.85a2.12,2.12,0,0,1,1.48-.64h0a2.1,2.1,0,0,1,0,4.19h-.11a2.1,2.1,0,0,1-1.43-3.56ZM19.81,37.17a2.13,2.13,0,0,1,2-2.1l.07,0A2.14,2.14,0,0,1,24,37.19a2.06,2.06,0,0,1-.62,1.48,2.11,2.11,0,0,1-1.48.61h0a2.08,2.08,0,0,1-2.09-2.11Zm-10-4.32H12V30.42H9.78c0-.1,0-.19,0-.28,0-.24,0-.46,0-.68,0-.71.42-1.05,1.2-1.05H52.63c1.19,0,1.48.29,1.48,1.46v3.69c0,.94-.34,1.29-1.25,1.29H52c-1.15,0-2.33,0-3.49,0a1,1,0,0,1-.63-.31,4.94,4.94,0,0,0-1.07-1.07,4.58,4.58,0,0,0-6.36,1.06.91.91,0,0,1-.63.31c-4.5,0-9.07,0-13.57,0a1,1,0,0,1-.69-.34,4.43,4.43,0,0,0-1-1,4.61,4.61,0,0,0-3.41-.83,4.55,4.55,0,0,0-3,1.81,1,1,0,0,1-.69.34c-2.08,0-4.21,0-6.26,0-1.21,0-1.49-.27-1.49-1.46Zm7.37-7a10.45,10.45,0,0,1,10-8.61c.79,0,1.58,0,2.41,0h1.16v8.61Z',
    ];
  }

  getBusPath() {
    return [
      'M52.05,15.84h-.28c-.78,0-1.59,0-2.39,0h0v0a8.22,8.22,0,0,0,0-.86V14.6a2.26,2.26,0,0,0,0-.52,3.21,3.21,0,0,0-3.44-2.95H18.68a3.18,3.18,0,0,0-3,3c0,.54,0,1.08,0,1.66H13a1.26,1.26,0,0,0-1.39,1.42V24a1.19,1.19,0,0,0,1.19,1.32h0c.55,0,1.14-.34,1.19-1.32v-.37c0-.59,0-1.18,0-1.77,0-1.19,0-2.37,0-3.56v-.07h.07c.34,0,.68,0,1,0h.6V44.47c0,.26,0,.52,0,.78a3.14,3.14,0,0,0,2.87,2.94h0v0c0,1.05,0,2.11,0,3.13a2.82,2.82,0,0,0,2.61,3,34.41,34.41,0,0,0,3.8,0,2.62,2.62,0,0,0,2.44-2,4.43,4.43,0,0,0,.13-1.19V48.24h9.94v3.12a1.69,1.69,0,0,0,0,.45,2.83,2.83,0,0,0,3,2.61h2.72a2.17,2.17,0,0,0,.36,0,1.83,1.83,0,0,0,.33,0,2.87,2.87,0,0,0,1.95-1.08,2.83,2.83,0,0,0,.6-2.09v-3a5.1,5.1,0,0,0,1.6-.62,3.2,3.2,0,0,0,1.29-2.87V18.21h1.68v5.68c0,.8.33,1.27,1,1.4a1.12,1.12,0,0,0,1-.23,1.42,1.42,0,0,0,.46-1.14V17.24A1.26,1.26,0,0,0,52.05,15.84Zm-8,34.85c0,.26,0,.53,0,.79v.11a.45.45,0,0,1-.14.31.52.52,0,0,1-.36.12c-1.06,0-2.12,0-3.27,0a.46.46,0,0,1-.41-.53q0-1.62,0-3.24h4.18v2.44Zm-18.94.91a.43.43,0,0,1-.49.41c-1.07,0-2.15,0-3.25,0h0a.39.39,0,0,1-.4-.38c0-.84,0-1.68,0-2.55v-.85h4.16v1C25.15,50,25.16,50.75,25.14,51.6ZM47,33.82V44.71c0,.88-.25,1.13-1.11,1.13H19.19c-.88,0-1.13-.24-1.13-1.12V33.83ZM47,14.3v.54c0,.31,0,.63,0,1H29.63c-3.84,0-7.66,0-11.46,0h-.09v0c0-.26,0-.52,0-.78s0-.43,0-.68a.83.83,0,0,1,.24-.58.76.76,0,0,1,.6-.24H46.21A.82.82,0,0,1,47,14.3ZM18.09,31.39V18.22H47V31.39H18.09Z',

      'M42,44.15h0A4.08,4.08,0,0,0,42.07,36a4.25,4.25,0,0,0-2.91,1.14A4,4,0,0,0,37.91,40,4.12,4.12,0,0,0,42,44.15Zm0-5.76h0a1.66,1.66,0,0,1,1.17.49,1.61,1.61,0,0,1,.48,1.19A1.7,1.7,0,0,1,42,41.76a1.68,1.68,0,0,1-1.68-1.68h-.18l.18,0A1.66,1.66,0,0,1,42,38.39Z',

      'M23,44.15H23a4.12,4.12,0,0,0,4.11-4h0a4.09,4.09,0,0,0-4-4.13h-.05A4.08,4.08,0,0,0,23,44.15ZM21.38,40a1.68,1.68,0,0,1,1.69-1.66h0A1.68,1.68,0,0,1,24.74,40v.09a1.68,1.68,0,1,1-3.35,0Z',

      'M30.28,41.28h4.51c.84,0,1.38-.48,1.38-1.2a1.21,1.21,0,0,0-1.38-1.19H30.27a1.21,1.21,0,0,0-1.38,1.19A1.23,1.23,0,0,0,30.28,41.28Z',
    ];
  }

  getBicyclePath() {
    return [
      'M48.37,28a8.6,8.6,0,0,0-2.17.28L41.85,18.11,45,16.8a1.49,1.49,0,0,0,.82-2,1.51,1.51,0,0,0-2-.82l-4.6,1.89a1.52,1.52,0,0,0-.81,2l1.89,4.4H25.56l-1.1-2.66h2.91a1.5,1.5,0,0,0,0-3h-8a1.5,1.5,0,0,0,0,3h1.88a.65.65,0,0,0,0,.13l1.58,3.82L19.2,28.74a9,9,0,1,0,5.33,9.88h5.55a1.55,1.55,0,0,0,.31,0,.29.29,0,0,0,.1,0l.17,0h0l.12-.06.15-.09.09-.08.15-.13s0,0,0,0l10.7-12.21,1.54,3.58A9,9,0,1,0,48.37,28ZM24.21,26.85l3.63,8.77H24.55a9,9,0,0,0-2.83-5.25Zm-4.24,6a6.09,6.09,0,0,1,1.53,2.78H18ZM15.63,43.09a6,6,0,0,1,0-12.09,6.19,6.19,0,0,1,1.78.27l-3.53,5a1.5,1.5,0,0,0,1.22,2.37h6.36A6,6,0,0,1,15.63,43.09Zm14.92-8.78-3.75-9H38.45Zm17.82,8.78a6,6,0,0,1-3.72-10.8l2.22,5.18a1.5,1.5,0,0,0,1.38.91,1.59,1.59,0,0,0,.59-.12,1.51,1.51,0,0,0,.79-2l-2.23-5.2a6.25,6.25,0,0,1,1-.09,6,6,0,0,1,0,12.09Z',
    ];
  }
}



