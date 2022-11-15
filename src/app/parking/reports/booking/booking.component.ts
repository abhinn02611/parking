import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  filterDropdown: any[];
  @Input() revenueHour: any;
  @Input() pHours: any;
  @Input() $pBooking: Subject<any>;
  @Output() actionBooking = new EventEmitter();
  constructor() {
    this.filterDropdown = [
      {
        label: 'Select Parking',
        options: [{ label: 'Day' }, { label: 'Monthly' }, { label: 'Year' }],
      },
    ];
  }

  ngOnInit(): void {
    this.$pBooking.subscribe((resp) => {
      const a = [
        {
          name: 'Active Week',
          data: resp?.graphData?.activeWeek,
        },
        {
          name: 'Last Week',
          data: resp?.graphData?.lastWeek,
        },
      ];

      this.chartOptions = {
        series: a,
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
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
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

        xaxis: {
          type: 'category',
          categories: resp.categories,
        },
        legend: {
          show: true,
        },
      };
    });
  }
  actionSelectDD($event) {
    const selectedTime = $event.label.toLowerCase();
    this.actionBooking.emit(selectedTime);
  }
}
