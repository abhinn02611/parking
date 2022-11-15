import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../shared.service';
import * as moment from 'moment';
import { ParkingService } from 'src/app/parking/parking.service';
import { Session } from 'src/app/classes/session';


@Component({
  selector: 'app-passes-share',
  templateUrl: './passes-share.component.html',
  styleUrls: ['./passes-share.component.scss'],
})
export class PassesShareComponent implements OnInit {
  @Input() editId = '';
  @Input() parking_id: string;

  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  title = "Sharing <div class='dim'>Passes</div>";
  attachmentsTypes = [{ label: 'Excel (XLSX)', value: 'excel' }];
  operatorTypes = [{ label: 'All', value: 'all' }];
  formData = {
    subject: '',
    attachments: '',
    operators: {},
    emails: [],
    fromDate: '',
    toDate: '',
    sessions: [],
    inputEmails: '',
    parkingId: '',
  };
  types = [];
  userList: any[] = [];
  datetype = '';
  showSessionModal = false;
  selectedSessions = [];
  showSessions = [];
  userRole: string = '';
  constructor(
    private sharedService: SharedService,
    private parkingService: ParkingService,
    private session: Session
  ) {}

  isArray(val): boolean {
    return Array.isArray(val);
  }

  ngOnInit(): void {
    var user = JSON.parse(this.session.get('user'));
    this.userRole = user.type;
    this.getOperators();
  }

  onCancel = () => {
    this.actionCancel.emit();
  };

  print = (v) => {
    return JSON.stringify(v);
  };

  actionSelectDD = (type, key) => {
    this.formData[key] = type.value;
  };
  operatorSelectDD = ($event) => {
    // this.formData[key] = type.value;
    const item = this.userList.find((i) => i.id == $event.id);
    if (!item || !item.id) return;
    const obj = {
      label: item.label,
      id: item.id,
    };
    this.formData.operators = obj;
  };
  getOperators = () => {
    this.parkingService
      .get(
        APIS.PARKING.OPERATOR.USERS.replace(
          '{PARKING_ID}',
          this.parking_id
        ).replace('{role}', this.userRole)
      )
      .subscribe(
        (data: any) => {
          this.userList.push({
            label: 'All',
            id: 0,
          });
          data?.rows?.forEach((item) => {
            this.userList.push({
              label: item.firstName + ' ' + item.lastName,
              id: item.id,
            });
          });
        },
        (err) => {
          console.error(err);
        }
      );
  };

  onPrimary = () => {
    const emails = this.formData.inputEmails;
    if (emails) {
      var emailArray = emails.split(',');
      this.formData.emails = emailArray;
    }
    delete this.formData.inputEmails;
    this.formData.parkingId = this.parking_id;
    this.formData.sessions = this.selectedSessions.map((a) => a.id);
    this.parkingService
      .postJson(
        APIS.PARKING.SESSIONS.SHARESESSION.replace(
          '{PARKING_ID}',
          this.parking_id
        ),
        this.formData
      )
      .subscribe(
        (res) => {
          this.showSessionModal = false;
          this.actionCancel.emit();
        },
        (err) => {}
      );
  };

  onDateChange(event) {
    this.formData.fromDate = moment(event[0]).format('YYYY-MM-DD');
    this.formData.toDate = moment(event[1]).format('YYYY-MM-DD');
  }

  setDateType = (type) => {
    this.selectedSessions = [];
    this.formData.sessions = [];
    this.showSessions = [];
    this.datetype = type;
    switch (type) {
      case 'today':
        this.formData.fromDate = moment().format('YYYY-MM-DD');
        this.formData.toDate = moment().format('YYYY-MM-DD');
        break;
      case 'week':
        this.formData.fromDate = moment().subtract(1, 'w').format('YYYY-MM-DD');
        this.formData.toDate = moment().format('YYYY-MM-DD');
        break;
      case 'month':
        this.formData.fromDate = moment()
          .subtract(1, 'months')
          .format('YYYY-MM-DD');
        this.formData.toDate = moment().format('YYYY-MM-DD');
        break;
      case 'quarter':
        this.formData.fromDate = moment()
          .subtract(3, 'months')
          .format('YYYY-MM-DD');
        this.formData.toDate = moment().format('YYYY-MM-DD');
        break;
      default:
        break;
    }
  };

  formatSessions(sessions) {
    if (sessions.length > 2) {
      const part1 = sessions.slice(0, 2);
      return (
        part1.join(', ') + ' and ' + (sessions.length - 2) + ' other selected'
      );
    } else {
      return sessions.join(', ');
    }
  }

  showSession() {
    this.showSessionModal = true;
    this.datetype = '';
    this.formData.fromDate = '';
    this.formData.toDate = '';
  }

  hideSession() {
    this.showSessionModal = false;
  }

  onSessionSelected(sessions) {
    this.selectedSessions = sessions;
    // this.formData.sessions = this.selectedSessions.map(a => a.vehicle.regNumber);
    this.showSessions = this.selectedSessions.map((a) => a.vehicle.regNumber);
    this.hideSession();
  }
}
