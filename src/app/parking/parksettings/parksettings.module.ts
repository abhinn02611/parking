import { LightboxModule } from 'ngx-lightbox';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ParksettingsComponent } from './parksettings.component';
import { LeftComponent } from './left/left.component';
import { RatesComponent } from './rates/rates.component';
import { PassesComponent } from './passes/passes.component';
import { TeamsComponent } from './teams/teams.component';
import { ParkingRateComponent } from './parking-rate/parking-rate.component';
import { VendorComponent } from './vendor/vendor.component';
import { ManageParkingComponent } from './manageParking/manageParking.component';
import { ParkDashboardComponent } from './park-dashboard/park-dashboard.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { ParkVendorsComponent } from './park-vendors/park-vendors.component';

const routes: Routes = [];
@NgModule({
  declarations: [
    ParksettingsComponent,
    LeftComponent,
    RatesComponent,
    PassesComponent,
    ParkDashboardComponent,
    TeamsComponent,
    ParkingRateComponent,
    VendorComponent,
    ManageParkingComponent,
    AddVendorComponent,
    ParkVendorsComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    LightboxModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    ParksettingsComponent,
    LeftComponent,
    RatesComponent,
    PassesComponent,
    ParkDashboardComponent,
    TeamsComponent,
    ParkingRateComponent,
    VendorComponent,
    ManageParkingComponent,
  ],
})
export class ParksettingsModule {}
