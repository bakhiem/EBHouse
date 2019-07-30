import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
import { Role } from '../models/role';
import { DataService } from '../service/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from "../service/authentication.service";
import { ToastrService } from 'ngx-toastr';
import { CommonMessage } from '../../models/message';
import { ISubscription } from "rxjs/Subscription";
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  CommonMessage = CommonMessage;
  roleDefault: number = 1;
  phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
  loginFormGroup: FormGroup;
  user: User;

  private subscription: ISubscription;
  constructor(
    public dialog: MatDialog,
    private ngZone: NgZone,
    private userService: UserService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private data: DataService,
    private toastr: ToastrService, ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }
  ngOnDestroy() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.subscription = this.data.currentUser.subscribe(user => this.user = user);
    this.loginFormGroup = this.fb.group({
      phone: this.fb.control((this.user) ? this.user.phone : "", Validators.compose([
        Validators.required,
        Validators.pattern(this.phonePattern)
      ])),
      password: this.fb.control((this.user) ? this.user.password : "", Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ]))
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
    let rememberPassword = 0;
    if ($('#customControlAutosizing').prop("checked")) {
      rememberPassword = 1;
    }
    this.addLoading();
    this.authenticationService
      .login(toUser(this.loginFormGroup.value), rememberPassword)
      .subscribe(
        res => {
          let mess: any;
          mess = JSON.parse("" + res[0]);
          if (mess.type == 1) {
            this.removeLoading();
            this.router.navigate(['/']);
            this.showSuccess(mess.message)
          }
          else if (mess.type == 0) {
            this.removeLoading();
            this.showErr(mess.message)
          }
          else if (mess.type == 3) {
            this.removeLoading();
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              width: '400px',
              data: mess.message
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.router.navigate(['/verify', this.loginFormGroup.value.phone]);
              }
            });
          }
        },
        err => {
          this.removeLoading();
          console.log(err);
          this.showErr(CommonMessage.defaultErrMess);
        }
      );
  }
}

function toUser(r: any): User {
  let user = <User>({
    password: r.password,
    phone: r.phone
  });
  return user;
}
