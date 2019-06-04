import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantProfileComponent } from './profile/profile.component';
import { TenantDashboardComponent } from './dashboard/dashboard.component';

import { TenantComponent } from './tenant.component';
@NgModule({
  declarations: [TenantProfileComponent,
    TenantDashboardComponent,
    TenantComponent],
  imports: [
    CommonModule
  ]
})
export class TenantModule { }
