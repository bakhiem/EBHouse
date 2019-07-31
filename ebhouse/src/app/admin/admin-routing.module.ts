import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentComponent } from './equipment/equipment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard }from '../guard/authRole.guard';
import { Role }from '../user/models/role';
import { AdminComponent } from './admin.component';

const routes: Routes = [{
  path:'admin',
  component:AdminComponent,
  canActivate:[AuthGuard], data: {roles:[Role.Admin] },
  children:[ {
    path:'equipment',
    component:EquipmentComponent
  },
  {
    path:'dashboard',
    component:DashboardComponent
  }
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
