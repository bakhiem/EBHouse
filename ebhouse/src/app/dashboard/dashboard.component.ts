import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user/models/user';
import { AuthenticationService } from '../user/service/authentication.service';
import { Role } from '../user/models/role';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { 
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  get isLandlord() {
    return (this.currentUser && this.currentUser.role === Role.Lanlord);
  }
 get isTenant() {
    return (this.currentUser && this.currentUser.role === Role.Tenant);
  }
  deleteDataInLocal() {
    this.authenticationService.logout();
  }
  ngOnInit() {
      if(this.isLandlord){
        this.router.navigate(['/landlord/dashboard']);
      }
      else if(this.isTenant){
        this.router.navigate(['/tenant/dashboard']);
      }
      else{
        console.log("delete")
        this.deleteDataInLocal();
        this.router.navigate(['/login']);
      }
  }

}