import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatCheckboxModule } from '@angular/material'; 

import { InformationDialogComponent } from '../../shared/info-dialog/information-dialog.component';
import {CommonMessage} from '../../models/message';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  roleDefault: number = 2;
  CommonMessage = CommonMessage;
  userFormGroup: FormGroup;
  phonePattern = '((09|03|07|08|05)([0-9]{8}))';
  //passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
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
      role: [this.roleDefault],
      phone: this.fb.control('', Validators.compose([Validators.required, Validators.pattern(this.phonePattern)])),
      fullname: this.fb.control('', Validators.compose([Validators.required])),
    });
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
  onSubmit() {
    if(/\s/.test(this.userFormGroup.value.pw.password)){
      this.showErr('Mật khẩu không bao gồm khoảng trắng');
      return;
    }
    if(this.userFormGroup.value.fullname.trim() == ''){
      this.showErr('Họ tên không hợp lệ');
      return;
    }
    this.addLoading();
    console.log(toUserSend(this.userFormGroup.value))
    this.userService.register(toUserSend(this.userFormGroup.value)).subscribe(
      res => {
        this.removeLoading()
        let mess: any;
        mess = JSON.parse('' + res);
        console.log(mess)
        if (mess.type == 1) {
          this.showSuccess(mess.message)
          let userShare = toUser(this.userFormGroup.value);
          userShare.fromRegister = true;
          this.data.changeUser(userShare);
          this.router.navigate(['/verify']);
        }
        if (mess.type == 0) {
          this.showErr(mess.message);
        }
        if (mess.type == 2) {   
          this.dialog.open(InformationDialogComponent, {
            width: '500px',
            data: mess.message
          });
        }
      },
      err => {
        this.removeLoading()
        this.showErr(CommonMessage.defaultErrMess);
        console.log(err);
      }
    );
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

function toUserSend(r: any) {
  let userSend = <any>{
    user: {
      name: r.fullname.trim().replace(/"/g, ""),
      password: r.pw.password,
      phone: r.phone,
    },
    role : r.role
  };
  return userSend;
}

function toUser(r: any): User {
  let userSend = <User>{
    name: r.fullname.trim().replace(/"/g, ""),
    password: r.pw.password,
    role: r.role,
    phone: r.phone,
  };
  return userSend;
}
