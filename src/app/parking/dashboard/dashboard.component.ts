import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { APIS } from 'src/app/classes/appSettings';
import { Session } from 'src/app/classes/session';
import { SharedService } from 'src/app/shared/shared.service';
import { ParkingService } from '../parking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  addNewModelOpen = false;
  infoOpen = true;
  loading = false;
  sidebarFixed = false;
  confirmDeleteModelOpen = false;
  math = Math;
  today;
  vendorParkingList: any[];
  user: any;
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private parkingService: ParkingService,
    private session: Session,
    private sharedService: SharedService
  ) {
    this.renderer.addClass(document.body, 'body-grey');
  }

  ngOnInit(): void {
    this.user = JSON.parse(this.session.get('user'));
    this.getParkings();
    const todayDate = moment(new Date()).format('ddd DD MMM YY');
    this.today = `Today ${todayDate}. Viewing as ${
      this.user.firstName ? this.user.firstName : '--'
    } ${this.user.lastName ? this.user.lastName : '--'} `;
    this.sharedService.search.subscribe((val) => {
      this.parkingService
        .get(
          APIS.PARKING.ADDPARKING.DASHBOARDPARKINGSEARCH.replace(
            '{searchValue}',
            val
          )
        )
        .subscribe(
          (data: any) => {
            let parkingList = this.createParkingChart(data);
            this.vendorParkingList = parkingList;
            this.loading = false;
          },
          (err) => {
            this.loading = false;
          }
        );
    });
  }

  getParkings() {
    this.loading = true;

    this.parkingService.get(APIS.PARKING.ADDPARKING.DASHBOARDPARKING).subscribe(
      (data: any) => {
        let parkingList = this.createParkingChart(data);
        this.vendorParkingList = parkingList;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  createParkingChart(vendorParkingList: any[]) {
    vendorParkingList.forEach((parking) => {
      this.parkingChartInit(parking);
    });
    return vendorParkingList;
  }

  parkingChartInit(vParkingDetails: any) {
    let vehicleOccupancy = this.createVehicleOccupancy(vParkingDetails);
    let vehicleSeries = this.createVehicleSeriesData(vParkingDetails);
    let vehicleMax = this.calculateTotalVehicleAvailability(vParkingDetails);
    let chartOptions = {
      series: vehicleSeries,
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
        max: vehicleMax,
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
            return vehicleOccupancy[seriesName].availability;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        showForSingleSeries: true,
        formatter: (seriesName, opts) => {
          let capacity = vehicleOccupancy[seriesName].capacity;
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
    vParkingDetails.chartOptions = chartOptions;
  }

  createVehicleSeriesData(vParkingDetails: any) {
    let vehicleSeriesData = [];
    vParkingDetails.parkingDetails.forEach((parking: any) => {
      vehicleSeriesData.push({
        color: parking.vehicleType.color,
        name: parking.vehicleType.name,
        data: [+parking.availability],
      });
    });
    return vehicleSeriesData;
  }

  calculateTotalVehicleAvailability(vParkingDetails: any) {
    let totalavaibility = 0;
    vParkingDetails.parkingDetails.forEach((parking: any) => {
      totalavaibility = totalavaibility + parking.capacity;
    });
    return totalavaibility;
  }

  createVehicleOccupancy(vParkingDetails: any) {
    let vehicleOccupancy = {};

    vParkingDetails.parkingDetails.forEach((parking: any) => {
      vehicleOccupancy[parking.vehicleType.name] = {
        capacity: parking.capacity,
        availability: parking.availability,
      };
    });

    return vehicleOccupancy;
  }

  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
  };

  openAddNewModel = () => {
    this.addNewModelOpen = true;
  };
  onViewParking(parking: any) {
    let user = JSON.parse(this.session.get('user'));
    let seletedParking = user.parkings.find((park: any) => {
      return parking.parkingId === park.id;
    });

    this.sharedService.role.next(this.session.get('role'));
    this.sharedService.selectedParking.next(seletedParking);
    this.session.set('parking', JSON.stringify(seletedParking));
    this.router.navigate(['/parking/reports', seletedParking.id], {
      replaceUrl: false,
    });
  }

  createOpeningHours(vParkingDetails: any) {
    if (
      vParkingDetails &&
      vParkingDetails?.openHour &&
      vParkingDetails?.closeHour
    ) {
      return vParkingDetails?.openHour - vParkingDetails?.closeHour;
    } else {
      return 'Always Open';
    }
  }
}
