import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentComponent } from './equipment/equipment.component';
import { AuthGuard }from '../guard/authRole.guard';
import { Role }from '../user/models/role';

const routes: Routes = [{
  path:'admin',
  component:EquipmentComponent,
  canActivate:[AuthGuard], data: {roles:[Role.Admin] },
  children:[ {
    path:'equipment',
    component:EquipmentComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
