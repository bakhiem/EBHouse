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

import { NotifiComponent } from '../notifi.component';

import { ISubscription } from "rxjs/Subscription";
import { CommmonFunction } from '../../shared/common-function';
import { ToastrService } from 'ngx-toastr';
import { SharedServiceService } from '../../service/shared-service.service';
@Component({
  selector: 'app-to-notification',
  templateUrl: './to-notification.component.html',
  styleUrls: ['./to-notification.component.css']
})
export class ToNotificationComponent implements OnInit, OnDestroy {
  notifiListSent: any[] = [];
  notifiListSeen: any[] = [];
  notifiListAnswered: any[] = [];
  notifiList: any[];
  currentNotifi: any;
  currentIndex: any;

  perPage =3;

  currentPageSent: number = 1;
  totalPageSent: number = 0;
  dataSourceSent = new MatTableDataSource();

  currentPageSeen: number = 1;
  totalPageSeen: number=0;
  dataSourceSeen = new MatTableDataSource();

  currentPageAnswered: number = 1;
  totalPageAnswered: number=0;
  dataSourceAnswered = new MatTableDataSource();

  displayedColumns: string[] = ['userTo', 'subject', 'cDate', 'status'];
  displayedColumns2: string[] = ['userTo', 'subject', 'cDate', 'status', 'action'];

  private subscription: ISubscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: NotifiService,
    private parent: NotifiComponent,
    private toastr :  ToastrService,  
     private shareService: SharedServiceService,
  ) { }

  ngOnInit() {
    this.subscription = this.service.listNotification.subscribe((data) => {
      this.getAllFrom();
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  public getAllFrom() {
    this.getNotificationByStatus(0, this.currentPageSent);
    this.getNotificationByStatus(1, this.currentPageSeen);
    this.getNotificationByStatus(2, this.currentPageAnswered);
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  getNotificationByStatus(status : number, currentPage: number) {
    this.addLoading();
    this.service.getAllToNotification({ page: currentPage-1, status : status}).subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          if(response.data != null){
            let data = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data));
            switch(status){
              case 0:
                  this.notifiListSent = data.listNotification;
                  this.totalPageSent = data.totalPage;
                 

                break;
              case 1:
                  this.notifiListSeen = data.listNotification;
                  this.totalPageSeen = data.totalPage;
                break;
              case 2:
                  this.notifiListAnswered = data.listNotification;
                  this.totalPageAnswered = data.totalPage;
                break;
            }
            this.dataSourceSent.data = this.notifiListSent;
            this.dataSourceSeen.data = this.notifiListSeen;
            this.dataSourceAnswered.data = this.notifiListAnswered;
          }
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
    if(status == 0){
      this.service.updateStatus({ id: row.id, status : status+1}).subscribe(
        res => {

          let response = JSON.parse('' + res);
          if (response.type == 1) {
            this.shareService.getNumberNoti().subscribe();
                this.notifiListSent[index].status = 1;
                this.notifiListSeen.unshift(this.notifiListSent[index]);
                this.notifiListSent.splice(index,1);
                this.totalPageSent =this.notifiListSent.length;
                this.totalPageSeen = this.notifiListSeen.length;
          }

          this.dataSourceSent.data = this.notifiListSent;
          this.dataSourceSeen.data = this.notifiListSeen;
          this.dataSourceAnswered.data = this.notifiListAnswered;

        },
        err => {
          this.showErr(CommonMessage.defaultErrMess);
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

  creatNotifications(e : any, i: any){
    this.addLoading();
    this.parent.createNotifiFormGroup.reset();
    this.parent.dataSourceSent.data = [];
    this.parent.listDataSet = [];
    $("#myInput").removeAttr('disabled');
    this.currentNotifi = e;
    this.currentIndex = i;

    this.parent.flag = 1;
    this.parent.currentNotifi = e;
    this.parent.listDataSet.push({ name: e.userFrom.name, option: 'user', id: e.userFrom.id });
    this.parent.dataSourceSent.data = this.parent.listDataSet;
    this.parent.createNotifiFormGroup.get('userTo').setValue(e.userFrom.id);
    this.parent.createNotifiFormGroup.get('userToText').setValue(e.userFrom.name);
    this.parent.createNotifiFormGroup.get('subject').setValue(null);
    this.parent.createNotifiFormGroup.get('content').setValue(null);
    $("#myInput").attr('disabled','disabled');
    $('#modalNotification').modal('show');
    this.removeLoading();
  }

  public updateStatus(){
    this.service.updateStatus({ id:  this.currentNotifi.id, status :  this.currentNotifi.status+1}).subscribe(
      res => {
        let response = JSON.parse('' + res);
        if (response.type == 1) {
          console.log(3);
          this.notifiListSeen[this.currentIndex].status = 2;
          this.notifiListAnswered.unshift(this.notifiListSeen[this.currentIndex]);
          this.notifiListSeen.splice(this.currentIndex,1);
          this.totalPageSent = this.notifiListSent.length;
          this.totalPageSeen = this.notifiListSeen.length;
        }

        this.dataSourceSent.data = this.notifiListSent;
        this.dataSourceSeen.data = this.notifiListSeen;
        this.dataSourceAnswered.data = this.notifiListAnswered;

      },
      err => {
        this.showErr(CommonMessage.defaultErrMess);
        this.removeLoading();
      }
    );
  }

}
