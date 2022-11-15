import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { ParkingService } from '../../parking.service';
import * as moment from 'moment';
import { Session } from 'src/app/classes/session';

@Component({
  selector: 'app-parksettings-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  parking_id = '';
  heading = 'All Sessions';
  menuSwitchStatus: boolean = false;
  actions = null;
  activeActions = [];
  confirmDeleteModelOpen = false;

  addOperatorModelOpen = false;

  editId = '';
  operator = null;

  userList: any[];
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
  userRole: string = '';
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
  }

  ngOnInit() {
    var user = JSON.parse(this.session.get('user'));
    this.userRole = user.type;
    this.parkingTeams();
    this.parkingName = this.parkingService.getParkingName();
  }

  cancelAddOperator = (refresh) => {
    if (refresh) {
      this.loadAPIData();
    }
    this.addOperatorModelOpen = false;
  };

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

  parkingTeams = () => {
    this.loading = true;

    this.parkingService
      .get(APIS.PARKING.OPERATOR.TEAMS.replace('{PARKING_ID}', this.parking_id))
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.userList = data;
          console.log(data);
          // this.userList = [...this.userList,...this.userList,...this.userList,...this.userList]
          this.tags[0] = this.userList.length + ' items';
        },
        (err) => {
          this.loading = false;
          console.error(err);
        }
      );
  };

  loadAPIData = () => {
    this.loading = true;

    this.parkingService
      .get(
        APIS.PARKING.OPERATOR.TEAMS.replace(
          '{PARKING_ID}',
          this.parking_id
        ).replace('{role}', this.userRole)
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.userList = data;
          // this.userList = [...this.userList,...this.userList,...this.userList,...this.userList]
          this.tags[0] = this.userList.length + ' items';
        },
        (err) => {
          this.loading = false;
          console.error(err);
        }
      );
  };

  editUser = (operator: any) => {
    this.editId = operator.id;
    this.operator = operator;
    this.addOperatorModelOpen = true;
  };

  deleteSession = (id) => {
    const i = this.userList.findIndex((a) => a.id === id);
    this.userList.splice(i, 1);
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
    this.confirmDeleteModelOpen = false;
  };

  cancelDelete = () => {
    this.confirmDeleteModelOpen = false;
  };

  formatDate = (date) => {
    if (!date) {
      return '';
    }
    return moment(date).format('ddd DD MMMYY hh:mmA');
  };

  writeDescription = (start, end) => {
    if (start === 0) {
      return 'Upto ' + end + ' hours';
    } else {
      return start + ' to ' + end + ' hours';
    }
  };

  suspendUser(data) {
    var status = data.status === true ? 'suspend' : 'activate';
    var obj = {
      userId: data.id,
      parkingId: this.parking_id,
      status: status,
    };
    this.parkingService.postJson(APIS.PARKING.USERS.SUSPEND, obj).subscribe(
      (res: any) => {
        this.loadAPIData();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteUser = (id) => {
    this.parkingService
      .deleteJson(
        APIS.PARKING.OPERATOR.DELETE.replace('{PARKING_ID}', this.parking_id),
        { id }
      )
      .subscribe(
        (res: any) => {
          this.loadAPIData();
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
        action: this.suspendUser.bind(this, data),
        confirm: true,
        confirmParam: {
          title: 'Suspend',
          content:
            'Are you sure to suspend ' +
            data.firstName +
            ' ' +
            data.lastname +
            '?',
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
        action: this.suspendUser.bind(this, data),
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
}
