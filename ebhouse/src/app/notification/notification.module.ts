import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FromNotificationComponent } from './from-notification/from-notification.component';
import { ToNotificationComponent } from './to-notification/to-notification.component';

@NgModule({
  declarations: [FromNotificationComponent, ToNotificationComponent],
  imports: [
    CommonModule
  ]
})
export class NotificationModule { }
