import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { WINDOW } from 'src/app/services/window.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Globals } from '../../classes/globals';
import { ParkingService } from '../parking.service';

@Component({
  selector: 'sistem-allpasses',
  templateUrl: './allpasses.component.html',
  styleUrls: ['./allpasses.component.scss'],
  providers: [Globals],
})
export class AllpassesComponent implements OnInit {
  parking_id = '';
  heading = 'All Passes';
  domain = '';
  menuSwitchStatus: boolean = false;
  shareModelOpen = false;
  selectall = false;
  selections: Array<any> = [];
  actions = null;
  activeActions = [ACTIONS.SHARE_BUTTON];
  confirmDeleteModelOpen = false;

  addSessionModelOpen = false;
  infoOpen = false;
  sidebarFixed = false;
  editId = '';

  sessionList: any[];
  sessionListView: any[];
  loading = false;
  currency = '';
  orderBy = 'startDate';
  tags = ['', '', 'Sorted by CREATED ON'];
  reverse = true;
  headerFixed: boolean = false;

  filter = {
    page: 1,
    total: 100,
    limit: 15,
    query: '',
    from: '',
    to: '',
    dropdowns: [
      {
        name: 'vehicle.vehicleTypeId',
        title: 'Type',
        options: [],
        width: '100px',
      },
      {
        name: 'type',
        title: 'Pass Type',
        options: [
          { label: 'Monthly', value: 'Monthly' },
          { label: 'Quarterly', value: 'Quarterly' },
          { label: 'Half yearly', value: 'Half yearly' },
          { label: 'Yearly', value: 'Yearly' },
        ],
        width: '100px',
      },
    ],
    date: true,
  };

  linksBreadcrumb = [
    {
      label: 'Sistem',
    },
    {
      label: 'Parking',
      link: '/dashboard',
    },
    {
      label: 'Assi Ghat Parking 1',
      bold: true,
    },
    {
      label: 'All Entries',
      bold: true,
    },
  ];

  filterQuery = '';

  headerMap = {
    type: 'PASS TYPE',
    startDate: 'CREATED ON',
    endDate: 'EXPIRES ON',
    status: 'STATUS',
  };

  showPass = false;
  showPassId = '8241ae04-dacc-496e-800c-9cc3db734c3a';

  constructor(
    private globals: Globals,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private parkingService: ParkingService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.actions = ACTIONS;
    this.route.params.subscribe((params) => {
      this.parking_id = params.id;
      this.ngOnInit();
    });
  }

  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > 100) {
      this.headerFixed = true;
    } else {
      this.headerFixed = false;
    }
  }

  ngOnInit() {
    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((menuSwitchStatus) => {
      this.menuSwitchStatus = menuSwitchStatus;
    });
    this.linksBreadcrumb[2].label = this.parkingService.getParkingName();
    this.reverse = false;
    this.updateOrderBy('startDate');
    this.setVehicleTypes();
    this.fetchOperators();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset =
      this.window.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop ||
      0;
    if (offset > 94 && this.sidebarFixed === false) {
      this.sidebarFixed = true;
    }
    if (offset <= 94 && this.sidebarFixed === true) {
      this.sidebarFixed = false;
    }
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
          if (data && data.rows) {
            const filterdata = data.rows.filter(
              (item) => item.type === 'operator'
            );
            let dd = filterdata.map((m) => {
              return { label: m.firstName + ' ' + m.lastName, value: m.id };
            });
            this.filter.dropdowns[2] = {
              name: 'operator',
              title: 'Operator',
              options: dd,
              width: '150px',
            };
          }
        },
        (err) => {
          console.error(err);
        }
      );
  };

  handleClearAllFilter(filter: any) {
    this.reverse = false;
    this.filter = filter;
    this.updateOrderBy('startDate');
  }

  switchMenu = (status) => {
    this.menuSwitchStatus = status;
  };

  cancelAddSession = (refress, reopen) => {
    if (refress) {
      this.loadAPIData();
    }
    this.addSessionModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addSessionModelOpen = true;
      }, 10);
    }
  };

  openAddNewModel = () => {
    this.editId = '';
    this.addSessionModelOpen = true;
  };

  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
  };

  loadAPIData = () => {
    this.loading = true;
    this.parkingService
      .get(
        APIS.PARKING.PASSESS.LIST.replace('{PARKING_ID}', this.parking_id) +
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
          console.log(this.sessionList);
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

  updateOrderBy = (type: string) => {
    this.orderBy = type;
    this.tags[2] = 'Sorted by ' + this.headerMap[type];
    this.reverse = !this.reverse;
    this.applyFilter(this.filter);
  };

  isSelected = (id: any) => {
    const index = this.selections.find((a) => a === id);
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
  formatDate = (date) => {
    if (!date) {
      return '';
    }
    return moment(date).format('ddd DD MMMYY hh:mmA');
  };

  formatRemaining = (date: any) => {
    if (!date) {
      return '';
    }

    let expiredDays = moment(date).diff(moment(), 'days');
    if (+expiredDays < 0) {
      return '0';
    } else {
      return expiredDays;
    }
  };

  applyFilter = (filter) => {
    this.filterQuery = '';
    let filterList = [];
    let fc = 0;
    if (filter.query) {
      filterList.push('q=' + filter.query);
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
    }
    this.filterQuery = '?' + filterList.join('&');
    if (fc > 0) {
      this.tags[1] = fc + ' Filter applied';
    } else {
      this.tags[1] = '';
    }
    this.loadAPIData();
  };

  viewPass(id) {
    this.showPass = true;
    this.showPassId = id;
  }

  cancelViewPass() {
    this.showPass = false;
  }

  suspendPass = (id) => {
    this.showPass = false;
    const url = APIS.PARKING.PASSESS.UPDATE.replace(
      '{PARKING_ID}',
      this.parking_id
    ).replace('{PASS_ID}', id);
    this.parkingService.put(url, { status: 0 }).subscribe(
      (data: any) => {
        this.loadAPIData();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  getPaths(vehicle) {
    let vehicleName = this.parkingService.getVehicleDetail(
      vehicle.vehicleTypeId
    ).name;
    return this.parkingService.getVehiclePath(vehicleName);
  }
}
