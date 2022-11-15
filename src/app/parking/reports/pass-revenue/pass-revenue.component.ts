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
  ApexPlotOptions,
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
  bar: ApexPlotOptions;
};

@Component({
  selector: 'app-pass-revenue',
  templateUrl: './pass-revenue.component.html',
  styleUrls: ['./pass-revenue.component.scss'],
})
export class PassRevenueComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  filterDropdown: any[];
  @Input() revenue: any;
  @Input() $pRevenue: Subject<any>;
  @Output() actionParkingPasses = new EventEmitter();

  constructor() {
    this.filterDropdown = [
      {
        label: 'Select Parking',
        options: [{ label: 'Day' }, { label: 'Monthly' }, { label: 'Year' }],
      },
    ];
  }

  ngOnInit(): void {
    this.$pRevenue.subscribe((resp) => {
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
        bar: {
          bar: {
            horizontal: true,
          },
        },
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
          show: true,
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
          type: 'category',
          categories: resp?.categories,
        },
      };
    });
  }
  actionSelectDD($event) {
    const selectedTime = $event.label.toLowerCase();
    this.actionParkingPasses.emit(selectedTime);
  }
}
