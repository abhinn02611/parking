import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { WINDOW } from 'src/app/services/window.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Globals } from '../../classes/globals';
import { ParkingService } from '../parking.service';
import * as moment from 'moment';
import { Session } from 'src/app/classes/session';

@Component({
  selector: 'sistem-parksettings',
  templateUrl: './parksettings.component.html',
  styleUrls: ['./parksettings.component.scss'],
  providers: [Globals],
})
export class ParksettingsComponent implements OnInit {
  activePath: any;
  path = PATHS;
  role: string = '';
  constructor(
    private parkingService: ParkingService,
    private router: Router,
    private route: ActivatedRoute,
    private session: Session
  ) {}

  ngOnInit() {
    this.role = this.session.get('role');

    if (this.role.toLowerCase() === 'admin') {
      //this.activePath = PATHS.PARKING_MANAGE;
      this.activePath = PATHS.PARKING_RATE;
      //this.activePath = PATHS.PARKING_SETTING_VENDORS;
    } else {
      this.activePath = PATHS.PARKING_VENDOR;
    }
  }
  openAddNewModel = (refresh) => {};
  navigateTo = (p) => {
    this.activePath = p;
  };
}
