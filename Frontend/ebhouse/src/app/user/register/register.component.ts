import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../user';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  error: number = 0;
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
    this.data.changeUser(toUser(this.userFormGroup.value));
    this.router.navigate(['/phone-confirm']);

    // this.userService
    // .register(toUser(this.userFormGroup.value))
    // .subscribe(
    //   res => {
    //     this.error = -1;
    //     console.log(res);
    //     //let r = JSON.parse(res['_body'])
    //     this.data.changeUser(toUser(this.userFormGroup.value));
    //     this.router.navigate(['/phone-confirm']);  
    //   },
    //   err => {
    //     this.error = 2;
    //     console.log(err);
    //   }
    // );
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