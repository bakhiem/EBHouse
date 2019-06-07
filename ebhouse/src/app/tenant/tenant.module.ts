import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantComponent } from './tenant.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TenantProfileComponent } from './profile/profile.component';
import { TenantDashboardComponent } from './dashboard/dashboard.component';

import { TenantRoutingModule } from './tenant-routing.module';

//material table
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material';
import { ImageUploadModule } from 'ng2-imageupload';
@NgModule({
  declarations: [
    TenantProfileComponent,
    TenantDashboardComponent,
    TenantComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    CommonModule,
    TenantRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ImageUploadModule 
  ]
})
export class TenantModule { }
