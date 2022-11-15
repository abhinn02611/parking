import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { ParkingService } from '../../parking.service';

@Component({
  selector: 'app-park-vendors',
  templateUrl: './park-vendors.component.html',
  styleUrls: ['./park-vendors.component.scss'],
})
export class ParkVendorsComponent implements OnInit {
  parking_id = '';
  heading = '';
  domain = '';
  menuSwitchStatus: boolean = false;
  actions = null;
  activeActions = [];
  confirmDeleteModelOpen = false;
  addRateModelOpen = false;
  parkingList: any;
  editId = '';
  editGroup = {};
  editVendorDetails: {};
  singleEdit = false;
  isShowVendor = false;
  ratesList: any[];
  ratesListView: any[];
  loading = false;
  orderBy = '';
  tags = ['', ''];
  reverse = true;
  vendorList: any[];
  selections: any;
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
      // this.ngOnInit();
    });
  }

  ngOnInit() {
    this.getAllVendors();
  }
  onCreateVendor() {
    this.editVendorDetails = null;
    this.editId = null;
    this.isShowVendor = true;
  }
  closeVendor() {
    this.isShowVendor = false;
    // this.getAllVendors();
  }

  getAllVendors() {
    this.loading = true;
    this.parkingService
      .get(APIS.PARKING.USERS.ALLUSERS.replace('{UserType}', 'vendor'))
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.vendorList = data.rows;
          this.vendorList.forEach((item) => {
            item.parkings.forEach((park) => {
              park.label = park.name;
            });
          });
        },
        (err) => {
          this.loading = false;
          console.error(err);
        },
        () => {
          this.loading = false;
        }
      );
  }
  selectItem = (e: any, item: any) => {
    e.stopPropagation();
    e.preventDefault();
    const index = this.selections.findIndex((a) => a === item.id);
    if (index > -1) {
      this.selections.splice(index, 1);
    } else {
      this.selections.push(item.id);
    }
  };
  formatDate = (date) => {
    if (!date) {
      return '';
    }
    return moment(date).format('ddd DD MMM YY');
  };
  getMenuConfig = (data) => {
    let conf = [
      {
        label: 'Edit',
        icon: 'editldpi.svg',
        action: this.editVendor.bind(this, data),
      },
      {
        label: 'Suspend',
        icon: 'leadsldpi.svg',
        action: this.suspendVendor.bind(this, data),
        confirm: true,
        confirmParam: {
          title: 'Suspend',
          content:
            'Are you sure to suspend ' + data.firstName
              ? data.firstName
              : '' + ' ' + data.lastname
              ? data.lastname
              : '' + '?',
          note: 'You can not undo the change.',
          label: 'Suspend ' + data.firstName + ' ' + data.lastName,
        },
      },
      {
        label: 'Delete',
        icon: 'deleteldpi.svg',
        action: this.deleteUser.bind(this, data['id']),
        confirm: true,
        confirmParam: {
          title: 'Delete',
          content:
            'Are you sure to delete ' +
            data.firstName +
            ' ' +
            data.lastname +
            '?',
          note: 'You can not undo the change.',
          label: 'Delete ' + data.firstName + ' ' + data.lastName,
        },
      },
    ];
    if (data.status == false) {
      conf[1] = {
        label: 'Activate',
        icon: 'leadsldpi.svg',
        action: this.suspendVendor.bind(this, data),
        confirm: true,
        confirmParam: {
          title: 'Activate',
          content:
            'Are you sure to activate ' +
            data.firstName +
            ' ' +
            data.lastname +
            '?',
          note: 'You can not undo the change.',
          label: 'Activate ' + data.firstName + ' ' + data.lastName,
        },
      };
    }
    return conf;
  };

  isSelected = (id: any) => {
    const index = this.selections.find((a) => a === id);
    return index > -1;
  };
  suspendVendor = (data) => {
    var status = data.status === true ? 'suspend' : 'activate';
    var obj = {
      userId: data.id,
      status: status,
    };
    this.parkingService
      .postJson(APIS.PARKING.VENDORS.SUSPENDVENDOR, obj)
      .subscribe(
        (res: any) => {
          this.getAllVendors();
        },
        (err) => {}
      );
  };
  editVendor = (vendor: any) => {
    this.editId = vendor.id;
    this.isShowVendor = true;
    this.editVendorDetails = vendor;
  };
  deleteUser = (id) => {
    this.parkingService
      .deleteJson(
        APIS.PARKING.OPERATOR.DELETE.replace('{PARKING_ID}', this.parking_id),
        { id }
      )
      .subscribe(
        (res: any) => {
          this.getAllVendors();
        },
        (err) => {}
      );
  };
}
