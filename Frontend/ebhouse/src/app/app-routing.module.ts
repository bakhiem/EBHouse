import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ConfirmPhoneComponent } from './user/confirm-phone/confirm-phone.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { AuthGuard } from './guard/auth.guard';
import { Role } from './user/models/role';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: [Role.Lanlord] } },
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