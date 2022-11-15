import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { skip } from 'rxjs/operators';
import { APIS } from 'src/app/classes/appSettings';
import { Session } from 'src/app/classes/session';
import { ParkingService } from '../parking.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  heading = 'Reports';
  tags = ['As of Oct 29, 2021 3:21 PM', 'Viewing as Himanshu Gnadhi'];
  parking_id: string = '';
  user: any = '';
  username: string = '';
  currentParking: any;
  vendorParkingDetails: any;
  parkingHours: any;
  parkingDays: any;
  parkingMonthlycollection: any;
  parkingDayCollection: any;
  $revenueByHour = new Subject();
  $Passes = new Subject();
  $passesRevenue = new Subject();
  $parkingRevenue = new Subject();
  $parkingCategory = new Subject();
  $parkingBooking = new Subject();

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private parkingService: ParkingService,
    private session: Session
  ) {
    this.renderer.addClass(document.body, 'body-grey');
    this.route.params.pipe(skip(1)).subscribe((params) => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    var pId = JSON.parse(this.session.get('parking'));
    this.currentParking = pId;
    this.parking_id = pId.id;
    this.getParkingReports();
    this.getRevenueByHours();
    this.getFilterByRevenue('day');
    this.getParkingPasses('day');
    this.getPassesRevenue('day');
    this.getParkingRevenue('day');
    this.getParkingOverview('this month', 'Monthly');
    this.getParkingOverview('today', 'Daily');
    this.getVehicleCategory('weekly');
    this.getVehicleBooking('weekly');
    const getUser = this.session.get('user');
    this.user = JSON.parse(getUser);
    this.username = this.user.firstName + ' ' + this.user.lastName;
  }
  getParkingReports() {
    this.parkingService
      .get(
        APIS.PARKING.REPORTS.VENDORPARKINGDETAILS.replace(
          '{PARKING_ID}',
          this.parking_id
        )
      )
      .subscribe(
        (data: any) => {
          this.vendorParkingDetails = data;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  refresh() {
    this.ngOnInit();
  }

  getRevenueByHours() {
    this.parkingService
      .get(
        APIS.PARKING.REPORTS.REVENUEBYHOURS.replace(
          '{PARKING_ID}',
          this.parking_id
        )
      )
      .subscribe(
        (data: any) => {
          if (data) {
            console.log(data);
            this.$revenueByHour.next(data);
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getFilterByRevenue(selectDay) {
    this.parkingService
      .get(
        APIS.PARKING.REPORTS.REVENUEBYFilterHOURS.replace(
          '{PARKING_ID}',
          this.parking_id
        ).replace('{monthly}', selectDay)
      )
      .subscribe(
        (data: any) => {
          if (data) {
            this.$revenueByHour.next(data);
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getParkingPasses(selectDay) {
    this.parkingService
      .get(
        APIS.PARKING.REPORTS.PASSES.replace(
          '{PARKING_ID}',
          this.parking_id
        ).replace('{monthly}', selectDay)
      )
      .subscribe(
        (data: any) => {
          if (data) {
            this.$Passes.next(data);
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getPassesRevenue(selectDay) {
    this.parkingService
      .get(
        APIS.PARKING.REPORTS.PASSESREVENUE.replace(
          '{PARKING_ID}',
          this.parking_id
        ).replace('{monthly}', selectDay)
      )
      .subscribe(
        (data: any) => {
          if (data) {
            this.$passesRevenue.next(data);
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }
  getParkingRevenue(selectDay: string) {
    this.parkingService
      .get(
        APIS.PARKING.REPORTS.PASSESREVENUE.replace(
          '{PARKING_ID}',
          this.parking_id
        ).replace('{monthly}', selectDay)
      )
      .subscribe(
        (data: any) => {
          if (data) {
            this.$parkingRevenue.next(data);
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getParkingOverview(selectedValue: string, selectedType: string) {
    if (selectedType == 'Monthly') {
      this.parkingHours = null;
    } else {
      this.parkingDays = null;
    }
    forkJoin([
      this.getParkingAmount(selectedValue),
      this.getParkingCollection(selectedValue),
    ]).subscribe(
      (dataResult: any[]) => {
        if (selectedType == 'Monthly') {
          let selectedDateRange = this.getSelectedDateRange('this month');
          let parkingMonthlyCollection = [];
          if (selectedDateRange.fromDate === selectedDateRange.toDate) {
            parkingMonthlyCollection[0] = dataResult[1][0];
          } else {
            parkingMonthlyCollection = dataResult[1];
          }
          let finalresp = this.calculateParkingOverview(
            parkingMonthlyCollection,
            dataResult[0]
          );
          finalresp['dataTime'] = 'Monthly';
          this.parkingHours = finalresp;
        } else {
          let parkingDayCollection = [];
          parkingDayCollection[0] = dataResult[1][0];
          let finalresp = this.calculateParkingOverview(
            parkingDayCollection,
            dataResult[0]
          );
          finalresp['dataTime'] = 'Daily';
          this.parkingDays = finalresp;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  calculateParkingOverview(parkingCollectionArr: any[], totalamountdata: any) {
    let parkingCol = {
      booking: 0,
      cashPayment: 0,
      createdPass: 0,
      currentInVehicle: 0,
      onlineBookingPayment: 0,
      onlinePayment: 0,
      outVehicle: 0,
      passOut: 0,
      refundBookingPayment: 0,
      totalInVehicles: 0,
    };

    Array.from(parkingCollectionArr).forEach((pc: any) => {
      parkingCol.totalInVehicles += pc.totalInVehicles;
      parkingCol.currentInVehicle = pc.currentInVehicle;
      parkingCol.outVehicle += pc.outVehicle;
      parkingCol.passOut += pc.passOut;
      parkingCol.createdPass += pc.createdPass;
      parkingCol.booking += pc.booking;

      parkingCol.cashPayment += pc.cashPayment;
      parkingCol.onlineBookingPayment += pc.onlineBookingPayment;
      parkingCol.onlinePayment += pc.onlinePayment;
      parkingCol.refundBookingPayment += pc.refundBookingPayment;
    });

    let paymentColl = [];

    paymentColl.push(parkingCol.cashPayment);
    paymentColl.push(parkingCol.onlineBookingPayment);
    paymentColl.push(parkingCol.onlinePayment);
    paymentColl.push(parkingCol.refundBookingPayment);

    let total = paymentColl.reduce((a, b) => {
      return a + b;
    }, 0);

    let finalresp = {
      amountWeekly: totalamountdata,
      parkingdata: parkingCol,
      totalamount: total,
    };
    return finalresp;
  }

  getParkingAmount(selectMonth: string) {
    return this.parkingService.get(
      APIS.PARKING.REPORTS.PARKINGAMOUNT.replace(
        '{PARKING_ID}',
        this.parking_id
      ).replace('{monthly}', selectMonth)
    );
  }

  getParkingCollection(selectMonth: string) {
    let selectedDateRange = this.getSelectedDateRange(selectMonth);

    return this.parkingService.get(
      APIS.PARKING.REPORTS.PARKINGTOTALCOLLECTION.replace(
        '{PARKING_ID}',
        this.parking_id
      )
        .replace('{FROM_DATE}', selectedDateRange.fromDate)
        .replace('{TO_DATE}', selectedDateRange.toDate)
    );
  }

  getSelectedDateRange(selectValue: string) {
    let fromDate: string = '';
    let todate: string = '';

    switch (selectValue) {
      case 'today':
        fromDate = moment().format('YYYY-MM-DD');
        todate = moment().format('YYYY-MM-DD');
        break;
      case 'yesterday':
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        todate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        break;
      case 'day before yesterday':
        fromDate = moment().subtract(2, 'days').format('YYYY-MM-DD');
        todate = moment().subtract(2, 'days').format('YYYY-MM-DD');
        break;
      case 'this month':
        fromDate = moment().startOf('month').format('YYYY-MM-DD');
        todate = moment().format('YYYY-MM-DD');
        break;
      case 'last month':
        fromDate = moment()
          .subtract(1, 'months')
          .startOf('month')
          .format('YYYY-MM-DD');
        todate = moment()
          .subtract(1, 'months')
          .endOf('month')
          .format('YYYY-MM-DD');
        break;
      case 'last to last month': {
        fromDate = moment()
          .subtract(2, 'months')
          .startOf('month')
          .format('YYYY-MM-DD');
        todate = moment()
          .subtract(2, 'months')
          .endOf('month')
          .format('YYYY-MM-DD');
      }
    }

    return {
      fromDate: fromDate,
      toDate: todate,
    };
  }

  getVehicleCategory(selectDay) {
    this.parkingService
      .get(
        APIS.PARKING.REPORTS.PARKINGCATEGORY.replace(
          '{PARKING_ID}',
          this.parking_id
        ).replace('{monthly}', selectDay)
      )
      .subscribe(
        (data: any) => {
          if (data) {
            this.$parkingCategory.next(data);
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }
  getVehicleBooking(selectDay) {
    this.parkingService
      .get(
        APIS.PARKING.REPORTS.PARKINGBOOKING.replace(
          '{PARKING_ID}',
          this.parking_id
        ).replace('{monthly}', selectDay)
      )
      .subscribe(
        (data: any) => {
          if (data) {
            this.$parkingBooking.next(data);
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }
  getCurrentDateTime() {
    return moment(new Date()).format('MMM DD, YYYY h:mm a');
  }
  getCurrentDate() {
    return moment(new Date()).format('MMM DD, YYYY');
  }
}
