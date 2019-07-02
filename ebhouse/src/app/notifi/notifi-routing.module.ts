import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotifiComponent } from './notifi.component';
import { AuthGuard } from '../guard/auth.guard';
import { FromNotificationComponent } from './from-notification/from-notification.component';
import { ToNotificationComponent } from './to-notification/to-notification.component';

const routes: Routes = [
  {
    path:'notification',
    component:NotifiComponent,
    canActivate:[AuthGuard],
    children:[ {
        path:'from',
        component:FromNotificationComponent
      },  {
        path:'to',
        component:ToNotificationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotifiRoutingModule { }
