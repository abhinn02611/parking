import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';
import { Subject } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-pass-created',
  templateUrl: './pass-created.component.html',
  styleUrls: ['./pass-created.component.scss'],
})
export class PassCreatedComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  filterDropdown: any[];
  @Input() Passes: any;
  @Input() $passesCreated: Subject<any>;
  @Output() actionPassesCreated = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.filterDropdown = [
      {
        label: 'Select Parking',
        options: [{ label: 'Day' }, { label: 'Monthly' }, { label: 'Year' }],
      },
    ];

    this.chartOptions = {
      series: this.Passes?.graphData,
      chart: {
        type: 'bar',
        height: 350,
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
          columnWidth: '32px',
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        type: 'category',
        categories: this.Passes?.categories,
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val + 'k';
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ['#4CD964'],
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' thousands';
          },
        },
      },
    };
  }
  actionSelectDD($event) {
    const selectedTime = $event.label.toLowerCase();
    this.actionPassesCreated.emit(selectedTime);
  }
}
