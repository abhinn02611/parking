import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { SettingsComponent } from './settings.component';
import { LeftComponent } from './left/left.component';
import { RightComponent } from './right/right.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsRoutingModule } from './settings.routing';
import { ProfileComponent } from './components/profile/profile.component';
import { DataComponent } from './components/data/data.component';

@NgModule({
  declarations: [
    SettingsComponent,
    LeftComponent,
    RightComponent,
    DashboardComponent,
    ProfileComponent,
    DataComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    SettingsRoutingModule
  ],
  exports: [
    LeftComponent,
    RightComponent,
    DashboardComponent,
    DataComponent
  ]
})

export class SettingsModule {

}
