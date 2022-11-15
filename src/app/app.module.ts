import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { SalesModule } from './sales/sales.module';
import { Globals } from './classes/globals';
import { Session } from './classes/session';

import { WINDOW_PROVIDERS } from './services/window.service';
import { SharedModule } from './shared/shared.module';
import { SettingsModule } from './settings/settings.module';

import { RouterExtService } from './services/RouterExtService';
import { ParkingModule } from './parking/parking.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AuthModule,
    SalesModule,
    ParkingModule,
    SettingsModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [Globals, WINDOW_PROVIDERS, Session, RouterExtService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private routerExtService: RouterExtService) {}
}
