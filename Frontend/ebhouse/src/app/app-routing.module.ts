import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ConfirmPhoneComponent } from './user/confirm-phone/confirm-phone.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { LandlordDashboardComponent } from './landlord/dashboard/dashboard.component';
import { TenantDashboardComponent } from './tenant/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { Role } from './user/models/role';
import { LandlordComponent } from './landlord/landlord.component';

import { LandlordProfileComponent } from './landlord/profile/profile.component';
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'  },
  { 
    path: 'landlord/:id', 
    component: LandlordComponent, 
    children: [
     { path: ''		, redirectTo: 'dashboard',pathMatch: 'full' },
     { path: 'dashboard', component: LandlordDashboardComponent },
     { path: 'profile'	, component: LandlordProfileComponent }
   ] 
  },
  { path: 'landlord/dashboard', component: LandlordDashboardComponent, canActivate: [AuthGuard], data: { roles: [Role.Lanlord] } },
  { path: 'tenant/dashboard', component: TenantDashboardComponent, canActivate: [AuthGuard], data: { roles: [Role.Tenant] } },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: ConfirmPhoneComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
