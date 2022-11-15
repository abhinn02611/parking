import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { ParkingService } from '../../parking.service';
import * as moment from 'moment';

@Component({
  selector: 'app-parksettings-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss'],
})
export class RatesComponent implements OnInit {
  parking_id = '';
  heading = 'All Sessions';
  domain = '';
  menuSwitchStatus: boolean = false;

  selectall = false;
  selections: Array<any> = [];
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
      .get(APIS.PARKING.RATES.SLOTS.replace('{PARKING_ID}', this.parking_id))
      .subscribe(
        (data: any) => {
          console.log(data)
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

  updateOrderBy = (type: string) => {
    this.orderBy = type;
    this.tags[1] = 'Sorted by ' + this.headerMap[type];
    this.reverse = !this.reverse;
  };

  isSelected = (id: any) => {
    const index = this.selections.findIndex((a) => a === id);
    return index > -1;
  };

  selectItem = (e: any, item: any) => {
    e.stopPropagation();
    e.preventDefault();
    const index = this.selections.findIndex((a) => a === item.id);
    if (index > -1) {
      this.selections.splice(index, 1);
    } else {
      this.selections.push(item.id);
    }
    this.updateBulkAction();
  };

  selectallItem = () => {
    if (this.selectall) {
      this.selections = [];
    } else {
      this.selections = this.ratesListView.map((a) => a.id);
    }
    this.selectall = !this.selectall;
    this.updateBulkAction();
  };

  updateBulkAction = () => {
    if (this.selections.length > 0) {
      const index = this.activeActions.indexOf(this.actions.DELETE);
      if (index < 0) {
        this.activeActions.push(this.actions.DELETE);
      }
    } else {
      const index = this.activeActions.indexOf(this.actions.DELETE);
      if (index > -1) {
        this.activeActions.splice(index, 1);
      }
    }
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

  openSessionDetails = (id) => {
    this.router.navigate([PATHS.MODULE_PARKING + PATHS.PARKING_SESSIONS + id]);
  };

  onAction = (action) => {
    if (action === this.actions.DELETE) {
      this.confirmDeleteModelOpen = true;
    }
  };

  confirmDelete = () => {
    this.loadAPIData();
    this.selections = [];
    this.updateBulkAction();
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

  writeDescription = (start, end) => {
    if (start === 0) {
      return 'Upto ' + end + ' hours';
    } else {
      return start + ' to ' + end + ' hours';
    }
  };

  deletePriceHour = (id) => {
    const url = APIS.PARKING.RATES.DELETE_HOUR.replace(
      '{PARKING_ID}',
      this.parking_id
    ).replace('{HOUR_ID}', id);
    this.parkingService.delete(url).subscribe(
      (data: any) => {
        this.loadAPIData();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  suspendPriceHour = (status, id) => {
    const url = APIS.PARKING.RATES.UPDATE_HOUR.replace(
      '{PARKING_ID}',
      this.parking_id
    ).replace('{HOUR_ID}', id);
    this.parkingService.put(url, { status: status }).subscribe(
      (data: any) => {
        this.loadAPIData();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  getMenuConfig = (data, group) => {
    let conf = [
      {
        label: 'Edit',
        icon: 'editldpi.svg',
        action: this.editSession.bind(this, data['id'], group),
      },
      {
        label: 'Delete',
        icon: 'deleteldpi.svg',
        action: this.deletePriceHour.bind(this, data['id']),
        confirm: true,
        confirmParam: {
          title: 'Delete Price Hour',
          content: 'Are you sure to delete this price hour?',
          note: 'You can not undo the change.',
          label: 'Delete Price Hour',
        },
      },
      {
        label: 'Suspend',
        icon: 'leadsldpi.svg',
        action: this.suspendPriceHour.bind(this, false, data['id']),
        confirm: true,
        confirmParam: {
          title: 'Suspend Price Hour',
          content: 'Are you sure to suspend this price hour?',
          note: 'You can not undo the change.',
          label: 'Suspend Price Hour',
        },
      },
      //   {
      //   label: 'Default Rate',
      //   icon: 'editldpi.svg',
      //   action: this.editSession.bind(this, false, data['id'])
      // }
    ];
    if (data.status == false) {
      conf[2] = {
        label: 'Activate',
        icon: 'leadsldpi.svg',
        action: this.suspendPriceHour.bind(this, true, data['id']),
        confirm: true,
        confirmParam: {
          title: 'Activate Price Hour',
          content: 'Are you sure to activate this price hour?',
          note: 'You can not undo the change.',
          label: 'Activate Price Hour',
        },
      };
    }
    return conf;
  };

  deleteRate(id: string) {
    console.log(id);
    this.deletePriceHour(id);
  }

  getPaths(vehicleType: string) {
    return this.parkingService.getVehiclePath(vehicleType);
  }
}
