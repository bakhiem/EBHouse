import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-from-notification',
  templateUrl: './from-notification.component.html',
  styleUrls: ['./from-notification.component.css']
})
export class FromNotificationComponent implements OnInit {

  notifiList: any[];

  constructor() { }

  ngOnInit() {
  }

  prePage(){

  }

  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
}
