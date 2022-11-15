import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgApexchartsModule } from 'ng-apexcharts';

import { SharedModule } from '../shared/shared.module';
import { ParkingRoutingModule } from './parking.routing';
import { DetailsModule } from './details/details.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AllsessionsComponent } from './allsessions/allsessions.component';
import { AllpassesComponent } from './allpasses/allpasses.component';
import { ParksettingsModule } from './parksettings/parksettings.module';
import { ReportsComponent } from './reports/reports.component';
import { RevenueByHoursComponent } from './reports/revenue-by-hours/revenue-by-hours.component';
import { TotalAmountComponent } from './reports/total-amount/total-amount.component';
import { PassCreatedComponent } from './reports/pass-created/pass-created.component';
import { PassRevenueComponent } from './reports/pass-revenue/pass-revenue.component';
import { TotalAmountClosedComponent } from './reports/total-amount-closed/total-amount-closed.component';
import { ActivityByTimeOfTheDayComponent } from './reports/activity-by-time-of-the-day/activity-by-time-of-the-day.component';
import { TopVehicleCategoryComponent } from './reports/top-vehicle-category/top-vehicle-category.component';
import { DateAgoPipe } from '../pipes/date-ago';
import { ParkingChartComponent } from './reports/parking-chart/parking-chart.component';
import { BookingComponent } from './reports/booking/booking.component';
import { UsersComponent } from './users/users.component';
import { TotalAmountClosedValueComponent } from './reports/total-amount-closed-value/total-amount-closed-value.component';
import { TotalAmountClosedPaymentComponent } from './reports/total-amount-closed-payment/total-amount-closed-payment.component';
import { UsersessionsComponent } from './usersessions/usersessions.component';

@NgModule({
  declarations: [
    AllsessionsComponent,
    UsersComponent,
    AllpassesComponent,
    DashboardComponent,
    ReportsComponent,
    RevenueByHoursComponent,
    BookingComponent,
    TotalAmountComponent,
    PassCreatedComponent,
    PassRevenueComponent,
    TotalAmountClosedComponent,
    ActivityByTimeOfTheDayComponent,
    TopVehicleCategoryComponent,
    DateAgoPipe,
    ParkingChartComponent,
    TotalAmountClosedValueComponent,
    TotalAmountClosedPaymentComponent,
    UsersessionsComponent,
  ],
  imports: [
    SharedModule,
    ParksettingsModule,
    CommonModule,
    FormsModule,
    ParkingRoutingModule,
    DetailsModule,
    FullCalendarModule,
    NgApexchartsModule,
  ],
})
export class ParkingModule {}
