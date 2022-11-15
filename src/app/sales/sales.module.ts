import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SalesRoutingModule } from './sales.routing';

import { AllleadsComponent } from './allleads/allleads.component';
import { AllcontactsComponent } from './allcontacts/allcontacts.component';
import { AllproductsComponent } from './allproducts/allproducts.component';
import { AllcompanyComponent } from './allcompany/allcompany.component';
import { DetailsModule } from './details/details.module';
import { CommonModule } from '@angular/common';
import { ProductDetailsModule } from './productdetails/productdetails.module';
import { CompanyDetailsModule } from './companydetails/companydetails.module';
import { AllordersComponent } from './allorders/allorders.component';
import { ContactDetailsModule } from './contactdetails/contactdetails.module';
import { OrderDetailsModule } from './orderdetails/orderdetails.module';
import { AlltasksComponent } from './alltasks/alltasks.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TaskDetailsModule } from './taskdetails/taskdetails.module';
import { AllRelatedProductsComponent } from './all-related-products/all-related-products.component';
import { AllAttachmentsComponent } from './all-attachments/all-attachments.component';
import { AllNotesComponent } from './all-notes/all-notes.component';


@NgModule({
  declarations: [AllleadsComponent, AllcontactsComponent,
     AllproductsComponent, AllcompanyComponent, AllordersComponent, AlltasksComponent,
     AllRelatedProductsComponent, AllAttachmentsComponent, AllNotesComponent],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    SalesRoutingModule,
    DetailsModule,
    ProductDetailsModule,
    CompanyDetailsModule,
    ContactDetailsModule,
    OrderDetailsModule,
    TaskDetailsModule,
    FullCalendarModule
  ]
})

export class SalesModule {
}
