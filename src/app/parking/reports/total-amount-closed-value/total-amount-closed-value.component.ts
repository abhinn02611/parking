import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ChartOptions } from '../revenue-by-hours/revenue-by-hours.component';

@Component({
  selector: 'app-total-amount-closed-value',
  templateUrl: './total-amount-closed-value.component.html',
  styleUrls: ['./total-amount-closed-value.component.scss'],
})
export class TotalAmountClosedValueComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  filterDropdown: any[];
  todayResponse: any;
  parkingMonthlyCollection = {
    inVehicle: 0,
    outVehicle: 0,
    passOut: 0,
    createdPass: 0,
    booking: 0,
    cashPayment: 0,
    onlinePayment: 0,
    onlineBookingPayment: 0,
  };
  parkingDaysCollection = {
    inVehicle: 0,
    outVehicle: 0,
    passOut: 0,
    createdPass: 0,
    booking: 0,
    cashPayment: 0,
    onlinePayment: 0,
    onlineBookingPayment: 0,
  };
  totalMonthlyPayment: number = 0;
  totalDailyPayment: number = 0;
  @Input() revenueHour: any;
  @Input() pHours: any;
  @Input() pDays: any;
  @Input() pMonthcollection: any;
  @Input() pdayscollection: any;
  @Input() $revenueHour: Subject<any>;
  @Output() actionRevenue = new EventEmitter();
  @Output() actionWeeklyAmount = new EventEmitter();
  @Output() actionDayAmount = new EventEmitter();

  constructor() {
    this.filterDropdown = [
      {
        label: 'Select Parking',
        options: [
          { label: 'This month' },
          { label: 'Last month' },
          { label: 'Last to last month' },
        ],
      },
      {
        label: 'Select Parking',
        options: [
          { label: 'Today' },
          { label: 'Yesterday' },
          { label: 'Day Before Yesterday' },
        ],
      },
    ];
  }

  ngOnInit(): void {
    this.chartOptions = {
      series: this.revenueHour?.graphData,
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: true,
      },
      fill: {
        opacity: 1,
        colors: this.revenueHour?.colors,
      },
      xaxis: {
        type: 'category',
        categories: this.revenueHour?.categories,
      },
      legend: {
        show: true,
      },
    };
  }

  actionSelected($event: any, selctedType: string) {
    if (selctedType == 'Monthly') {
      this.actionWeeklyAmount.emit({
        selectedValue: $event.label.toLowerCase(),
        selctedType: selctedType,
      });
    } else {
      this.actionDayAmount.emit({
        selectedValue: $event.label.toLowerCase(),
        selctedType: selctedType,
      });
    }
  }

  calculatePercentageChange(currentWeek: number, lastweek: number) {
    if (lastweek === 0) {
      return 100;
    }
    return (((currentWeek - lastweek) / lastweek) * 100).toFixed(2);
  }

  calculateParkingCollection(
    parkingCollectionArr: any[],
    selectionType: string
  ) {
    if (selectionType == 'Monthly') {
      if (parkingCollectionArr) {
        this.parkingMonthlyCollection = this.handleSumOfPakingCollection(
          parkingCollectionArr,
          { ...this.parkingMonthlyCollection }
        );
      }
      this.totalMonthlyPayment = this.totalSumOfPayment(
        this.parkingMonthlyCollection
      );
    } else {
      if (parkingCollectionArr) {
        this.parkingDaysCollection = this.handleSumOfPakingCollection(
          parkingCollectionArr,
          { ...this.parkingDaysCollection }
        );
      }
      this.totalDailyPayment = this.totalSumOfPayment(
        this.parkingDaysCollection
      );
    }
  }

  handleSumOfPakingCollection(
    parkingCollectionArr: any[] = [],
    initialParkingArr: any
  ) {
    parkingCollectionArr.forEach((pc) => {
      initialParkingArr.inVehicle += pc.inVehicle;
      initialParkingArr.outVehicle += pc.outVehicle;
      initialParkingArr.passOut += pc.passOut;
      initialParkingArr.createdPass += pc.createdPass;
      initialParkingArr.booking += pc.booking;
      initialParkingArr.cashPayment += pc.cashPayment;
      initialParkingArr.onlinePayment += pc.onlinePayment;
      initialParkingArr.onlineBookingPayment += pc.onlineBookingPayment;
    });

    return initialParkingArr;
  }

  totalSumOfPayment(parkingCollection: any) {
    let total = 0;
    for (let value in parkingCollection) {
      if (
        value == 'cashPayment' ||
        value == 'onlinePayment' ||
        value == 'onlineBookingPayment'
      ) {
        total += parkingCollection[value];
      }
    }
    return total;
  }
}
