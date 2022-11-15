import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
} from 'ng-apexcharts';
import { Subject } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  fill: any;
};

@Component({
  selector: 'app-total-amount-closed',
  templateUrl: './total-amount-closed.component.html',
  styleUrls: ['./total-amount-closed.component.scss'],
})
export class TotalAmountClosedComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  filterDropdown: any[];
  @Input() $parkRevenue: Subject<any>;
  @Output() actionParkingRevenue = new EventEmitter();
  constructor() {
    this.filterDropdown = [
      {
        label: 'Select Parking',
        options: [{ label: 'Day' }, { label: 'Monthly' }, { label: 'Year' }],
      },
    ];
  }

  ngOnInit(): void {
    this.$parkRevenue.subscribe((resp) => {
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
          height: 200,
          type: 'line',
          toolbar: {
            show: true,
            offsetX: -95,
            offsetY: 220,
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
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 3,
          curve: 'straight',
          dashArray: [0, 8, 5],
          colors: ['#566881', '#B9C1CC'],
        },
        legend: {
          show: false,
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6,
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val + 'k';
            },
          },
        },
        xaxis: {
          labels: {
            trim: false,
          },
          type: 'category',
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      };
    });
  }
  actionSelectDD($event) {
    const selectedTime = $event.label.toLowerCase();
    this.actionParkingRevenue.emit(selectedTime);
  }
}
