import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
import * as bcrypt from 'bcryptjs';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private subscription: ISubscription;
  userFormGroup: FormGroup;
  user: User;
  private secret = '66668888666688886666888866668888';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private data: DataService,
    private userService: UserService,
    private toastr: ToastrService, ) {
    this.userFormGroup = this.fb.group({
      pw: this.fb.group(
        {
          passwordConfirm: this.fb.control('', Validators.minLength(8)),
          password: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8)])),
        },
        {
          validator: passwordMatch,
        }
      ),
      phone: '',

    });

  }
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
  ngOnInit() {
    this.subscription = this.data.currentUserResetPass.subscribe(user => {
      if (user == null) {
        this.router.navigate(['/login']);
      }
      else {
        this.user = user;
        this.userFormGroup.get('phone').setValue(this.user.phone);
        this.userFormGroup.controls['phone'].disable();
      }
    })
  }
  ngOnDestroy() {
    this.data.changeUserReset(null);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  onSubmit() {
    if (this.userFormGroup.valid) {
      let user = {
        phone: this.userFormGroup.get('phone').value,
        password: this.userFormGroup.value.pw.password
      }
      this.addLoading();
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.secret, salt, (err, hash) => {
          console.log(hash)
          this.userService.resetPass(user, hash).subscribe(
            res => {
              this.removeLoading();
              let response = JSON.parse('' + res);
              if (response.type == 1) {
                this.showSuccess('Thay đổi mật khẩu thành công');
                this.data.changeUser(user);
                this.router.navigate(['/login']);
              }
              else {
                this.showErr(response.mess);
              }
            },
            err => {
              this.removeLoading();
              this.showErr('Có lỗi sảy ra, vui lòng thử lại sau');
              console.log(err)
            }
          )
        });
      });

    }

  }
}
export function passwordMatch(c: AbstractControl) {
  const v = c.value;
  return v.password === v.passwordConfirm
    ? null
    : {
      passwordnotmatch: true,
    };
}