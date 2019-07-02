import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Notification } from '../models/notification';
import { FormGroup } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {
  }

  creatNotification(){
    $('#modalNotification').modal('show');
  }

  onSubmit(){}

  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
}
