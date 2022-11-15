import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { APIS } from 'src/app/classes/appSettings';
import { Session } from 'src/app/classes/session';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-parksettings-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
})
export class VendorComponent implements OnInit {
  _albums: any[] = [];
  addNewModelOpen = false;
  infoOpen = true;
  loading = false;
  sidebarFixed = false;
  confirmDeleteModelOpen = false;
  math = Math;
  user: any;
  parking: any;
  lat: any;
  lng: any;
  url: string = APIS.IMAGE_BASE_URL;
  isEditParking: boolean;

  constructor(
    private renderer: Renderer2,
    private session: Session,
    private router: Router,
    private _lightbox: Lightbox
  ) {
    this.renderer.addClass(document.body, 'body-grey');
    this.router.events.subscribe((val) => {
      this.ngOnInit();
    });
    // this.url = 'https://staging.api.parking.sistem.app/auth/';
  }

  ngOnInit(): void {
    this.user = JSON.parse(this.session.get('user'));
    this.parking = JSON.parse(this.session.get('parking'));
    if (
      this.parking.point.coordinates &&
      this.parking.point.coordinates.length > 0
    ) {
      this.lat = this.parking.point.coordinates[0].toFixed(2);
      this.lng = this.parking.point.coordinates[1].toFixed(2);
    }

    this.parking.images.forEach((img) => {
      const src = this.url + img;
      const album = { src: src, caption: '', thumb: '' };
      this._albums.push(album);
    });

    if (this.user.type === 'operator' || this.user.type === 'vendor') {
      this.isEditParking = false;
    } else {
      this.isEditParking = true;
    }
  }

  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
  };
  formatDate = (date) => {
    if (!date) {
      return '--';
    }
    return moment(date).format('ddd DD MMM YY hh:mmA');
  };

  openAddNewModel = () => {
    this.addNewModelOpen = true;
  };

  open(index: number): void {
    this._lightbox.open(this._albums, index, {
      showImageNumberLabel: true,
      fitImageInViewPort: true,
      disableScrolling: true,
      centerVertically: true,
    });
  }

  close(index: number): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  getInitial(user: any) {
    let fName = '';
    let lName = '';
    let value = '';
    if (user !== null) {
      const userCheck = user.firstName !== null || user.lastName !== null;
      if (user.firstName) {
        fName = user.firstName.charAt(0);
      }
      if (user.lastName) {
        lName = user.lastName.charAt(0);
      }
      value = fName + ' ' + lName;
    }
    return value === 'n n' || value === ' ' || value === null ? 'U' : value;
  }
}
