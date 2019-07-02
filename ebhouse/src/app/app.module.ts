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

//landlord routing
import {LandlordRoutingModule }from './landlord/landlord-routing.module';

import {LandlordModule }from './landlord/landlord.module';

import {TenantModule }from './tenant/tenant.module';
import {BrowserAnimationsModule }from '@angular/platform-browser/animations';

import {ConfirmationDialogComponent }from './shared/confirmation-dialog/confirmation-dialog.component';
import {InformationDialogComponent }from './shared/info-dialog/information-dialog.component';
import {MatDialogModule}from '@angular/material/dialog';
import {NavbarComponent }from './navbar/navbar.component';
import {HeaderComponent }from './header/header.component';
import {NotifiModule }from './notifi/notifi.module';
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
    LogoutComponent,
    NavbarComponent,
    HeaderComponent
  ],
  imports:[
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    LandlordModule,
    TenantModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatDialogModule,
    NgbModule,
    NotifiModule
  ],
  providers:[ {provide:HTTP_INTERCEPTORS, useClass:JwtInterceptor, multi:true },  {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true },
    UserService],
  entryComponents:[
    ConfirmationDialogComponent,
    InformationDialogComponent
  ],
  bootstrap:[AppComponent]
})
export class AppModule {}
