import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordComponent } from './landlord.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandlordProfileComponent } from './profile/profile.component';
import { LandlordDashboardComponent } from './dashboard/dashboard.component';

import { LandlordRoutingModule } from './landlord-routing.module';
@NgModule({
  declarations: [
    LandlordComponent,
    LandlordProfileComponent,
    LandlordDashboardComponent
  ],
  imports: [
    CommonModule,
    LandlordRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class LandlordModule { }
