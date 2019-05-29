import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../user.service';
import {User} from '../user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error : number = 0;
  roleDefault : number = 1;
  phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
  loginFormGroup : FormGroup;
  constructor(private userService: UserService,
    private fb : FormBuilder) { }

  ngOnInit() {
    this.loginFormGroup =  this.fb.group({
      phone : this.fb.control('',Validators.compose([
        Validators.required,
        Validators.pattern(this.phonePattern)
      ]) ),

      password: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ]))
    });
  }
  
  onSubmit(){
    console.log(toUser(this.loginFormGroup.value));
    // this.userService
    // .login(toUser(this.loginFormGroup.value))
    // .subscribe(
    //   res => {
    //     this.error = -1;
    //     console.log(res);
    //     //let r = JSON.parse(res['_body'])
    //   },
    //   err => {
    //     this.error = 2;
    //     console.log(err);
    //   }
    // );
  }

  
}
function toUser(r:any): User{
  console.log(r);
  let user = <User>({
   password: r.pw.password,
   phone : r.phone
 });
 return user;
}
