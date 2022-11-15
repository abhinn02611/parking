import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ChartOptions } from '../revenue-by-hours/revenue-by-hours.component';

@Component({
  selector: 'app-total-amount-closed-payment',
  templateUrl: './total-amount-closed-payment.component.html',
  styleUrls: ['./total-amount-closed-payment.component.scss'],
})
export class TotalAmountClosedPaymentComponent implements OnInit {
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
