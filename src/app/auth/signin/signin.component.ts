import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Session } from '../../classes/session';
import { ParkingService } from 'src/app/parking/parking.service';
import { APIS } from 'src/app/classes/appSettings';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'sistem-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [AuthService],
})
export class SigninComponent implements OnInit {
  loading: boolean = false;
  //   loginId = "shreya.enterprises@gmail.com"
  loginId = '';
  password = '';
  userType = 'operator';
  errorLogin = '';
  adminParking = '';
  constructor(
    private authService: AuthService,
    private session: Session,
    private parkingService: ParkingService
  ) {
    if (authService.isLoggedIn) {
      authService.redirectToUrl();
    }
  }

  ngOnInit() {}

  login() {
    this.loading = true;
    this.errorLogin = '';
    this.authService
      .parkingLogin(this.loginId, this.password, this.userType)
      .pipe(switchMap((data) => this.startSession(data)))
      .subscribe(
        (parking_id) => {
          var role = this.session.get('role');
          this.authService.redirectAfterParkingLogin(parking_id, role);
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

    return of(
      result?.user?.parking
        ? result?.user?.parking?.id
        : result?.user?.parkings?.[0]?.id
    );
  }
  getParkings() {
    this.parkingService.get(APIS.PARKING.ADDPARKING.GETPARKING).subscribe(
      (data: any) => {
        this.session.set('parking', JSON.stringify(data[0]));
        this.session.set('parkings', data ? JSON.stringify(data) : '[]');
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
