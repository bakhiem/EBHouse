import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { WindowService } from '../service/window.service';
import { UserService } from '../service/user.service';
import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-confirm-phone',
  templateUrl: './confirm-phone.component.html',
  styleUrls: ['./confirm-phone.component.css']
})
export class ConfirmPhoneComponent implements OnInit {
  windowRef: any;
  phoneNumber: string;
  verificationCode: string;
  user: User;
  verifyFormGroup: FormGroup;
  message: string;
  constructor(private win: WindowService,
    private router: Router,
    private fb: FormBuilder,
    private data: DataService,
    private userService: UserService
  ) { }
  ngAfterViewInit() {
    disableButtonOTPBeforeVerify();
    
  }
  ngOnInit() {
    this.data.currentUser.subscribe(user => this.user = user);
    //after register, add user to data service, if don't have data service is fake url and redirect to login.
    if (this.user == null) {
      this.router.navigate(['/login']);
    }
    this.verifyFormGroup = this.fb.group({
      phone: { value: (this.user)? formatPhone(this.user.phone) : "", disabled: true },
      otpcode: ''
    });
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
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',{
      'callback': (response) => {
          enableButtonOTPBeforeVerify();
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        
      }
    });
    this.windowRef.recaptchaVerifier.render();
    
  }
  sendLoginCode() {
    disableButton();
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = "" + formatPhone(this.user.phone);
    console.log(num);
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch(error => console.log(error));
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verifyFormGroup.value.otpcode)
      .then(result => {
        if (result.user != null) {
          this.submit();
        }
      })
      .catch(error => {
        this.message = "Sai mã OTP";
        console.log(error, "Incorrect code entered?");

      });
  }
  submit() {
    this.userService
      .submit(this.user)
      .subscribe(
        res => {
          let mess: any;
          mess = JSON.parse("" + res);
          console.log(mess);
          if (mess.type == 1) {
            this.message = mess.message;
            this.router.navigate(['/login']);
          }
          if (mess.type == 0) {
            this.message = mess.message;
          }
        },
        err => {
          console.log(err);
          this.message = "Có lỗi sảy ra";
        }
      );
  }

}

function disableButtonOTPBeforeVerify() {
  var button = <HTMLInputElement>document.querySelector("button.btn.btn-outline-secondary");
  button.disabled = true;
}

function enableButtonOTPBeforeVerify() {
  
  var button = <HTMLInputElement>document.querySelector("button.btn.btn-outline-secondary");
  button.disabled = false;
  
}


function disableButton() {
  var button = <HTMLInputElement>document.querySelector("button.btn.btn-outline-secondary");
  button.disabled = true;
  incTimer();
  setTimeout(function () {
    button.disabled = false;
  }, 30000);
}

function formatPhone(phone: String) {
  let formatPhone = phone;
  formatPhone = formatPhone.slice(1);
  formatPhone = "+84" + formatPhone;
  return formatPhone;
}

let countdownNum = 30;

function incTimer() {
  setTimeout(function () {
    if (countdownNum != 0) {
      countdownNum--;
      document.querySelector('button.btn.btn-outline-secondary').innerHTML = 'Thời gian còn lại ' + countdownNum + ' giây';
      incTimer();
    } else {
      document.querySelector('button.btn.btn-outline-secondary').innerHTML = 'Gửi lại mã';
      countdownNum = 30;
    }
  }, 1000);
}
