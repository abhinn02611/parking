import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
} from 'ng-apexcharts';
import { Subject } from 'rxjs';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: any;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: any;
};

@Component({
  selector: 'app-top-vehicle-category',
  templateUrl: './top-vehicle-category.component.html',
  styleUrls: ['./top-vehicle-category.component.scss'],
})
export class TopVehicleCategoryComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  filterDropdown: any[];
  categoryName: any[] = [];
  @Input() $pCategory = new Subject();
  @Output() actionCategory = new EventEmitter();

  public colors: Array<string> = ['#00386A', '#007AFF', '#5AC8FA', '#FF9500'];

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
  }

  ngOnInit(): void {
    this.$pCategory.subscribe((res: any) => {
      this.categoryName = res.names;
      this.chartOptions = {
        series: res.data,
        chart: {
          type: 'donut',
          toolbar: {
            show: true,
            offsetX: -45,
            offsetY: 296,
            tools: {
              download: `<div style="color: #FF3B30; width: 150px; font-size: 15px">Download</div>`,
              selection: true,
            },
          },
        },

        labels: res.names,
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        colors: res.colors,
      };
    });
  }
  actionSelectDD($event) {
    const selectedTime = $event.label.toLowerCase();
    this.actionCategory.emit(selectedTime);
  }
}
