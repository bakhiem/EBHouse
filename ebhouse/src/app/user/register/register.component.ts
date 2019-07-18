import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import {CommonMessage} from '../../models/message';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  roleDefault: number = 1;

  userFormGroup: FormGroup;
  phonePattern = '((09|03|07|08|05)+([0-9]{8}))';
  //passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private toastr: ToastrService
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
      fullname: this.fb.control('', Validators.required),
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
    this.addLoading();
    this.userService.register(toUserSend(this.userFormGroup.value)).subscribe(
      res => {
        this.removeLoading()
        let mess: any;
        mess = JSON.parse('' + res);
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
      name: r.fullname,
      password: r.pw.password,
      phone: r.phone,
    },
  };
  return userSend;
}

function toUser(r: any): User {
  let userSend = <User>{
    name: r.fullname,
    password: r.pw.password,
    role: r.role,
    phone: r.phone,
  };
  return userSend;
}
