import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { Globals } from '../../classes/globals';
import { ParkingService } from '../parking.service';
import * as moment from 'moment';
import { skip } from 'rxjs/operators';
import { Session } from 'src/app/classes/session';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'sistem-allsessions',
  templateUrl: './allsessions.component.html',
  styleUrls: ['./allsessions.component.scss'],
  providers: [Globals],
})
export class AllsessionsComponent implements OnInit {
  parking_id = '';
  heading = 'All Sessions';
  domain = '';
  menuSwitchStatus: boolean = false;

  selectall = false;
  selections: Array<any> = [];
  actions = null;
  activeActions = [ACTIONS.SHARE_BUTTON];
  confirmDeleteModelOpen = false;
  shareModelOpen = false;

  addSessionModelOpen = false;
  infoOpen = false;
  sidebarFixed = false;
  editId = '';
  filter = {
    page: 1,
    total: 100,
    limit: 25,
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
      {
        name: 'operator',
        title: 'Operator',
        options: [],
        width: '100px',
      },
      {
        name: 'status',
        title: 'Status',
        options: [
          { label: 'InVehicle', value: 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab' },
          {
            label: 'OutVehicle',
            value: 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab',
          },
          { label: 'Bookings', value: 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab' },
        ],
        width: '100px',
      },
    ],
    date: true,
  };
  filterQuery = '';
  sessionList: any[];
  sessionListView: any[];
  t: any;
  role: string;
  scheduleInTime: any[];
  scheduleOutTime: any[];
  loading = false;
  currency = '';
  orderBy = '';
  tags = ['', '', 'Sorted by IN TIME'];
  reverse = true;
  userName: string = '';
  userId: string;
  headerFixed: boolean = false;

  linksBreadcrumb = [
    {
      label: 'Sistem',
    },
    {
      label: 'Users',
      link: PATHS.PARKING_USERS,
    },
    {
      label: '',
      bold: true,
    },
    {
      label: 'All Parking',
      bold: true,
    },
  ];

  headerMap = {
    type: 'TYPE',
    inTime: 'IN TIME',
    outTime: 'OUT TIME',
    paymentMode: 'PAYMENT MODE',
    createdAt: 'CREATED AT',
  };

  constructor(
    private globals: Globals,
    private parkingService: ParkingService,
    private router: Router,
    private route: ActivatedRoute,
    private session: Session
  ) {
    this.actions = ACTIONS;
  }

  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > 100) {
      this.headerFixed = true;
    } else {
      this.headerFixed = false;
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.parking_id = params.id;
      this.userId = params.userId;
      this.linksBreadcrumb[2].label = params.name;

      if (this.userId) {
        this.getUserSessions();
      } else {
        this.reverse = false;
        this.updateOrderBy('createdAt');
      }
    });

    this.role = this.session.get('role');
    this.menuSwitchStatus = this.globals.sidebarOpen;

    this.setVehicleTypes();
    this.fetchOperators();
  }

  getUserSessions() {
    this.loading = true;
    this.parkingService
      .get(
        APIS.PARKING.USERS.GETUSERSESSION.replace('{UserId}', this.userId) +
          this.filterQuery
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.sessionList = data.rows;
          this.filter.total = data.count;
          this.filter.limit = data.limit;
          this.filter.page = data.page;
          this.tags[0] = data.count + ' items';
          this.filtersessionList();
        },
        (err) => {
          this.loading = false;
          console.error(err);
        }
      );
  }

  setVehicleTypes = () => {
    this.filter.dropdowns[0] = {
      name: 'vehicleType',
      title: 'Type',
      options: this.parkingService.getVehicleOptions(),
      width: '100px',
    };
  };

  fetchOperators = () => {
    this.parkingService
      .get(APIS.PARKING.OPERATOR.LIST.replace('{PARKING_ID}', this.parking_id))
      .subscribe(
        (data: any) => {
          data.rows = data.rows || [];
          const filterdata = data.rows.filter(
            (item) => item.type === 'operator'
          );
          let dd = filterdata.map((m) => {
            return { label: m.firstName + ' ' + m.lastName, value: m.id };
          });
          this.filter.dropdowns[1].options = dd;
        },
        (err) => {
          console.error(err);
        }
      );
  };

  loadAPIData = () => {
    this.loading = true;

    this.parkingService
      .get(
        APIS.PARKING.SESSIONS.LIST.replace('{PARKING_ID}', this.parking_id) +
          this.filterQuery +
          '&limit=25'
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.sessionList = this.setVehicleDetail(data.rows);
          this.filter.total = data.count;
          this.filter.limit = data.limit;
          this.filter.page = data.page;
          this.tags[0] = data.count + ' items';
          this.filtersessionList();
        },
        (err) => {
          this.loading = false;
          console.error(err);
        }
      );
  };

  setVehicleDetail(sessionData: any[]) {
    sessionData.map((s) => {
      let vehicleDetail = this.parkingService.getVehicleDetail(
        s.vehicle.vehicleTypeId
      );
      s.vehicle.color = vehicleDetail.color;
      s.vehicle.bgcolor = vehicleDetail.bgcolor;
    });
    return sessionData;
  }

  filtersessionList = () => {
    this.currency = this.parkingService.currency;
    this.sessionListView = this.sessionList.map((a: any): Array<any> => {
      Object.keys(a).map(
        (k) => (a[k] = typeof a[k] === 'string' ? a[k].trim() : a[k])
      );
      return a;
    });
  };

  handleClearAllFilter(filter: any) {
    this.reverse = false;
    this.filter = filter;
    this.updateOrderBy('createdAt');
  }

  updateOrderBy = (type: string) => {
    this.orderBy = type;
    this.tags[2] = 'Sorted by ' + this.headerMap[type];
    this.reverse = !this.reverse;
    this.applyFilter(this.filter);
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
      this.selections = this.sessionListView.map((a) => a.id);
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

  editSession = (id) => {
    this.editId = id;
    this.addSessionModelOpen = true;
  };

  deleteSession = (id) => {
    const i = this.sessionListView.findIndex((a) => a.id === id);
    this.sessionListView.splice(i, 1);
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
    if (action === this.actions.SHARE_BUTTON) {
      this.shareModelOpen = true;
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

  cancelShare = () => {
    this.shareModelOpen = false;
  };
  formatDateDiff(startDate, endDate) {
    const intervals = [
      { label: 'Y', seconds: 31536000 },
      { label: 'M', seconds: 2592000 },
      { label: 'D', seconds: 86400 },
      { label: 'H', seconds: 3600 },
      { label: 'MI', seconds: 60 },
      { label: 'S', seconds: 1 },
    ];

    const inTime = moment(startDate).format('ddd DD MMM YY hh:mmA');

    var secondsDiff = moment(endDate).diff(moment(startDate), 'seconds');

    const interval = intervals.find((i) => i.seconds <= secondsDiff);
    if (interval) {
      const count = Math.floor(secondsDiff / interval.seconds);
      return `${inTime} (${count}${interval.label})`;
    }
    return '-';
  }

  formatDate = (date) => {
    if (!date) {
      return '-';
    }
    return moment(date).format('ddd DD MMM YY hh:mmA');
  };

  applyFilter = (filter) => {
    this.filterQuery = '';
    let filterList = [];
    let fc = 0;
    if (filter.query) {
      filterList.push('vehicle=' + filter.query);
      fc++;
    }
    if (filter.type) {
      filterList.push('type=' + filter.type);
      fc++;
    }
    if (filter.from) {
      filterList.push('from=' + filter.from);
      fc++;
    }
    if (filter.to) {
      filterList.push('to=' + filter.to);
    }
    if (filter.page) {
      filterList.push('page=' + filter.page);
    }
    for (let dd of filter.dropdowns) {
      if (dd.value) {
        filterList.push(dd.name + '=' + dd.value);
        fc++;
      }
    }
    if (this.orderBy) {
      filterList.push(
        'orderBy=' + this.orderBy + ':' + (this.reverse ? 'DESC' : 'ASC')
      );
    } else {
      filterList.push('orderBy=createdAt:DESC');
    }
    this.filterQuery = '?' + filterList.join('&');
    if (fc > 0) {
      this.tags[1] = fc + ' Filter applied';
    } else {
      this.tags[1] = '';
    }
    this.loadAPIData();
  };

  getTotalTime = (inTime, outTime) => {
    if (!inTime || !outTime) {
      return '';
    }
    const total = moment(outTime).diff(moment(inTime), 'minutes');
    var hours = Math.floor(total / 60);
    var minutes = total % 60;
    if (hours > 0) {
      return hours + ' hr ' + minutes + ' min';
    }
    return minutes + ' min';
  };

  calculateTotalAmount(session: any) {
    let advance =
      session.transactions?.[0]?.status == 'success'
        ? session.transactions?.[0].amount
        : 0;

    let collection = session.total ? session.total : 0;

    let refund =
      session.transactions?.[1]?.status == 'success'
        ? session.transactions?.[1].amount
        : 0;

    return +advance + +collection - +refund;
  }

  getPaths(vehicle) {
    let vehicleName = this.parkingService.getVehicleDetail(
      vehicle.vehicleTypeId
    ).name;
    return this.parkingService.getVehiclePath(vehicleName);
  }
}
