import { Component, OnInit, Renderer2 } from '@angular/core';
import { Session } from 'src/app/classes/session';
import * as moment from 'moment';

@Component({
  selector: 'app-parksettings-parking-rate',
  templateUrl: './parking-rate.component.html',
  styleUrls: ['./parking-rate.component.scss'],
})
export class ParkingRateComponent implements OnInit {
  addNewModelOpen = false;
  infoOpen = true;
  loading = false;
  sidebarFixed = false;
  confirmDeleteModelOpen = false;
  math = Math;
  user: any;
  fromDate: string;

  constructor(private renderer: Renderer2, private session: Session) {
    this.renderer.addClass(document.body, 'body-grey');
  }

  ngOnInit(): void {
    this.user = JSON.parse(this.session.get('user'));
    this.fromDate = moment(this.user.createdAt).format('Do MMMM YYYY');
  }

  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
  };

  openAddNewModel = () => {
    this.addNewModelOpen = true;
  };
}
