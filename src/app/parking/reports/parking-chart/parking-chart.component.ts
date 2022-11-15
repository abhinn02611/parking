import { Session } from './../../../classes/session';
import {
  Component,
  Input,
  OnInit,
  Renderer2,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexStroke,
  ApexLegend,
  ApexGrid,
} from 'ng-apexcharts';

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
  grid: ApexGrid;
};

@Component({
  selector: 'app-parking-chart',
  templateUrl: './parking-chart.component.html',
  styleUrls: ['./parking-chart.component.scss'],
})
export class ParkingChartComponent implements OnInit, OnChanges {
  public chartOptions: Partial<ChartOptions>;
  vehicleData: any[] = [];

  addNewModelOpen = false;
  infoOpen = true;
  loading = false;
  sidebarFixed = false;
  confirmDeleteModelOpen = false;
  math = Math;
  @Input() vParkingDetails: any;
  vehicleSeriesData: any[] = [];
  vehicleOccupancy = {};
  totalavaibility: number;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private session: Session
  ) {
    this.renderer.addClass(document.body, 'body-grey');
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.vParkingDetails.currentValue) {
      this.parkingChartInit();
    }
  }

  ngOnInit(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 110,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true,
        borderColor: '#F8F9FA',
        column: {
          colors: ['#F8F9FA'],
        },
        xaxis: {
          lines: {
            show: false,
          },
        },

        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },

      xaxis: {
        labels: {
          show: false,
        },
        min: 0,
        max: 200,
        axisBorder: {
          show: false,
          offsetX: 0,
          strokeWidth: 0,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        marker: {
          show: true,
        },
        fixed: {
          enabled: false,
          position: '',
          offsetX: 0,
          offsetY: 0,
        },
        x: {
          show: false,
        },
        y: {
          formatter: (value, opts) => {
            let seriesName =
              opts.w.config.series[opts.seriesIndex].name.split('(')[0];
            return this.vehicleOccupancy[seriesName].availability;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'left',
        formatter: (seriesName, opts) => {
          let capacity = this.vehicleOccupancy[seriesName].capacity;
          return `${seriesName}(${capacity})`;
        },
        offsetX: 0,
        offsetY: 0,
        itemMargin: {
          horizontal: 5,
          vertical: 0,
        },
      },
    };
  }

  parkingChartInit() {
    this.totalavaibility = 0;
    this.vParkingDetails.parkingDetails.forEach((parking: any) => {
      this.totalavaibility = this.totalavaibility + parking.capacity;
    });
    this.chartOptions.xaxis.max = this.totalavaibility;
    this.vParkingDetails.parkingDetails.forEach((parking: any) => {
      this.vehicleSeriesData.push({
        color: parking.vehicleType.color,
        name: parking.vehicleType.name,
        data: [+parking.availability],
      });
      this.vehicleOccupancy[parking.vehicleType.name] = {
        capacity: parking.capacity,
        availability: parking.availability,
      };
    });
    this.chartOptions.series = this.vehicleSeriesData;
  }

  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
  };

  openAddNewModel = () => {
    this.addNewModelOpen = true;
  };
  onViewParking(parking: any) {
    this.router.navigate(['/parking/sessions', parking.parkingId], {
      replaceUrl: false,
    });
  }

  createOpeningHours() {
    if (
      this.vParkingDetails &&
      this.vParkingDetails?.openHour &&
      this.vParkingDetails?.closeHour
    ) {
      return this.vParkingDetails?.openHour - this.vParkingDetails?.closeHour;
    } else {
      return 'Always Open';
    }
  }
}
