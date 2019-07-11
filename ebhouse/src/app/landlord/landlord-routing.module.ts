import {NgModule }from '@angular/core';
import {CommonModule }from '@angular/common';
import {LandlordDashboardComponent }from './dashboard/dashboard.component';
import {LandlordProfileComponent }from './profile/profile.component';
import {LandlordComponent }from './landlord.component';
import {Routes, RouterModule }from '@angular/router';
import {AuthGuard }from '../guard/authRole.guard';
import {Role }from '../user/models/role';
import {BhInfoComponent }from './bh-info/bh-info.component';
import {RoomTypeComponent }from './room-type/room-type.component';
import {RoomComponent }from './room/room.component';
import {ContractComponent }from './contract/contract.component';
import {CreateContractComponent }from './contract/create-contract/create-contract.component';
import { UpdateContractComponent } from './contract/update-contract/update-contract.component';
import { ElectricComponent } from './electric/electric.component';
import {UtilityComponent }from './utility/utility.component';
import { ExtraFeeComponent } from './extra-fee/extrafee.component';
import { FinancialComponent } from './financial/financial.component';
import { OtherFinancialComponent } from './financial/other-financial/other-financial.component';
const LandlordChildRouters:Routes = [ {
    path:'landlord',
    component:LandlordComponent,
    canActivate:[AuthGuard], data: {roles:[Role.Lanlord] },
    children:[ {
        path:'dashboard',
        component:LandlordDashboardComponent
      },  {
        path:'profile',
        component:LandlordProfileComponent
      },  {
        path:'bh-info',
        component:BhInfoComponent
      },  {
        path:'room-type',
        component:RoomTypeComponent
      },  {
        path:'room',
        component:RoomComponent
      },  {
        path:'contract',
        component:ContractComponent
      },  {
        path:'contract-create',
        component:CreateContractComponent
      },  {
        path:'contract-update',
        component:UpdateContractComponent
      },  {
        path:'utility',
        component:UtilityComponent
      }
      ,
      {
        path: 'electric',
        component: ElectricComponent
      },
      {
        path: 'extrafee',
        component: ExtraFeeComponent
      },
      {
        path: 'financial',
        component: FinancialComponent
      },
      {
        path: 'other-financial',
        component: OtherFinancialComponent
      }
    ]
  }
];

@NgModule( {
  imports:[
    RouterModule.forChild(LandlordChildRouters)
  ],
  exports:[
    RouterModule
  ]

})
export class LandlordRoutingModule {}
