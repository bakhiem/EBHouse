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

  ngOnInit() {
    if (this.service.currentUserValue) {
      this.service.logout().subscribe(res => {
        this.router.navigate(['/home'])
      }, err => {
        this.router.navigate(['/home'])
      });
    } else {
      this.router.navigate(['/home'])
    }
    this.showSuccess('Đăng xuất thành công')


    // location.reload(true);
  }
  showSuccess(mess) { 
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }


}



