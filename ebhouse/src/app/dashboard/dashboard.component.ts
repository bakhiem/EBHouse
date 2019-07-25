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
  currentUser: any;
  statusUpdateProfile: string = "2";
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
    this.authenticationService.removeLocalUser();
    this.router.navigate(['/home'])
  }
  ngOnInit() {
    this.checkRole();
    console.log(this.currentUser);
  }
  ngAfterViewInit() {
   
  }
  checkRole() {
    if (this.isLandlord) {
      if (this.currentUser.user.status == this.statusUpdateProfile) {
        this.router.navigate(['/landlord/profile']);
      }
      else {
        this.router.navigate(['/landlord/bh-info']);
      }
    }
    else if (this.isTenant) {
      if (this.currentUser.user.status == this.statusUpdateProfile) {
        this.router.navigate(['/tenant/profile']);
      }
      else {
        this.router.navigate(['/tenant/bh-info']);
      }
    }
    else {
      console.log("delete in dashboard")
      this.deleteDataInLocal();
    }
  }
}
