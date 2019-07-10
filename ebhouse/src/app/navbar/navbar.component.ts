import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user/models/user';
import { AuthenticationService } from '../user/service/authentication.service';
import { Role } from '../user/models/role';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  role: string = '';
  currentUser: any;
  statusUpdateProfile: string = "2";
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {

  }

  getRole() {
    if (this.currentUser && this.currentUser.role === Role.Lanlord) {
      this.role = 'landlord';
    }
    else if (this.currentUser && this.currentUser.role === Role.Tenant) {
      this.role = 'tenant';
    }
    else {
      this.role = ''
    }

    setTimeout(() => {
      console.log($('#menu'));
        (<any>$("#menu")).metisMenu();
        this.jqueryCode();
      }, 500);
  }
  
  jqueryCode() {
    $('.custom-expand-menu').on('click', function () {
      if ($('.page-container').hasClass("sbar_collapsed")) {
        $('.page-container').removeClass('sbar_collapsed')
      }
    });
  }
  ngAfterViewInit() {
    $.getScript('../../assets/js/metisMenu.min.js');
    $.getScript('../../assets/js/popper.min.js');

  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
      this.getRole();
    });


    // if (this.isLandlord) {
    //   if (this.currentUser.user.status == this.statusUpdateProfile) {
    //     this.router.navigate(['/landlord/profile']);
    //   }
    //   else {
    //     this.router.navigate(['/landlord/dashboard']);
    //   }
    // }
    // else if (this.isTenant) {
    //   if (this.currentUser.user.status == this.statusUpdateProfile) {
    //     this.router.navigate(['/tenant/profile']);
    //   }
    //   else {
    //     this.router.navigate(['/tenant/dashboard']);
    //   }

    // }
    // else {
    //   console.log("delete")
    //   this.deleteDataInLocal();
    //   this.router.navigate(['/login']);
    // }
  }
}
