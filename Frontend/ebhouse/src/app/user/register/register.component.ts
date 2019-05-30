import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  message: string = "";
  roleDefault: number = 1;

  userFormGroup: FormGroup;
  phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
  //passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  constructor(private userService: UserService,
    private fb: FormBuilder,
    private data: DataService,
    private router: Router) { }

  ngOnInit() {
    this.userFormGroup = this.fb.group({
      pw: this.fb.group({
        passwordConfirm: this.fb.control('', Validators.minLength(8)),
        password: this.fb.control('', Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])),
      }, {
          validator: passwordMatch
        }),
      role: [this.roleDefault],
      phone: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern(this.phonePattern)
      ])),

      fullname: this.fb.control('', Validators.required)
    });
  }

  onSubmit() {
    this.userService
      .register(toUser(this.userFormGroup.value))
      .subscribe(
        res => {
          let mess: any;
          mess = JSON.parse("" + res);
          console.log(mess);
          if (mess.type == 1) {
            this.message = mess.message;
            this.data.changeUser(toUser(this.userFormGroup.value));
            this.router.navigate(['/verify']);
          }
          if (mess.type == 0) {
            this.message = mess.message;
          }

        },
        err => {
          this.message = "Có lỗi sảy ra";
          console.log(err);
        }
      );
  }

}
export function passwordMatch(c: AbstractControl) {
  const v = c.value;
  return (v.password === v.passwordConfirm) ? null : {
    passwordnotmatch: true
  };
}
function toUser(r: any): User {
  let user = <User>({
    name: r.fullname,
    password: r.pw.password,
    role: r.role,
    phone: r.phone
  });
  return user;
}