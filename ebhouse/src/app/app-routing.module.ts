import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ConfirmPhoneComponent } from './user/confirm-phone/confirm-phone.component';

import { LogoutComponent } from './user/logout/logout.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
const routes: Routes = [
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: ConfirmPhoneComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'reset-pass', component: ResetPasswordComponent },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
