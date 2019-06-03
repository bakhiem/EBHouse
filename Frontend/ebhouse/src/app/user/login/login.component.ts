import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
import { DataService } from '../service/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from "../service/authentication.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message: string = "";
  roleDefault: number = 1;
  phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
  loginFormGroup: FormGroup;
  user: User;

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private data : DataService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }
  
  ngOnInit() {
    this.data.currentUser.subscribe(user => this.user = user);
    this.loginFormGroup = this.fb.group({
      phone: this.fb.control((this.user)? this.user.phone : "", Validators.compose([
        Validators.required,
        Validators.pattern(this.phonePattern)
      ])),

      password: this.fb.control((this.user)? this.user.password : "", Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ]))
    });
  }

  onSubmit() {
    console.log(toUser(this.loginFormGroup.value));
    this.authenticationService
    .login(toUser(this.loginFormGroup.value))
    .subscribe(
      res => {
        let mess: any;
        mess = JSON.parse("" + res);
        if (mess.type == 1) {
          this.message = mess.message;
        }
        if (mess.type == 0) {
          this.message = mess.message;
        }
        
      },
      err => {
        this.message = "Có lỗi xảy ra";
          console.log(err);
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
