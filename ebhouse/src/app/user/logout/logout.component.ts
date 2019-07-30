import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {

  constructor(private service: AuthenticationService,
    private router: Router,
    private toastr: ToastrService) { }
    addLoading() {
      $('.customLoading').addClass('preloader');
      $('.customLoader').addClass('loader');
    }
    removeLoading() {
      $('.customLoading').removeClass('preloader');
      $('.customLoader').removeClass('loader');
    }
  ngOnInit() {
    this.addLoading();
    if (this.service.currentUserValue) {
      this.service.logout().subscribe(res => {
        this.removeLoading();
        this.router.navigate(['/home']);
        this.showSuccess('Đăng xuất thành công')
      }, err => {
        this.removeLoading();
        this.router.navigate(['/home']);
        this.showSuccess('Đăng xuất thành công')
      });
    } else {
      this.removeLoading();
      this.router.navigate(['/home']);
      this.showSuccess('Đăng xuất thành công')
    }
    // location.reload(true);
  }
  showSuccess(mess) { 
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }


}



