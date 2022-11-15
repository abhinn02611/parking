import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ListheaderComponent } from './listheader/listheader.component';
import { ListactionComponent } from './listaction/listaction.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ForminputComponent } from './forminput/forminput.component';
import { FormtextareaComponent } from './formtextarea/formtextarea.component';
import { ModelComponent } from './model/model.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { FormdropdownComponent } from './formdropdown/formdropdown.component';
import { FormModelDropdownComponent } from './form-model-dropdown/form-model-dropdown.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DetailsheaderComponent } from './detailsheader/detailsheader.component';
import { FormuploadComponent } from './formupload/formupload.component';
import { RouterModule } from '@angular/router';
import { DragDropFileUploadDirective } from './drag-drop-file-upload.directive';
import { NumberOnlyDirective } from './number-only.directive';
import { PageloaderComponent } from './pageloader/pageloader.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddTypesComponent } from './add-types/add-types.component';
import { AddRelatedProductsComponent } from './add-related-products/add-related-products.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { OrderByPipe } from '../pipes/order-by.pipe';
import { SelectRelatedCompanyComponent } from './select-related-company/select-related-company.component';
import { LatlongPickerComponent } from './latlong-picker/latlong-picker.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormdatepickerComponent } from './formdatepicker/formdatepicker.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { SelectRelatedContactComponent } from './select-related-contact/select-related-contact.component';
import { SelectOwnerComponent } from './select-owner/select-owner.component';
import { FormproductComponent } from './formproduct/formproduct.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import timeGrigPlugin from '@fullcalendar/timegrid';
import { AddTaskComponent } from './add-task/add-task.component';
import { FormtimepickerComponent } from './formtimepicker/formtimepicker.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { NotesComponent } from './notes/notes.component';
import { InitialCharactersPipe } from '../pipes/initial-characters';
import { AddParkingRateComponent } from './add-parking-rate/add-parking-rate.component';
import { FormRateComponent } from './formrates/formrates.component';
import { HeaderParkingComponent } from './headerparking/headerparking.component';
import { FilterComponent } from './filter/filter.component';
import { ListuserComponent } from './listuser/listuser.component';
import { ParkingShareComponent } from './parking-share/parking-share.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ViewPassComponent } from './view-pass/view-pass.component';
import { SelectSessionComponent } from './select-session/select-session.component';
import { AddParkingRatePassComponent } from './add-parking-rate-pass/add-parking-rate-pass.component';
import { FormRatePassComponent } from './formrates-pass/formrates-pass.component';
import { AddOperatorComponent } from './add-operator/add-operator.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { AddParkingDetailsComponent } from './add-parking-details/add-parking-details.component';
import { PassesShareComponent } from './passes-share/passes-share.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { HeaderDropdownComponent } from './header-dropdown/header-dropdown.component';
import { FilterPaginationComponent } from './filter-pagination/filter-pagination.component';
import { SelectDropDownComponent } from './select-drop-down/select-drop-down.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGrigPlugin,
]);

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ListheaderComponent,
    ListactionComponent,
    DropdownComponent,
    ForminputComponent,
    ModelComponent,
    ConfirmComponent,
    FormdropdownComponent,
    HeaderDropdownComponent,
    FormModelDropdownComponent,
    BreadcrumbComponent,
    DetailsheaderComponent,
    FormtextareaComponent,
    FormuploadComponent,
    DragDropFileUploadDirective,
    NumberOnlyDirective,
    PageloaderComponent,
    AddProductComponent,
    AddCategoryComponent,
    AddTypesComponent,
    AddRelatedProductsComponent,
    OrderByPipe,
    AddCompanyComponent,
    SelectRelatedCompanyComponent,
    LatlongPickerComponent,
    AddAddressComponent,
    AddContactComponent,
    FormdatepickerComponent,
    AddOrderComponent,
    SelectRelatedContactComponent,
    SelectOwnerComponent,
    FormproductComponent,
    AddTaskComponent,
    FormtimepickerComponent,
    AttachmentsComponent,
    NotesComponent,
    InitialCharactersPipe,
    AddParkingRateComponent,
    FormRateComponent,
    HeaderParkingComponent,
    FilterComponent,
    ListuserComponent,
    ParkingShareComponent,
    PassesShareComponent,
    ViewPassComponent,
    ViewUserComponent,
    SelectSessionComponent,
    AddParkingRatePassComponent,
    FormRatePassComponent,
    AddOperatorComponent,
    AddParkingDetailsComponent,
    FilterPaginationComponent,
    HeaderDropdownComponent,
    SelectDropDownComponent,
    SearchbarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    DpDatePickerModule,
    FullCalendarModule,
    NzDatePickerModule,
    NzPopoverModule,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    ListheaderComponent,
    ListactionComponent,
    DropdownComponent,
    ForminputComponent,
    ModelComponent,
    ConfirmComponent,
    FormdropdownComponent,
    FormModelDropdownComponent,
    BreadcrumbComponent,
    DetailsheaderComponent,
    FormtextareaComponent,
    FormuploadComponent,
    DragDropFileUploadDirective,
    NumberOnlyDirective,
    PageloaderComponent,
    AddProductComponent,
    AddCategoryComponent,
    AddTypesComponent,
    AddRelatedProductsComponent,
    OrderByPipe,
    AddCompanyComponent,
    SelectRelatedCompanyComponent,
    LatlongPickerComponent,
    AddAddressComponent,
    AddContactComponent,
    FormdatepickerComponent,
    AddOrderComponent,
    SelectRelatedContactComponent,
    SelectOwnerComponent,
    FormproductComponent,
    AddTaskComponent,
    FormtimepickerComponent,
    AttachmentsComponent,
    NotesComponent,
    InitialCharactersPipe,
    AddParkingRateComponent,
    FormRateComponent,
    HeaderParkingComponent,
    FilterComponent,
    ListuserComponent,
    ParkingShareComponent,
    PassesShareComponent,
    ViewPassComponent,
    ViewUserComponent,
    SelectSessionComponent,
    AddParkingRatePassComponent,
    FormRatePassComponent,
    AddOperatorComponent,
    AddParkingDetailsComponent,
    FilterPaginationComponent,
    SearchbarComponent,
  ],
})
export class SharedModule {}
