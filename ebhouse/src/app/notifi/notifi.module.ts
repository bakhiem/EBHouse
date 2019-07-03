import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotifiRoutingModule } from './notifi-routing.module';
import { NotifiComponent } from './notifi.component';
import { ToNotificationComponent } from './to-notification/to-notification.component';
import { FromNotificationComponent } from './from-notification/from-notification.component';
import { MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatAutocompleteModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatTableModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadModule } from 'ng2-imageupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [NotifiComponent, ToNotificationComponent, FromNotificationComponent],
  imports: [
    CommonModule,
    NotifiRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    CommonModule,
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
export class NotifiModule { }
