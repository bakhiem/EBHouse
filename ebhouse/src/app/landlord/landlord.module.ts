import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordComponent } from './landlord.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandlordProfileComponent } from './profile/profile.component';
import { LandlordDashboardComponent } from './dashboard/dashboard.component';

import { LandlordRoutingModule } from './landlord-routing.module';
import { BhInfoComponent } from './bh-info/bh-info.component';

//material table
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material';
import { ImageUploadModule } from 'ng2-imageupload';
@NgModule({
  declarations: [
    LandlordComponent,
    LandlordProfileComponent,
    LandlordDashboardComponent,
    BhInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    CommonModule,
    LandlordRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ImageUploadModule 
  ]
})
export class LandlordModule { }
