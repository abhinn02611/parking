import { Component, OnInit } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  colors: any;
};

@Component({
  selector: 'app-activity-by-time-of-the-day',
  templateUrl: './activity-by-time-of-the-day.component.html',
  styleUrls: ['./activity-by-time-of-the-day.component.scss'],
})
export class ActivityByTimeOfTheDayComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  filterDropdown: any[];

  private days: Array<string> = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  constructor() {
    this.filterDropdown = [
      {
        label: 'Select Parking',
        options: [
          { label: 'Current Day' },
          { label: 'Current Month' },
          { label: 'Current Year' },
        ],
      },
    ];
    this.chartOptions = {
      series: [
        {
          name: '12am',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '2am',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '4am',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '6am',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '8am',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '10am',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '12am',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '2pm',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '4pm',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '6pm',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '8pm',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: '10pm',
          data: this.generateData(7, {
            min: 0,
            max: 90,
          }),
        },
      ],
      chart: {
        height: 500,
        type: 'heatmap',
        toolbar: {
          show: true,
          offsetX: -95,
          offsetY: 525,
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
      colors: ['#2F5EC4', '#1A73E8', '#45A5F5', '#93D5ED'],
    };
  }

  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = this.days[i];
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y,
      });
      i++;
    }
    return series;
  }

  ngOnInit(): void {}
  actionSelectDD($event) {}
}
