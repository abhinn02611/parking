import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { APIS } from 'src/app/classes/appSettings';
import { ParkingService } from 'src/app/parking/parking.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {
  @Input()
  user: any;

  @Output()
  actionCancel = new EventEmitter();

  @Output()
  actionPrimary = new EventEmitter();

  @Output()
  actionSecondary = new EventEmitter();

  confirmSuspendModelOpen = false;
  formatDate: string = '';
  loading: boolean = false;
  parkingTransaction: any[] = [];

  constructor(private parkingService: ParkingService) {}

  ngOnInit(): void {
    this.user.vehicles.map((vehicle) => {
      let vehicleDetail = this.parkingService.getVehicleDetail(
        vehicle.vehicleTypeId
      );
      vehicle.bgcolor = vehicleDetail.bgcolor;
      vehicle.color = vehicleDetail.color;
      vehicle.name = vehicleDetail.name;
    });
    this.formatDate = moment(this.user.createdAt).format('ddd DD MMMYY');
    if (this.user) {
      this.getUserVehicle();
    }
  }

  getUserVehicle() {
    this.loading = true;
    this.parkingService
      .get(APIS.PARKING.USERS.GETUSERDETAILS.replace('{UserId}', this.user.id))
      .subscribe(
        (data: any) => {
          console.log('userr', data);
          this.parkingTransaction = data.parkingTransaction || [];
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          console.error(err);
        }
      );
  }

  setDate(date) {
    if (!date) {
      return '--';
    }
    return moment(date).format('ddd DD MMMYY');
  }

  onPrimary = () => {
    this.actionPrimary.emit();
  };

  cancelSuspend() {
    this.confirmSuspendModelOpen = false;
  }

  onCancel() {
    this.actionCancel.emit();
  }

  getPaths(vehicleName: string) {
    return this.parkingService.getVehiclePath(vehicleName);
  }
}
