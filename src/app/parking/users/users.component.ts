import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { Globals } from '../../classes/globals';
import { ParkingService } from '../parking.service';
import * as moment from 'moment';
import { Session } from 'src/app/classes/session';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'sistem-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [Globals],
})
export class UsersComponent implements OnInit {
  parking_id = '';
  heading = 'All Users';
  domain = '';

  selectall = false;
  selections: Array<any> = [];
  actions = null;
  activeActions = [];
  confirmDeleteModelOpen = false;
  shareModelOpen = false;

  addSessionModelOpen = false;
  infoOpen = false;
  sidebarFixed = false;
  editId = '';
  filter = {
    page: 1,
    total: 100,
    limit: 15,
    query: '',
    from: '',
    to: '',
    dropdowns: [
      {
        name: 'vehicleType',
        title: 'Type',
        options: [],
        width: '100px',
      },
    ],
    date: false,
  };
  userType = 'user';
  filterQuery = '';
  usersList: any[];
  usersListView: any[];
  selectedUser: any;
  loading = false;
  currency = '';
  orderBy = 'inTime';
  tags = ['', '', 'Sorted by SINCE'];
  reverse = true;
  showUser = false;
  filterDropdown: any[] = [];

  constructor(
    private globals: Globals,
    private parkingService: ParkingService,
    private router: Router,
    private route: ActivatedRoute,
    private session: Session,
    private sharedService: SharedService
  ) {
    this.actions = ACTIONS;
    // this.route.params.subscribe(params => {
    //   this.parking_id = params.id;
    //   this.ngOnInit();
    // });
  }

  ngOnInit() {
    var getParking = JSON.parse(this.session.get('parking'));
    this.parking_id = getParking.id;
    this.getAllUsers();
    this.getVehicleTypes();
  }

  getVehicleTypes() {
    this.loading = true;
    this.parkingService
      .get(APIS.PARKING.VEHICLE_TYPES.LIST + this.filterQuery)
      .subscribe(
        (data: any) => {
          this.loading = false;
          data.forEach((item) => {
            this.filter.dropdowns[0].options.push({
              label: item.slug,
              value: item.id,
            });
          });
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  getAllUsers = () => {
    this.loading = true;

    this.parkingService
      .get(
        APIS.PARKING.USERS.ALLUSERS.replace('{UserType}', this.userType) +
          this.filterQuery
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.usersList = data.rows;
          this.usersList.forEach((item) => {
            item.vehicles.forEach((vehicle) => {
              vehicle.label = vehicle.regNumber;
            });
          });
          this.filter.total = data.count;
          this.filter.limit = data.limit;
          this.filter.page = data.page;
          this.tags[0] = data.count + ' items';
          this.filterusersList();
        },
        (err) => {
          this.loading = false;
          console.error(err);
        },
        () => {}
      );
  };
  totalTime() {}

  userNameFormat(user) {
    if (
      user.firstName === 'null' ||
      user.lastName === 'null' ||
      (user.firstName === null && user.lastName === null)
    ) {
      return '--';
    }
    return user.firstName + ' ' + user.lastName;
  }
  filterusersList = () => {
    this.currency = this.parkingService.currency;
    this.usersListView = this.usersList.map((a: any): Array<any> => {
      Object.keys(a).map(
        (k) => (a[k] = typeof a[k] === 'string' ? a[k].trim() : a[k])
      );
      return a;
    });
  };

  isSelected = (id: any) => {
    const index = this.selections.findIndex((a) => a === id);
    return index > -1;
  };

  viewUser(user) {
    this.selectedUser = user;
    this.showUser = true;
  }
  onAction = (action) => {
    if (action === this.actions.DELETE) {
      this.confirmDeleteModelOpen = true;
    }
    if (action === this.actions.SHARE_BUTTON) {
      this.shareModelOpen = true;
    }
  };

  cancelUser = () => {
    this.showUser = false;
  };

  formatDate = (date) => {
    if (!date) {
      return '--';
    }
    return moment(date).format('ddd DD MMM YY hh:mmA');
  };
  onAllSession() {
    this.showUser = false;
    console.log(this.selectedUser);
    var userFullName =
      this.selectedUser.firstName + ' ' + this.selectedUser.lastName;
    // this.sharedService.userSession.next(this.selectedUser);
    this.router.navigate(['/parking/users/sessions'], {
      queryParams: { userId: this.selectedUser.id, name: userFullName },
      replaceUrl: false,
    });
  }
  applyFilter = (filter) => {
    this.filterQuery = '';
    let filterList = [];
    let fc = 0;
    if (filter.query) {
      filterList.push('search=' + filter.query);
      fc++;
    }
    if (filter.type) {
      filterList.push('vehicleType=' + filter.type);
      fc++;
    }
    if (filter.page) {
      filterList.push('page=' + filter.page);
    }
    for (let dd of filter.dropdowns) {
      if (dd.name == 'vehicleType' && dd.label) {
        filterList.push('vehicleType=' + dd.value);
        // this.userType = dd.label
      }
    }
    if (this.orderBy) {
      filterList.push(
        'orderBy=' + this.orderBy + ':' + (this.reverse ? 'DESC' : 'ASC')
      );
    }
    if (filterList.length) {
      this.filterQuery = '&' + filterList.join('&');
    }
    if (fc > 0) {
      this.tags[1] = fc + ' Filter applied';
    } else {
      this.tags[1] = '';
    }
    this.getAllUsers();
  };
}
