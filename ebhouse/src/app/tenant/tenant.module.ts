import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantComponent } from './tenant.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TenantProfileComponent } from './profile/profile.component';
import { TenantDashboardComponent } from './dashboard/dashboard.component';


import { TenantRoutingModule } from './tenant-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//pipe module
import {SharedModule} from '../shared/shared.module';
//material table
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material';
import { ImageUploadModule } from 'ng2-imageupload';
import { BhInfoComponent } from './bh-info/bh-info.component';
import { ContractComponent } from './contract/contract.component';
import { ContractViewComponent } from './contract/contract-view/contract-view.component';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { FinancialComponent } from './financial/financial.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RoomsInfoComponent } from './rooms-info/rooms-info.component';
@NgModule({
  declarations: [
    TenantProfileComponent,
    TenantDashboardComponent,
    TenantComponent,
    BhInfoComponent,
    ContractComponent,
    ContractViewComponent,
    FinancialComponent,
    RoomsInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    SharedModule,
    TenantRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ImageUploadModule 
  ]
})
export class TenantModule { }
