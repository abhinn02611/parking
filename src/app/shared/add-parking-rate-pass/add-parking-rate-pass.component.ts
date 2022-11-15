import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS } from 'src/app/classes/appSettings';
import { ParkingService } from 'src/app/parking/parking.service';

@Component({
  selector: 'app-add-parking-rate-pass',
  templateUrl: './add-parking-rate-pass.component.html',
  styleUrls: ['./add-parking-rate-pass.component.scss'],
})
export class AddParkingRatePassComponent implements OnInit {
  @Input() editId = '';
  @Input() parking_id = '';
  @Input() group: any = {};
  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  prices = [{ type: '', price: '' }];
  remarks = '';
  vehicleTypes = [];
  formData = {
    status: 'active',
    statusName: 'Active',
  };
  types = [];
  showAddVehicleType = false;
  showAddType = false;
  rates = [];
  ratesFinal = [];

  constructor(private parkingService: ParkingService) {}

  isArray(val): boolean {
    return Array.isArray(val);
  }

  ngOnInit(): void {
    if (this.editId !== '') {
      const index = this.group.price.findIndex(
        (r) => r.rate.id === this.editId
      );
      if (index != -1) {
        const rate = this.group.price[index].rate;
        const type = this.group.price[index].type;
        const total = (
          parseFloat(rate.rate) +
          (parseFloat(rate.rate) * parseFloat(rate.tax)) / 100
        ).toFixed(2);

        const v = {
          type: type.type,
          rate: rate.rate,
          tax: rate.tax,
          amount: rate.amount,
          status: rate.status,
          id: rate.id,
        };
        this.ratesFinal[0] = v;
        this.rates.push(v);
      }
    } else {
      this.group.price.map((r: any, index: number) => {
        const rate = r.rate;
        const type = r.type;
        const v = {
          type: type.type,
          rate: rate.rate,
          tax: rate.tax,
          amount: rate.amount,
          status: rate.status,
          id: rate.id,
        };
        this.ratesFinal[index] = v;
        this.rates.push(v);
      });
    }

    if (this.editId !== '') {
    }
  }
  onCancel = () => {
    this.actionCancel.emit();
  };
  onPrimary = () => {
    this.saveRate(1);
  };

  saveRate = (nextAction) => {
    const priceHours = [];
    for (const rate of this.ratesFinal) {
      if (rate.rate && rate.amount) {
        priceHours.push({
          rate: Math.round(rate.rate),
          tax: rate.tax,
          amount: Math.round(rate.amount),
          id: rate.id,
        });
      }
    }
    const rateData: any = {
      rates: priceHours,
    };
    this.parkingService
      .put(
        APIS.PARKING.PASS_PRICE.UPDATE_RATE_NEW.replace(
          '{PARKING_ID}',
          this.parking_id
        ),
        rateData
      )
      .subscribe(
        (res: any) => {
          this.actionPrimary.emit(res.id);
        },
        (err) => {}
      );
  };

  addMorePrice = () => {
    this.prices.push({ type: '', price: '' });
  };

  removePrice = (index) => {
    this.prices.splice(index, 1);
  };

  actionStatusSelect = (vt) => {
    this.formData.status = vt.value;
    this.formData.statusName = vt.label;
  };

  actionChangePriceType = (type, i) => {
    this.prices[i].type = type.value;
  };

  openUpdateVehicleTypeModal = () => {
    this.showAddVehicleType = true;
  };

  cancelAddVehicleType = () => {
    this.showAddVehicleType = false;
  };

  openUpdateTypeModal = () => {
    this.showAddType = true;
  };

  print = (v) => {
    return JSON.stringify(v);
  };

  deleteRate = (i) => {
    this.ratesFinal.splice(i, 1);
    this.rates.splice(i, 1);
  };

  updateRate = (i, rate) => {
    this.ratesFinal[i] = rate;
  };

  createFormModalTitle() {
    if (this.editId) {
      return 'Edit ' + this.group.vehicle.name + ' Parking Rate';
    }
    return 'Add ' + this.group.vehicle.name + ' Parking Rate';
  }
}
