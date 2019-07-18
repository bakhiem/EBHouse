import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../service/data.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { WindowService } from '../service/window.service';
import { UserService } from '../service/user.service';
import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ISubscription } from "rxjs/Subscription";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-confirm-phone',
  templateUrl: './confirm-phone.component.html',
  styleUrls: ['./confirm-phone.component.css']
})

export class ConfirmPhoneComponent implements OnInit, OnDestroy {
  windowRef: any;
  phoneNumber: string;
  verificationCode: string;
  user: User;
  userPhone : string;
  verifyFormGroup: FormGroup;
  phonePattern = '((09|03|07|08|05)+([0-9]{8}))';
  fromRegis : boolean = false;
  private subscription: ISubscription;
  constructor(private win: WindowService,
    private router: Router,
    private fb: FormBuilder,
    private data: DataService,
    private userService: UserService,
    private toastr: ToastrService,
  ) { }
  ngAfterViewInit() {
    disableButtonOTPBeforeVerify();
  }
  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    this.reset();
  }

  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  ngOnInit() {
   this.subscription =  this.data.currentUser.subscribe(user => {
      this.user = user
      if (this.user == null) {
        this.verifyFormGroup = this.fb.group({
          phone: this.fb.control('', Validators.compose([Validators.required, Validators.pattern(this.phonePattern)])),
          otpcode: ''
        });
      }
      else {
        if (this.user.fromRegister == true) {
          this.fromRegis = true;
          this.verifyFormGroup = this.fb.group({
            phone: { value: (this.user) ? this.user.phone : "", disabled: true },
            otpcode: ''
          });
        }
      }
      var firebaseConfig = {
        apiKey: "AIzaSyByYbJ4m91-JrXamkGSmAP6sQbePsjb0Sc",
        authDomain: "ebhouse-666d3.firebaseapp.com",
        databaseURL: "https://ebhouse-666d3.firebaseio.com",
        projectId: "ebhouse-666d3",
        storageBucket: "ebhouse-666d3.appspot.com",
        messagingSenderId: "37350427217",
        appId: "1:37350427217:web:b58c559557f49517"
      };
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      else {
        this.reset();
      }
      this.windowRef = this.win.windowRef;
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'callback': (response) => {
          enableButtonOTPBeforeVerify();
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.

        }
      });
      this.windowRef.recaptchaVerifier.render();
    });
    //after register, add user to data service, if don't have data service is fake url and redirect to login.




  }
  sendLoginCode() {
    if (this.verifyFormGroup.get('phone').value) {
      this.userPhone = this.verifyFormGroup.get('phone').value;
      if (this.verifyFormGroup.valid) {
        $('.otpInput').show();
        disableButton();
        const appVerifier = this.windowRef.recaptchaVerifier;
        const num = "" + formatPhone(this.userPhone);
        firebase.auth().signInWithPhoneNumber(num, appVerifier)
          .then(result => {
            this.windowRef.confirmationResult = result;
          })
          .catch(error => console.log(error));
      }
      else {
        this.showErr('Số điện thoại không đúng định dạng')
      }

    }
    else {
      this.showErr('Mời nhập vào số điện thoại')
    }
  }

  verifyLoginCode() {
    if (this.verifyFormGroup.value.otpcode.length == 0) {
      this.showErr("Điền vào phần nhập mã OTP")
      return;
    }
    this.windowRef.confirmationResult
      .confirm(this.verifyFormGroup.value.otpcode)
      .then(result => {
        if (result.user != null) {
          if(this.fromRegis){
            this.submit();
          }
          else{
            this.sendToChangePassword();
          }
        }
      })
      .catch(error => {
        this.showErr( "Sai mã OTP")
        console.log(error, "Incorrect code entered?");
      });
  }
  submit() {
    this.userService
      .submit(toUserSend(this.user))
      .subscribe(
        res => {
          let mess: any;
          mess = JSON.parse("" + res);
          if (mess.type == 1) {
            this.showSuccess(mess.message)
            this.reset();
            this.data.changeUser(null);
            this.router.navigate(['/login']);
          }
          if (mess.type == 0) {
            this.showErr(mess.message)
          }
        },
        err => {
          console.log(err);
          this.showErr( "Có lỗi xảy ra")
        }
      );
  }
  sendToChangePassword(){
    let user = {
      phone : this.userPhone
    }
    this.data.changeUserReset(user);
    this.router.navigate(['/reset-pass']);
  }
  public reset() {
    disableButtonOTPBeforeVerify();
    clearTimeout(otpTimeOut);
    clearTimeout(buttonTimeOut);
    countdownNum = 30;
  }
}
function toUserSend(r: any) {
  let userSend = <any>{
    user: {
      name: r.name,
      password: r.password,
      phone: r.phone
    },
    role: r.role
  };
  return userSend;
}
let countdownNum = 30;
function disableButtonOTPBeforeVerify() {
  $('button.btn.btn-outline-secondary').prop('disabled', true);
  $('.otpInput').hide();
}

function enableButtonOTPBeforeVerify() {
  $('button.btn.btn-outline-secondary').prop('disabled', false);
  $('#recaptcha-container').hide();

}

var otpTimeOut, buttonTimeOut;
function disableButton() {
  $('button.btn.btn-outline-secondary').prop('disabled', true);
  incTimer();
  buttonTimeOut = setTimeout(function () {
    $('button.btn.btn-outline-secondary').prop('disabled', false);
    $('#recaptcha-container').show();
    $('.otpInput').hide();
  }, 30000);
}

function formatPhone(phone: String) {
  let formatPhone = phone;
  formatPhone = formatPhone.slice(1);
  formatPhone = "+84" + formatPhone;
  return formatPhone;
}



function incTimer() {
  otpTimeOut = setTimeout(function () {
    if (countdownNum != 0) {
      countdownNum--;
      document.querySelector('button.btn.btn-outline-secondary').innerHTML = 'Gửi lại mã sau ' + countdownNum + ' giây';
      incTimer();
    } else {
      document.querySelector('button.btn.btn-outline-secondary').innerHTML = 'Gửi lại mã';
      countdownNum = 30;
    }
  }, 1000);
}
