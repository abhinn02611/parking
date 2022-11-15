import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { APIS } from 'src/app/classes/appSettings';
import { ParkingService } from 'src/app/parking/parking.service';

@Component({
  selector: 'app-view-pass',
  templateUrl: './view-pass.component.html',
  styleUrls: ['./view-pass.component.scss'],
})
export class ViewPassComponent implements OnInit {
  @Input() pass_id = '';
  @Input() parking_id = '';
  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  pass = null;
  session = null;
  confirmSuspendModelOpen = false;

  constructor(private parkingService: ParkingService) {}

  isArray(val): boolean {
    return Array.isArray(val);
  }

  ngOnInit(): void {
    this.fetchPass();
  }

  fetchPass = () => {
    const url = APIS.PARKING.PASSESS.GET.replace(
      '{PARKING_ID}',
      this.parking_id
    ).replace('{PASS_ID}', this.pass_id);
    this.parkingService.get(url).subscribe(
      (data: any) => {
        console.log('pass', data);
        this.session = data;
        this.setVehicleData(data.vehicle);
      },
      (err) => {
        console.error(err);
      }
    );
  };

  setVehicleData(vehicle: any) {
    let vehicleDetails = this.parkingService.getVehicleDetail(
      vehicle.vehicleTypeId
    );
    vehicle.bgcolor = vehicleDetails.bgcolor;
    vehicle.color = vehicleDetails.color;
    vehicle.vehicleType = vehicleDetails.name;
  }

  onCancel = () => {
    this.actionCancel.emit();
  };
  onPrimary = () => {
    this.confirmSuspendModelOpen = true;
  };

  cancelSuspend() {
    this.confirmSuspendModelOpen = false;
  }
  confirmSuspend() {
    this.actionPrimary.emit(this.pass_id);
  }

  formatDate = (date) => {
    if (!date) {
      return '--';
    }
    return moment(date).format('ddd DD MMM YY hh:mmA');
  };

  getTotalTime(startDate, endDate) {
    const intervals = [
      { label: 'Y', seconds: 31536000 },
      { label: 'M', seconds: 2592000 },
      { label: 'D', seconds: 86400 },
      { label: 'H', seconds: 3600 },
      { label: 'MI', seconds: 60 },
      { label: 'S', seconds: 1 },
    ];

    var secondsDiff = moment(endDate).diff(moment(startDate), 'seconds');

    const interval = intervals.find((i) => i.seconds < secondsDiff);
    if (interval) {
      const count = Math.floor(secondsDiff / interval.seconds);
      return ` (${count}${interval.label})`;
    }
    return '-';
  }

  print = (v) => {
    return JSON.stringify(v);
  };

  formatRemaining = (date) => {
    if (!date) {
      return '';
    }
    const today = moment();
    const expiry = moment(date);
    let x = expiry.diff(today, 'days');
    if (x >= 0) {
      return x + ' days remaining';
    }
    return '0';
  };

  getPaths(vehicleName: any) {
    return this.parkingService.getVehiclePath(vehicleName);
  }
}
