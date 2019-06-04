import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS  }    from '@angular/common/http';
import { UserService } from './user/service/user.service';
import { ConfirmPhoneComponent } from './user/confirm-phone/confirm-phone.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {  ErrorInterceptor } from './helpers/error.interceptor';
import {  JwtInterceptor } from './helpers/jwt.interceptor';
import { LandlordProfileComponent } from './landlord/profile/profile.component';
import { LandlordDashboardComponent } from './landlord/dashboard/dashboard.component';
import { TenantDashboardComponent } from './tenant/dashboard/dashboard.component';
import { LandlordComponent } from './landlord/landlord.component';
import { TenantComponent } from './tenant/tenant.component';
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmPhoneComponent,
    NotFoundComponent,
    LandlordProfileComponent,
    LandlordDashboardComponent,
    TenantDashboardComponent,
    LandlordComponent,
    TenantComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
