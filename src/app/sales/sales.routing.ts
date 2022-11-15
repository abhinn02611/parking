import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AllleadsComponent } from './allleads/allleads.component';
import { AllcontactsComponent } from './allcontacts/allcontacts.component';
import { AllproductsComponent } from './allproducts/allproducts.component';
import { DetailsComponent } from './details/details.component';
import { AuthGuard } from '../auth/auth.guard';
import { ProductDetailsComponent } from './productdetails/productdetails.component';
import { PATHS } from '../classes/appSettings';
import { AllcompanyComponent } from './allcompany/allcompany.component';
import { CompanyDetailsComponent } from './companydetails/companydetails.component';
import { AllordersComponent } from './allorders/allorders.component';
import { ContactDetailsComponent } from './contactdetails/contactdetails.component';
import { OrderDetailsComponent } from './orderdetails/orderdetails.component';
import { AlltasksComponent } from './alltasks/alltasks.component';
import { TaskDetailsComponent } from './taskdetails/taskdetails.component';
import { AllRelatedProductsComponent } from './all-related-products/all-related-products.component';
import { AllAttachmentsComponent } from './all-attachments/all-attachments.component';
import { AllNotesComponent } from './all-notes/all-notes.component';

const routes: Routes = [
  { path: '', component: AllleadsComponent },
  { path: 'allleads', component: AllleadsComponent },
  { path: 'allcontacts', component: AllcontactsComponent },
  { path: PATHS.PRODUCT_LIST, component: AllproductsComponent },
  { path: PATHS.COMPANY_LIST, component: AllcompanyComponent },
  { path: 'details', component: DetailsComponent },
  { path: PATHS.PRODUCT_DETAILS + ':id', component: ProductDetailsComponent,  pathMatch: 'full' },
  { path: '', component: AllleadsComponent },
  { path: PATHS.COMPANY_DETAILS + ':id', component: CompanyDetailsComponent,  pathMatch: 'full' },
  { path: PATHS.CONTACT_DETAILS + ':id', component: ContactDetailsComponent,  pathMatch: 'full' },
  { path: PATHS.ORDER_DETAILS + ':id', component: OrderDetailsComponent,  pathMatch: 'full' },
  { path: PATHS.TASK_DETAILS + ':id', component: TaskDetailsComponent,  pathMatch: 'full' },
  { path: PATHS.ORDER_LIST, component: AllordersComponent },
  { path: PATHS.TASK_LIST, component: AlltasksComponent },
  { path: PATHS.PRODUCT_RELATED_LIST + ':id', component: AllRelatedProductsComponent,  pathMatch: 'full' },
  { path: PATHS.ATTACHMENT_LIST + ':type/:id', component: AllAttachmentsComponent,  pathMatch: 'full' },
  { path: PATHS.NOTES_LIST + ':type/:id', component: AllNotesComponent, pathMatch: 'full' },
];

export const SalesRoutingModule: ModuleWithProviders<any> = RouterModule.forChild(routes);
