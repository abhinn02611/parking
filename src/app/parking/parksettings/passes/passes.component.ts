import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { ParkingService } from '../../parking.service';
import * as moment from 'moment';

@Component({
  selector: 'app-parksettings-passes',
  templateUrl: './passes.component.html',
  styleUrls: ['./passes.component.scss'],
})
export class PassesComponent implements OnInit {
  parking_id = '';
  heading = 'All Sessions';
  domain = '';
  menuSwitchStatus: boolean = false;

  actions = null;
  activeActions = [];
  confirmDeleteModelOpen = false;

  addRateModelOpen = false;

  editId = '';
  editGroup = {};
  singleEdit = false;

  ratesList: any[];
  ratesListView: any[];
  loading = false;
  orderBy = '';
  tags = ['', ''];
  reverse = true;
  headerMap = {
    remarks: 'DESCRIPTION',
    vehicleTypeId: 'VEHICLE TYPE',
    priceHours: 'AMOUNT',
    startDate: 'BEGIN DATE',
    endDate: 'END DATE',
    status: 'STATUS',
    default: 'DEFAULT',
  };

  path = PATHS;
  active = PATHS.SETTINGS + 'undefined';
  priceGroup = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parkingService: ParkingService
  ) {
    const parts = this.router.url.split('/');
    this.active = parts[1] + '/' + parts[2];
    this.route.params.subscribe((params) => {
      this.parking_id = params.id;
    });
  }

  ngOnInit() {
    this.loadAPIData();
  }

  cancelAddRate = (refresh) => {
    if (refresh) {
      this.loadAPIData();
    }
    this.addRateModelOpen = false;
  };

  openAddNewModel = (group: any) => {
    this.editId = '';
    this.editGroup = group;
    this.singleEdit = false;
    this.addRateModelOpen = true;
  };

  loadAPIData = () => {
    this.loading = true;
    this.parkingService
      .get(
        APIS.PARKING.PASS_PRICE.SLOTS.replace('{PARKING_ID}', this.parking_id)
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.priceGroup = Object.values(data);
          this.priceGroup.forEach((price) => {
            let vehicle = this.parkingService.getVehicleDetail(
              price.vehicle.vehicleTypeId
            );
            price.vehicle = vehicle;
          });
        },
        (err) => {
          this.loading = false;
          console.error(err);
        }
      );
  };

  editSession = (id, group) => {
    this.editId = id;
    this.singleEdit = true;
    this.addRateModelOpen = true;
    this.editGroup = group;
  };

  deleteSession = (id) => {
    const i = this.ratesListView.findIndex((a) => a.id === id);
    this.ratesListView.splice(i, 1);
  };

  isArray(val): boolean {
    return Array.isArray(val);
  }

  onAction = (action) => {
    if (action === this.actions.DELETE) {
      this.confirmDeleteModelOpen = true;
    }
  };

  confirmDelete = () => {
    this.loadAPIData();
    this.confirmDeleteModelOpen = false;
  };

  cancelDelete = () => {
    this.confirmDeleteModelOpen = false;
  };

  formatDate = (date) => {
    if (!date) {
      return '';
    }
    return moment(date).format('ddd DD MMMYY');
  };

  suspendPriceHour = (status, id) => {
    const url = APIS.PARKING.PASS_PRICE.UPDATE_RATE_NEW.replace(
      '{PARKING_ID}',
      this.parking_id
    );
    this.parkingService
      .put(url, { rates: [{ id: id, status: status }] })
      .subscribe(
        (data: any) => {
          this.loadAPIData();
        },
        (err) => {
          console.error(err);
        }
      );
  };

  getMenuConfig = (data, type, group) => {
    let conf = [
      {
        label: 'Edit',
        icon: 'editldpi.svg',
        action: this.editSession.bind(this, data['id'], group),
      },
      {
        label: 'Suspend',
        icon: 'leadsldpi.svg',
        action: this.suspendPriceHour.bind(this, false, data['id']),
        confirm: true,
        confirmParam: {
          title: 'Suspend Price',
          content: 'Are you sure to suspend this ' + type.type + ' pass price?',
          note: 'You can not undo the change.',
          label: 'Suspend ' + type.type + ' Pass Price',
        },
      },
    ];
    if (data.status == false) {
      conf[1] = {
        label: 'Activate',
        icon: 'leadsldpi.svg',
        action: this.suspendPriceHour.bind(this, true, data['id']),
        confirm: true,
        confirmParam: {
          title: 'Activate Price',
          content:
            'Are you sure to activate this ' + type.type + ' pass price?',
          note: 'You can not undo the change.',
          label: 'Activate ' + type.type + ' Pass Price',
        },
      };
    }
    return conf;
  };

  getPaths(vehicleType: string) {
    return this.parkingService.getVehiclePath(vehicleType);
  }
}
