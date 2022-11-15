import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { APIS } from 'src/app/classes/appSettings';
import { ParkingService } from '../../parking.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-revenue-by-hours',
  templateUrl: './revenue-by-hours.component.html',
  styleUrls: ['./revenue-by-hours.component.scss'],
})
export class RevenueByHoursComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  filterDropdown: any[];
  filterWeeklyDropdown: any[];
  filterDayDropdown: any[];
  todayResponse: any;
  @Input() revenueHour: any;
  @Input() pHours: any;
  @Input() pDays: any;
  @Input() $revenueHour: Subject<any>;
  @Output() actionRevenue = new EventEmitter();
  @Output() actionWeeklyAmount = new EventEmitter();
  @Output() actionDayAmount = new EventEmitter();
  constructor() {
    this.filterDropdown = [
      {
        label: 'Select Parking',
        options: [{ label: 'Day' }, { label: 'Monthly' }, { label: 'Year' }],
      },
    ];
    this.filterWeeklyDropdown = [
      {
        label: 'Select Parking',
        options: [
          { label: 'This month' },
          { label: 'Last month' },
          { label: 'Last to last month' },
        ],
      },
    ];
    this.filterDayDropdown = [
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
          offsetX: -95,
          offsetY: 370,
          tools: {
            download: `<div style="color: #FF3B30; width: 150px; font-size: 15px">Download</div>`,
            selection: true,
          },
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
        show: false,
      },
    };
  }
  actionSelectDD($event) {
    const selectedTime = $event.label.toLowerCase();
    this.actionRevenue.emit(selectedTime);
  }
  actionSelectDDWeekly($event) {
    console.log('click month');

    const selectedTime = $event.label.toLowerCase();
    this.actionWeeklyAmount.emit(selectedTime);
  }
  actionSelectDDDay($event) {
    console.log('click day');

    const selectedTime = $event.label.toLowerCase();
    this.actionDayAmount.emit(selectedTime);
  }
}
