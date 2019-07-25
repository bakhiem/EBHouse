import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { EquipmentComponent } from './equipment/equipment.component'

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//material table
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { ImageUploadModule } from 'ng2-imageupload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
//pipe module
import { SharedModule } from '../shared/shared.module';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  declarations: [
    AdminComponent,
    EquipmentComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    ChartsModule,
    SharedModule,
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
export class AdminModule { }
