import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS } from 'src/app/classes/appSettings';
import { ParkingService } from 'src/app/parking/parking.service';
import * as moment from 'moment';


@Component({
  selector: 'app-select-session',
  templateUrl: './select-session.component.html',
  styleUrls: ['./select-session.component.scss']
})
export class SelectSessionComponent implements OnInit {

  @Input() selectedSession = '';
  @Input() selectedSessions = [];
  @Input() title = 'Choose Session';
  @Input() multi = true;
  @Input() parking_id = '';
  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();

  sessionList: any[];
  sessionListView: any[];
  loading = false;
  loaderPrimary = false;
  orderBy = '';
  reverse = true;
  selectall = false;
  searchKeyword = '';
  selectedSessionObject = null;
  selectedSessionObjects = [];


  filter={
    page: 1,
    total: 100,
    limit: 15,
    query: '',
    from: '',
    to: '',
    filterLabe: false,
    dropdowns: [
      {
        name: 'type',
        title: 'Type',
        options: []
      }
    ],
    date: false
  };

  filterQuery="";

  headerMap = {
    type: 'TYPE',
    vehicle_no: 'VEHICLE NO.',
    inTime: 'IN TIME',
    outTime: 'OUT TIME',
    rate: 'PRICE LIST',
    paymentMode: 'PAYMENT MODE',
    pass: 'PASS',
    time: 'TOTAL TIME',
    total: 'COLLECTION',
  };



  constructor(private parkingService: ParkingService) {

  }

  isArray(val): boolean { return Array.isArray(val); }

  inArray = (val, stack) => (stack.findIndex(val) > -1);

  ngOnInit(): void {
    this.selectedSessionObjects = this.selectedSessions;
    this.selectedSessionObject = this.selectedSession;
    this.loadAPIData();
    this.fetchvehicleTypes();
  }

  fetchvehicleTypes = () => {
    this.parkingService.get(APIS.PARKING.VEHICLE_TYPES.LIST).subscribe(
      (data: Array<any>) => {
        let dd = data.map((m) => {
          return { label: m.name, value: m.id };
        });
        this.filter.dropdowns[0]=({name: 'vehicleType', title: 'Type',  options: dd});
      },
      (err) => {
        console.error(err);
      },
    );
  };

  loadAPIData = () => {
    this.loading = true;
    this.parkingService.get(APIS.PARKING.SESSIONS.LIST.replace('{PARKING_ID}', this.parking_id)+this.filterQuery)
    .subscribe(
      (data: any) => {
        this.loading = false;
        this.sessionList = data.rows;
        this.filter.total = data.count;
        this.filter.limit = data.limit;
        this.filter.page = data.page;
        this.filtersessionList();
      },
      (err) => {
        this.loading = false;
        console.error(err);
      },
    );
  };

  applyFilter = (filter) => {
    this.filterQuery = "";
    let filterList = [];
    let fc = 0;
    if(filter.query){
      filterList.push('vehicle='+filter.query);
      fc++;
    }
    if(filter.type){
      filterList.push('type='+filter.type);
      fc++;
    }
    if(filter.from){
      filterList.push('from='+filter.from);
      fc++;
    }
    if(filter.to){
      filterList.push('to='+filter.to);
    }
    if(filter.page){
      filterList.push('page='+filter.page);
    }
    for(let dd of filter.dropdowns){
      if(dd.value){
        filterList.push(dd.name + '='+dd.value);
        fc++;
      }
    }
    if(this.orderBy){
      filterList.push('orderBy='+this.orderBy+':'+(this.reverse?'DESC':'ASC'));
    }
    this.filterQuery = "?"+filterList.join("&");
    this.loadAPIData();
  }

  formatDate = (date) => {
    if(!date){
      return '';
    }
    return moment(date).format('ddd DD MMMYY hh:mmA');
  }

  filtersessionList = () => {
    this.sessionListView = this.sessionList.map((a: any): Array<any> => {
      Object.keys(a).map(
        (k) => (a[k] = typeof a[k] === 'string' ? a[k].trim() : a[k])
      );
      return a;
    });
  };

  updateOrderBy = (type: string) => {
    this.orderBy = type;
    this.reverse = !this.reverse;
  }

  selectItem = (session: any) => {
    if (this.multi === true) {
      const pos = this.selectedSessionObjects.findIndex(a => a.id === session.id);
      if (pos > -1) {
        this.selectedSessionObjects.splice(pos, 1);
      } else {
        this.selectedSessionObjects.push(session);
      }
    } else {
      this.selectedSessionObjects = session;
    }

  }

  showResult = () => {
    this.sessionListView = this.sessionList.filter((a: any) => {
      if (this.searchKeyword.length) {
        if (a.store_name.toLowerCase().includes(this.searchKeyword.toLowerCase()) === false) {
          return false;
        }
      }
      return true;
    });
  }

  print = (v) => {
    return JSON.stringify(v);
  }

  onPrimary = () => {
    if (this.multi === true) {
      this.actionPrimary.emit(this.selectedSessionObjects);
    } else {
      this.actionPrimary.emit(this.selectedSessionObject);
    }
  }

  isSelected = (id: any) => {
    if (this.multi === true) {
      const pos = this.selectedSessionObjects.findIndex(a => a.id === id);
      return pos > -1;
    } else {
      return this.selectedSessionObject && this.selectedSessionObject.store_id === id;
    }
  }


}
