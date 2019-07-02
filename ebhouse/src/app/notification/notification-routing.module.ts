import {NgModule }from '@angular/core';
import {CommonModule }from '@angular/common';
import {NotificationComponent }from './notification.component';
import {FromNotificationComponent }from './from-notification/from-notification.component';
import {ToNotificationComponent }from './to-notification/to-notification.component';
import {Routes, RouterModule }from '@angular/router';

const NotificationChildRouters:Routes = [ {
    path:'notification',
    component:NotificationComponent,
    canActivate:[], data: {},
    children:[ {
        path:'from',
        component:FromNotificationComponent
      },  {
        path:'to',
        component:ToNotificationComponent
      },
    ]
  }
];

@NgModule( {
  imports:[
    RouterModule.forChild(NotificationChildRouters)
  ],
  exports:[
    RouterModule
  ]

})
export class NotificationRoutingModule {}
