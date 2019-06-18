import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordDashboardComponent } from './dashboard/dashboard.component';
import { LandlordProfileComponent } from './profile/profile.component';
import { LandlordComponent } from './landlord.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { Role } from '../user/models/role';
import { BhInfoComponent } from './bh-info/bh-info.component';
import { RoomTypeComponent } from './room-type/room-type.component';
import { RoomComponent } from './room/room.component';
const LandlordChildRouters: Routes = [
  {
    path: 'landlord',
    component: LandlordComponent,
    canActivate: [AuthGuard], data: { roles: [Role.Lanlord] },
    children: [
      {
        path: 'dashboard',
        component: LandlordDashboardComponent
      },
      {
        path: 'profile',
        component: LandlordProfileComponent
      },
      {
        path: 'bh-info',
        component: BhInfoComponent
      },
      {
        path: 'room-type',
        component: RoomTypeComponent
      },
      {
        path: 'room',
        component: RoomComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(LandlordChildRouters)
  ],
  exports: [
    RouterModule
  ]

})
export class LandlordRoutingModule { }
