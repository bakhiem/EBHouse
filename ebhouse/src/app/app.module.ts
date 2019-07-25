import {BrowserModule }from '@angular/platform-browser';
import {NgModule }from '@angular/core';

import {AppRoutingModule }from './app-routing.module';
import {AppComponent }from './app.component';
import {DashboardComponent }from './dashboard/dashboard.component';
import {LoginComponent }from './user/login/login.component';

import {LogoutComponent }from './user/logout/logout.component';
import {RegisterComponent }from './user/register/register.component';
import {FormsModule, ReactiveFormsModule }from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS }from '@angular/common/http';
import {UserService }from './user/service/user.service';
import {ConfirmPhoneComponent }from './user/confirm-phone/confirm-phone.component';
import {NotFoundComponent }from './not-found/not-found.component';
import {ErrorInterceptor }from './helpers/error.interceptor';
import {JwtInterceptor }from './helpers/jwt.interceptor';
import {NgbModule}from '@ng-bootstrap/ng-bootstrap';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

//landlord routing
import {LandlordRoutingModule }from './landlord/landlord-routing.module';

import {LandlordModule }from './landlord/landlord.module';

import {TenantModule }from './tenant/tenant.module';
import {BrowserAnimationsModule }from '@angular/platform-browser/animations';

import {ConfirmationDialogComponent }from './shared/confirmation-dialog/confirmation-dialog.component';
import {InformationDialogComponent }from './shared/info-dialog/information-dialog.component';
import {RedirectDialogComponent }from './shared/redirect-dialog/redirect-dialog.component';
import {MatDialogModule}from '@angular/material/dialog';
import {NavbarComponent }from './navbar/navbar.component';
import {HeaderComponent }from './header/header.component';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import {NotifiModule }from './notifi/notifi.module';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { LandingComponent } from './landing/landing.component';
import { AdminModule } from './admin/admin.module'
@NgModule( {
  declarations:[
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmPhoneComponent,
    NotFoundComponent,
    ConfirmationDialogComponent,
    InformationDialogComponent,
    RedirectDialogComponent,
    LogoutComponent,
    NavbarComponent,
    HeaderComponent,
    ResetPasswordComponent,
    LandingComponent,
  ],
  imports:[
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    }),
    ToastContainerModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    LandlordModule,
    TenantModule,
    AdminModule,
    BrowserAnimationsModule,
    MatDialogModule,
    NgbModule,
    NotifiModule,
    AppRoutingModule
  ],
  providers:[{provide: LocationStrategy, useClass: HashLocationStrategy}, {provide:HTTP_INTERCEPTORS, useClass:JwtInterceptor, multi:true },  {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true },
    UserService],
  entryComponents:[
    ConfirmationDialogComponent,
    InformationDialogComponent,
    RedirectDialogComponent
  ],
  bootstrap:[AppComponent]
})
export class AppModule {}
