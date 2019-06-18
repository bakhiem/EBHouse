import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordComponent } from './landlord.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandlordProfileComponent } from './profile/profile.component';
import { LandlordDashboardComponent } from './dashboard/dashboard.component';

import { LandlordRoutingModule } from './landlord-routing.module';
import { BhInfoComponent } from './bh-info/bh-info.component';
import { RoomComponent } from './room/room.component';


import { RoomTypeComponent } from './room-type/room-type.component';
//material table
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material';
import { ImageUploadModule } from 'ng2-imageupload';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    LandlordComponent,
    LandlordProfileComponent,
    LandlordDashboardComponent,
    BhInfoComponent,
    RoomTypeComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    CommonModule,
    LandlordRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ImageUploadModule,
    NgbModule
  ]
})
export class LandlordModule { }
