import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantDashboardComponent } from './dashboard/dashboard.component';
import { TenantProfileComponent } from './profile/profile.component';
import { TenantComponent } from './tenant.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { Role } from '../user/models/role';
const TenantChildRouters: Routes = [
  {
    //path: 'landlord/dashboard', component: LandlordComponent 
    path: 'tenant',
    component: TenantComponent,
    canActivate: [AuthGuard], data: { roles: [Role.Tenant] },
    children: [
      {
        path: 'dashboard',
        component: TenantDashboardComponent
      },
      {
        path: 'profile',
        component: TenantProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(TenantChildRouters)
  ],
  exports: [
    RouterModule
  ]

})
export class TenantRoutingModule { }
