import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
import { Role } from '../models/role';
import { DataService } from '../service/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from "../service/authentication.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  messageSuccess: string = "";
  messageErr: string = "";
  roleDefault: number = 1;
  phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
  loginFormGroup: FormGroup;
  user: User;

  constructor(
    private ngZone: NgZone,
    private userService: UserService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private data: DataService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.data.currentUser.subscribe(user => this.user = user);
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
    this.messageSuccess = "";
    this.messageErr = "";
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
    if($('#customControlAutosizing').prop("checked")){
       rememberPassword = 1;
    }
    console.log(rememberPassword)
    console.log(toUser(this.loginFormGroup.value));
    this.addLoading();
    this.authenticationService
      .login(toUser(this.loginFormGroup.value),rememberPassword)
      .subscribe(
        res => {
          let mess: any;
          mess = JSON.parse("" + res[0]);
          if (mess.type == 1) {
            //handle when login success
          }
          else if (mess.type == 0) {
            this.removeLoading();
            this.messageErr = mess.message;
          }
          if (res[1]) {
            // window.location.reload();
            this.removeLoading();
           
            this.router.navigate(['/']);  
          }
        },
        err => {
          this.removeLoading();
          console.log(err);
          this.messageErr = "Có lỗi xảy ra";
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
