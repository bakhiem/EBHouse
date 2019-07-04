import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CommonMessage, Message } from '../../models/message';
import { AuthenticationService } from '../../user/service/authentication.service';
import * as $ from 'jquery';
import { NotifiService } from '../service/notifi.service';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-from-notification',
  templateUrl: './from-notification.component.html',
  styleUrls: ['./from-notification.component.css'],
})
export class FromNotificationComponent implements OnInit {
  message: Message = {
    content: '',
    type: 0,
  };
  notifiList: any[];
  currentNotifi: any;
  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number;
  pageNumbers: number[] = [];
  displayedColumns: string[] = ['userTo', 'subject', 'cDate', 'status'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: NotifiService
  ) {}

  ngOnInit() {
    this.resetMess();
    this.getAllFrom();
  }

  getAllFrom() {
    this.addLoading();
    this.service.getAllFromNotification({ page: this.currentPage - 1 }).subscribe(
      res => {
        let response = JSON.parse('' + res);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.notifiList = data.listNotification;
          this.totalPage = Math.ceil(data.totalPage / this.perPage);
          this.toArray(this.totalPage);
        } else {
          this.message = JSON.parse(response.message);
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

  notificationDetail(index : number){
    console.log(this.notifiList[index]);
  }

  formatData(data: any[]) {
    data.forEach(element => {
      let notifi = new Notification();
      notifi.userTo = element.userTo;
      notifi.subject = element.subject;
      notifi.content = element.content;
      notifi.cDate = element.cDate;
      notifi.status = element.status;
      this.notifiList.push(notifi);
    });
  }

  show(){
    if($('.showDetails').hasClass('in') == true){
      $('.showDetails').removeClass('in');
      $('.showDetail').attr('aria-expanded', 0);
    }else{
      $('.showDetails').addClass('in');
      $('.showDetail').attr('aria-expanded', 1);
    }
  }

 //paging
 toArray = function (num: number) {
    this.pageNumbers = [];
    for (let i = 1; i <= num; i++) {
      this.pageNumbers[i - 1] = i;
    }
  }
  goToPage(page: any) { // without type info
    this.currentPage = page;
    this.resetMess();
    this.getAllFrom();
  }
  prePage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
      this.resetMess();
      this.getAllFrom();
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.resetMess();
      this.getAllFrom();
    }
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
