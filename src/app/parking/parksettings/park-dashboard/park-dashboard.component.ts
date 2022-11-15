import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { ParkingService } from '../../parking.service';
import * as moment from 'moment';

@Component({
  selector: 'app-parksettings-park-dashboard',
  templateUrl: './park-dashboard.component.html',
  styleUrls: ['./park-dashboard.component.scss']
})
export class ParkDashboardComponent implements OnInit {

  parking_id = '';
  heading = '';
  domain = '';
  menuSwitchStatus: boolean = false;

  actions = null;
  activeActions = [];
  confirmDeleteModelOpen = false;

  addRateModelOpen = false;
  parkingList:any;
  editId = '';
  editGroup = {};
  singleEdit = false;
  isShowVendor=false;
  ratesList: any[];
  ratesListView: any[];
  loading = false;
  orderBy = '';
  tags = ['', ''];
  reverse = true;
  vendorList:any[];



  path = PATHS;
  active = PATHS.SETTINGS + 'undefined';
  priceGroup = [];

  constructor(private router: Router, private route: ActivatedRoute,
    private parkingService: ParkingService) {
    const parts = this.router.url.split('/');
    this.active = parts[1] + '/' + parts[2];
    this.route.params.subscribe(params => {
      this.parking_id = params.id;
      // this.ngOnInit();
    });
  }

  ngOnInit() {
this.getAllVendors();
  }
  onCreateVendor(){
    this.isShowVendor=true;
  }

  getAllVendors(){
    this.loading = true;

    this.parkingService.get(APIS.PARKING.USERS.ALLUSERS.replace('{UserType}', 'vendor' ))
      .subscribe(
        (data: any) => {
          
          this.loading = false;
          this.vendorList = data.rows;

        },
        (err) => {
          this.loading = false;
          console.error(err);
        },
      );
  }

}
