import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { ParkingService } from '../../parking.service';
import * as moment from 'moment';
import { Session } from 'src/app/classes/session';

@Component({
  selector: 'app-parksettings-manageParking',
  templateUrl: './manageParking.component.html',
  styleUrls: ['./manageParking.component.scss'],
})
export class ManageParkingComponent implements OnInit {
  parking_id = '';
  heading = 'All Sessions';
  menuSwitchStatus: boolean = false;
  actions = null;
  activeActions = [];
  confirmDeleteModelOpen = false;

  addOperatorModelOpen = false;

  editId = '';
  operator = null;
  role: string;
  parkingList: any[];
  loading = false;
  orderBy = '';
  tags = ['', ''];
  reverse = true;
  headerMap = {
    firstName: 'FIRST NAME',
    lastName: 'LAST NAME',
    phone: 'PHONE',
    email: 'EMAIL',
    gender: 'GENDER',
    status: 'STATUS',
    type: 'ROLE',
  };

  path = PATHS;
  active = PATHS.SETTINGS + 'undefined';
  parkingName = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parkingService: ParkingService,
    private session: Session
  ) {
    const parts = this.router.url.split('/');
    this.active = parts[1] + '/' + parts[2];
    this.route.params.subscribe((params) => {
      this.parking_id = params.id;
    });
    this.role = this.session.get('role');
  }

  ngOnInit() {
    this.getParkings();
    this.parkingName = this.parkingService.getParkingName();
  }

  cancelParking = (refresh) => {
    if (refresh) {
      // this.getParkings();
    }
    this.addOperatorModelOpen = false;
  };
  onSubmitParking() {
    this.getParkings();
    this.addOperatorModelOpen = false;
  }
  openAddNewModel = () => {
    this.editId = '';
    this.operator = null;
    this.addOperatorModelOpen = true;
  };

  updateOrderBy = (type: string) => {
    this.orderBy = type;
    this.tags[1] = 'Sorted by ' + this.headerMap[type];
    this.reverse = !this.reverse;
  };
  getParkings() {
    this.loading = true;
    this.parkingService.get(APIS.PARKING.ADDPARKING.PARKING).subscribe(
      (data: any) => {
        console.log(data);
        if (data.length > 0) {
          this.tags[0] = data.length + ' items';
        }
        this.parkingList = data;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  editUser = (operator: any) => {
    this.editId = operator.id;
    this.operator = operator;
    this.addOperatorModelOpen = true;
  };

  deleteSession = (id) => {
    const i = this.parkingList.findIndex((a) => a.id === id);
    this.parkingList.splice(i, 1);
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
    // this.getParkings();
    this.confirmDeleteModelOpen = false;
  };

  cancelDelete = () => {
    this.confirmDeleteModelOpen = false;
  };

  formatDate = (date) => {
    if (!date) {
      return '';
    }
    return moment(date).format('ddd DD MMM YY');
  };

  writeDescription = (start, end) => {
    if (start === 0) {
      return 'Upto ' + end + ' hours';
    } else {
      return start + ' to ' + end + ' hours';
    }
  };

  suspendParking = (data) => {
    var status = data.status === true ? 'suspend' : 'activate';
    var obj = {
      parkingId: data.id,
      status: status,
    };
    this.parkingService
      .postJson(APIS.PARKING.ADDPARKING.SUSPENDPARKING, obj)
      .subscribe(
        (res: any) => {
          this.getParkings();
        },
        (err) => {}
      );
  };

  deleteParking = (id) => {
    this.parkingService
      .deleteJson(
        APIS.PARKING.ADDPARKING.DELETEPARKING.replace('{PARKING_ID}', id),
        {}
      )
      .subscribe(
        (res: any) => {
          this.getParkings();
        },
        (err) => {}
      );
  };

  getMenuConfig = (data) => {
    let conf = [
      {
        label: 'Edit',
        icon: 'editldpi.svg',
        action: this.editUser.bind(this, data),
      },
      {
        label: 'Suspend',
        icon: 'leadsldpi.svg',
        action: this.suspendParking.bind(this, data),
        confirm: true,
        confirmParam: {
          title: 'Suspend',
          content: 'Are you sure to suspend ' + data.name + '?',
          note: 'You can not undo the change.',
          label: 'Suspend ' + data.name,
        },
      },
      {
        label: 'Delete',
        icon: 'deleteldpi.svg',
        action: this.deleteParking.bind(this, data['id']),
        confirm: true,
        confirmParam: {
          title: 'Delete',
          content: 'Are you sure to delete ' + data.name + '?',
          note: 'You can not undo the change.',
          label: 'Delete ' + data.name,
        },
      },
    ];
    if (data.status == false) {
      conf[1] = {
        label: 'Activate',
        icon: 'leadsldpi.svg',
        action: this.suspendParking.bind(this, data),
        confirm: true,
        confirmParam: {
          title: 'Activate',
          content: 'Are you sure to activate ' + data.name + '?',
          note: 'You can not undo the change.',
          label: 'Activate ' + data.name,
        },
      };
    }
    return conf;
  };
}
