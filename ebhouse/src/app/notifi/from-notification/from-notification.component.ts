import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CommonMessage, Message } from '../../models/message';
import { AuthenticationService } from '../../user/service/authentication.service';
// import * as $ from 'jquery';
import { NotifiService } from '../service/notifi.service';
import { Notification } from 'src/app/models/notification';

import { ISubscription } from "rxjs/Subscription";

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
  listNotification: any = 1;
  notifiListSent: any[] = [];
  notifiListSeen: any[] = [];
  notifiListAnswered: any[] = [];
  notifiList: any[];
  currentNotifi: any;
  //paging
  perPage: number = 10;

  currentPageSent: number = 1;
  totalPageSent: number;
  pageNumbersSent: number[] = [];
  dataSourceSent = new MatTableDataSource();

  currentPageSeen: number = 1;
  totalPageSeen: number;
  pageNumbersSeen: number[] = [];
  dataSourceSeen = new MatTableDataSource();

  currentPageAnswered: number = 1;
  totalPageAnswered: number;
  pageNumbersAnswered: number[] = [];
  dataSourceAnswered = new MatTableDataSource();

  displayedColumns: string[] = ['userTo', 'subject', 'cDate', 'status'];
  displayedColumns2: string[] = ['userTo', 'subject', 'cDate', 'mDate', 'status'];

  private subscription: ISubscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: NotifiService
  ) {}

  ngOnInit() {
    this.resetMess();
    // this.getAllFrom();
    this.subscription = this.service.listNotification.subscribe((data) => {
      this.getAllFrom();
    })
  }

  public getAllFrom() {
    this.getNotificationByStatus(0, this.currentPageSent);
    this.getNotificationByStatus(1, this.currentPageSeen);
    this.getNotificationByStatus(2, this.currentPageAnswered);
  }

  getNotificationByStatus(status : number, currentPage: number) {
    this.addLoading();
    this.service.getAllFromNotification({ page: currentPage-1, status : status}).subscribe(
      res => {
        let response = JSON.parse('' + res);
        console.log(response);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          switch(status){
            case 0:
                this.notifiListSent = data.listNotification;
                this.totalPageSent = Math.ceil(data.totalPage / this.perPage);
                this.toArray(this.totalPageSent, status);
              break;
            case 1:
                this.notifiListSeen = data.listNotification;
                this.totalPageSeen = Math.ceil(data.totalPage / this.perPage);
                this.toArray(this.totalPageSeen, status);
              break;
            case 2:
                this.notifiListAnswered = data.listNotification;
                this.totalPageAnswered = Math.ceil(data.totalPage / this.perPage);
                this.toArray(this.totalPageAnswered, status);
              break;
          }
          this.dataSourceSent.data = this.notifiListSent;
          this.dataSourceSeen.data = this.notifiListSeen;
          this.dataSourceAnswered.data = this.notifiListAnswered;
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

  notificationDetail( status : number, index : number, row : any){
    if(status == 0){
      this.service.updateStatus({ id: row.id, status : status+1}).subscribe(
        res => {
          let response = JSON.parse('' + res);
          if (response.type == 1) {
                this.notifiListSent[index].status = 1;
                this.notifiListSeen.push(this.notifiListSent[index]);
                this.notifiListSent.splice(index,1);
                this.totalPageSent = Math.ceil(this.notifiListSent.length / this.perPage);
                this.toArray(this.totalPageSent, status);
                this.totalPageSeen = Math.ceil(this.notifiListSeen.length / this.perPage);
                this.toArray(this.totalPageSeen, status+1);
          }

          this.dataSourceSent.data = this.notifiListSent;
          this.dataSourceSeen.data = this.notifiListSeen;
          this.dataSourceAnswered.data = this.notifiListAnswered;

        },
        err => {
          this.message.content = 'Lỗi';
          this.message.type = 0;
          this.removeLoading();
        }
      );
    }

    let noti = null;
    switch(status){
      case 0:
          noti = this.notifiListSent[index];
        break;
      case 1:
          noti = this.notifiListSeen[index];
        break;
      case 2:
          noti = this.notifiListAnswered[index];
        break;
    }
    $('#detailNotification #notifi_userTo').text(noti.userTo.name);
    $('#detailNotification #notifi_subject').text(noti.subject);
    $('#detailNotification #notifi_content').text(noti.content);
    $('#detailNotification #notifi_cDate').text(noti.cDate);
    switch(noti.status){
      case 0:
          $('#detailNotification #notifi_status').text('Đã gửi');
        break;
      case 1:
          $('#detailNotification #notifi_status').text('Đã nhận');
        break;
      case 2:
          $('#detailNotification #notifi_status').text('Đã trả lời');
        break;
    }
    $('#modalShowNotification').modal('show');
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

 //paging
  toArray = function (num: number, status: number) {
  switch(status){
    case 0:
        this.pageNumbersSent = [];
        for (let i = 1; i <= num; i++) {
          this.pageNumbersSent[i - 1] = i;
        }
      break;
    case 1:
        this.pageNumbersSeen = [];
        for (let i = 1; i <= num; i++) {
          this.pageNumbersSeen[i - 1] = i;
        }
      break;
    case 2:
        this.pageNumbersAnswered = [];
        for (let i = 1; i <= num; i++) {
          this.pageNumbersAnswered[i - 1] = i;
        }
      break;
    }

  }
  goToPage(status:number, page: any) {
    switch(status){
      case 0:
        this.currentPageSent = page;
      break;
    case 1:
        this.currentPageSeen = page;
      break;
    case 2:
        this.currentPageAnswered = page;
      break;
    }
    this.resetMess();
    this.getNotificationByStatus(status, page);
  }
  prePage(status:number) {
    switch(status){
      case 0:
          if (this.currentPageSent > 1) {
            this.currentPageSent = this.currentPageSent - 1;
            this.resetMess();
            this.getNotificationByStatus(status, this.currentPageSent);
          }
      break;
    case 1:
        if (this.currentPageSeen > 1) {
          this.currentPageSeen = this.currentPageSeen - 1;
          this.resetMess();
          this.getNotificationByStatus(status, this.currentPageSeen);
        }
      break;
    case 2:
        if (this.currentPageAnswered > 1) {
          this.currentPageAnswered = this.currentPageAnswered - 1
          this.resetMess();
          this.getNotificationByStatus(status,this.currentPageAnswered);
        }
      break;
    }
  }
  nextPage(status:number) {
    switch(status){
      case 0:
          if (this.currentPageSent < this.totalPageSent) {
            this.currentPageSent = this.currentPageSent + 1;
            this.resetMess();
            this.getNotificationByStatus(status, this.currentPageSent);
          }
      break;
    case 1:
        if (this.currentPageSeen < this.totalPageSeen) {
          this.currentPageSeen = this.currentPageSeen + 1;
          this.resetMess();
          this.getNotificationByStatus(status, this.currentPageSeen);
        }
      break;
    case 2:
        if (this.currentPageAnswered < this.totalPageAnswered) {
          this.currentPageAnswered = this.currentPageAnswered + 1
          this.resetMess();
          this.getNotificationByStatus(status,this.currentPageAnswered);
        }
      break;
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
