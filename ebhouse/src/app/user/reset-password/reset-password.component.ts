import { Component, OnInit,OnDestroy } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private subscription: ISubscription;
  userFormGroup: FormGroup;
  user : User;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private data: DataService,
    private userService: UserService,
    private toastr: ToastrService,) { }

  ngOnInit() {
    this.subscription =  this.data.currentUserResetPass.subscribe(user => {
      if(user == null){
        this.router.navigate(['/login']);
      }
      else{
        this.user = user;
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
          phone: { value: (this.user) ? this.user.phone : "", disabled: true },
    
        });
      }
    })
  }
  ngOnDestroy() {
    this.data.changeUserReset(null)
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  onSubmit(){
    if(this.userFormGroup.valid){
      
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