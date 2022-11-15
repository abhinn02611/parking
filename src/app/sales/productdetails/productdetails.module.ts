import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ProductDetailsComponent } from './productdetails.component';
import { LeftComponent } from './left/left.component';
import { RightComponent } from './right/right.component';
import { CenterComponent } from './center/center.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ProductDetailsComponent, LeftComponent, RightComponent, CenterComponent],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule
  ],
  exports: [
    LeftComponent,
    RightComponent,
    CenterComponent
  ]
})

export class ProductDetailsModule {
  
}