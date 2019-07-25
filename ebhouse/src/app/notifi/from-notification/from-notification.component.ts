import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { CommmonFunction } from '../../shared/common-function';
@Component({
  selector: 'app-from-notification',
  templateUrl: './from-notification.component.html',
  styleUrls: ['./from-notification.component.css'],
})
export class FromNotificationComponent implements OnInit,OnDestroy{
  listNotification: any = 1;
  notifiListSent: any[] = [];
  notifiListSeen: any[] = [];
  notifiListAnswered: any[] = [];
  notifiList: any[];
  currentNotifi: any;

  perPage = 10;

  currentPageSent: number = 1;
  totalNotifiSent: number = 0;
  dataSourceSent = new MatTableDataSource();

  currentPageSeen: number = 1;
  totalNotifiSeen: number = 0;
  dataSourceSeen = new MatTableDataSource();

  currentPageAnswered: number = 1;
  totalNotifiAnswered: number = 0;
  dataSourceAnswered = new MatTableDataSource();

  displayedColumns: string[] = ['userTo', 'subject', 'cDate', 'status'];
  displayedColumns2: string[] = ['userTo', 'subject', 'cDate', 'mDate', 'status'];

  private subscription: ISubscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: NotifiService,
    private toastr : ToastrService
  ) {}

  ngOnInit() {
    // this.getAllFrom();
    this.subscription = this.service.listNotification.subscribe((data) => {
      this.getAllFrom();
    })
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
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
        let response = JSON.parse("" + CommmonFunction.escapeSpecialChars(res));
        if (response.type == 1) {
          if(response.data != null){
            let data = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data));
            switch(status){
              case 0:
                  this.notifiListSent = data.listNotification;
                  this.totalNotifiSent = data.totalPage;
                break;
              case 1:
                  this.notifiListSeen = data.listNotification;
                  this.totalNotifiSeen = data.totalPage;
                break;
              case 2:
                  this.notifiListAnswered = data.listNotification;
                  this.totalNotifiAnswered = data.totalPage;
                break;
            }
          }
          this.dataSourceSent.data = this.notifiListSent;
          this.dataSourceSeen.data = this.notifiListSeen;
          this.dataSourceAnswered.data = this.notifiListAnswered;
        } else {
          this.showErr(response.message);
        }
        this.removeLoading();
      },
      err => {
        this.showErr(CommonMessage.defaultErrMess);
        this.removeLoading();
      }
    );
  }

  notificationDetail( status : number, index : number, row : any){
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

  pageChanged(page, status) {
    switch(status){
      case 0:
            this.currentPageSent = page;
            this.getNotificationByStatus(status, this.currentPageSent);
      break;
    case 1:
          this.currentPageSeen = page;
          this.getNotificationByStatus(status, this.currentPageSeen);
      break;
    case 2:
          this.currentPageAnswered = page;
          this.getNotificationByStatus(status,this.currentPageAnswered);
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
}
