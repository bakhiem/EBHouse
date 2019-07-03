import {NgModule }from '@angular/core';
import {CommonModule }from '@angular/common';
import {LandlordComponent }from './landlord.component';
import {FormsModule, ReactiveFormsModule }from '@angular/forms';
import {LandlordProfileComponent }from './profile/profile.component';
import {LandlordDashboardComponent }from './dashboard/dashboard.component';

import {LandlordRoutingModule }from './landlord-routing.module';
import {BhInfoComponent }from './bh-info/bh-info.component';
import {RoomComponent }from './room/room.component';

import {ContractComponent }from './contract/contract.component';

import {MaxLength }from '../pipe/max-leng.pipe';

import {CurrencyFormat }from '../pipe/currency.pipe';
import {RoomTypeComponent }from './room-type/room-type.component';
//material table
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule,MatFormFieldModule ,MatInputModule,MatSelectModule,MatCheckboxModule } from '@angular/material';
import { ImageUploadModule } from 'ng2-imageupload';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CreateContractComponent } from './contract/create-contract/create-contract.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { UpdateContractComponent } from './contract/update-contract/update-contract.component';
import { UtilityComponent } from './utility/utility.component';
import { ElectricComponent } from './electric/electric.component';
@NgModule({
  declarations: [
    LandlordComponent,
    LandlordProfileComponent,
    LandlordDashboardComponent,
    BhInfoComponent,
    RoomTypeComponent,
    RoomComponent,
    MaxLength,
    CurrencyFormat,
    ContractComponent,
    CreateContractComponent,
    UpdateContractComponent,
    UtilityComponent,
    ElectricComponent
  ],
  imports:[
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    CommonModule,
    LandlordRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ImageUploadModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class LandlordModule {}
