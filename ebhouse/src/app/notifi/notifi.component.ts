import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Notification } from '../models/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlaceService } from '../service/place.service';
import { AuthenticationService } from '../user/service/authentication.service';
import { NotifiService } from './service/notifi.service';

@Component({
  selector: 'app-notifi',
  templateUrl: './notifi.component.html',
  styleUrls: ['./notifi.component.css']
})
export class NotifiComponent implements OnInit {

  message: Message = {
    content: '',
    type: 0,
  };
  createNotifiFormGroup: FormGroup;
  newNotifi: Notification;
  listUser: any[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: NotifiService
  ) { }

  ngOnInit() {
    this.resetMess();
    this.createNotifiFormGroup = this.fb.group({
      userTo: this.fb.control('', Validators.compose([Validators.required])),
      subject: this.fb.control('', Validators.compose([Validators.required])),
      content: this.fb.control('', Validators.compose([Validators.required]))
    });
  }

  creatNotification(){
    this.service.getUserSend().subscribe(
      res => {
        let response = JSON.parse('' + res);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.listUser = data.listUser;
          console.log(this.listUser);

          $('#modalNotification').modal('show');
        } else {
          this.message.content = response.message;
          this.message.type = 0;
        }
        this.removeLoading();
      },
      err => {
        this.message.content = 'Lỗi';
        this.message.type = 0;
        this.removeLoading();
      }
    );
  }

  myFunction() {
    $('#myDropdown').toggleClass('show-s');
  }

  onSubmit(){}

  disabledClick(){
    return false;
  }

  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }

  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }
}
