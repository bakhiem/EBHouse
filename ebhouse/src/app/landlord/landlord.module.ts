import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordComponent } from './landlord.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandlordProfileComponent } from './profile/profile.component';
import { LandlordDashboardComponent } from './dashboard/dashboard.component';

import { LandlordRoutingModule } from './landlord-routing.module';
import { BhInfoComponent } from './bh-info/bh-info.component';
import { RoomComponent } from './room/room.component';

import { ContractComponent } from './contract/contract.component';

import { RoomTypeComponent } from './room-type/room-type.component';
//material table
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { ImageUploadModule } from 'ng2-imageupload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateContractComponent } from './contract/create-contract/create-contract.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { UpdateContractComponent } from './contract/update-contract/update-contract.component';
import { UtilityComponent } from './utility/utility.component';
import { ElectricComponent } from './electric/electric.component';
import { ExtraFeeComponent } from './extra-fee/extrafee.component';
import { FinancialComponent } from './financial/financial.component';
import { OtherFinancialComponent } from './financial/other-financial/other-financial.component';
//pipe module
import { SharedModule } from '../shared/shared.module';
import { RoomActivityComponent } from './room/room-activity/room-activity.component';
import { ManageTenantComponent } from './manage-tenant/manage-tenant.component';
import {ChartsModule} from 'ng2-charts';
@NgModule({
  declarations: [
    LandlordComponent,
    LandlordProfileComponent,
    LandlordDashboardComponent,
    BhInfoComponent,
    RoomTypeComponent,
    RoomComponent,
    ContractComponent,
    CreateContractComponent,
    UpdateContractComponent,
    UtilityComponent,
    ElectricComponent,
    ExtraFeeComponent,
    FinancialComponent,
    OtherFinancialComponent,
    RoomActivityComponent,
    ManageTenantComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    ChartsModule,
    CommonModule, 
    SharedModule,
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
export class LandlordModule { }
