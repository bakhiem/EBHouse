import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantProfileComponent } from './profile/profile.component';
import { TenantComponent } from './tenant.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guard/authRole.guard';
import { Role } from '../user/models/role';
import { BhInfoComponent } from './bh-info/bh-info.component';
import { ContractComponent } from './contract/contract.component';
import { ContractViewComponent } from './contract/contract-view/contract-view.component';
import { FinancialComponent } from './financial/financial.component';

import { RoomsInfoComponent } from './rooms-info/rooms-info.component';
const TenantChildRouters: Routes = [
  {
    //path: 'landlord/dashboard', component: LandlordComponent 
    path: 'tenant',
    component: TenantComponent,
    canActivate: [AuthGuard], data: { roles: [Role.Tenant] },
    children: [
      {
        path: 'profile',
        component: TenantProfileComponent
      },
      {
        path: 'bh-info',
        component: BhInfoComponent
      },
      {
        path: 'contract',
        component: ContractComponent
      },
      {
        path: 'contract-view',
        component: ContractViewComponent
      },
      {
        path: 'financial',
        component: FinancialComponent
      },
      {
        path: 'rooms-info',
        component: RoomsInfoComponent
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
