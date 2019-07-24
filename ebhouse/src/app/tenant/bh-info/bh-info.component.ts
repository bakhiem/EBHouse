import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { DataService } from '../../user/service/data.service';
import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CommonMessage, Message } from '../../models/message';
import { TenantServiceService } from '../service/tenant-service.service';
import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import { Tenant } from '../../models/tenant';
import { Calculating, Utility } from '../../models/utility';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { ISubscription } from "rxjs/Subscription";

import { SharedServiceService } from '../../service/shared-service.service';
@Component({
  selector: 'app-bh-info',
  templateUrl: './bh-info.component.html',
  styleUrls: ['./bh-info.component.css']
})
export class BhInfoComponent implements OnInit, OnDestroy {
  listUtility: Utility[] = [
    { id: 1, name: 'Điện', calculating: [{ id: 3, name: "Theo số" }] },
    { id: 2, name: 'Nước', calculating: [{ id: 1, name: "Theo phòng" }, { id: 2, name: "Theo người" }] },
    { id: 3, name: 'Internet', calculating: [{ id: 1, name: "Theo phòng" }, { id: 2, name: "Theo người" }] },
    { id: 4, name: 'Vệ sinh', calculating: [{ id: 1, name: "Theo phòng" }, { id: 2, name: "Theo người" }] }
  ];
  list: any[];
  currentBh: any;
  private subscription: ISubscription;
  constructor(private shareService: SharedServiceService,
    private service: TenantServiceService,
    private toastr: ToastrService) { }
  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe()
    }
  }
  ngOnInit() {
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.getBhInfo();
        this.getUtility();
      }
      else if (this.currentBh) {
        this.showInfo(CommonMessage.TenantNoBh)
      }
    })
  }
  getBhInfo() {
    let data = {
      boardingHouseID: this.currentBh.id
    }
    this.addLoading();
    this.service.getBhInfo(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse('' + res);
        if (response.type == 1) {
          let resObject = response.data[0];
          $('#bh-name').val(resObject.bhName);
          $('#bh-address').val(resObject.bhAddress);
          $('#bh-landlord-name').val(resObject.landlordName);
          $('#bh-landlord-phone').val(resObject.landlordPhone);
          $('#bh-landlord-address').val(resObject.landlordAddress);
          $('#bh-description').val(resObject.bhDescription);
        } else {

        }

      },
      err => {
        this.showErr(CommonMessage.defaultErrMess);
        this.removeLoading();
      }
    );
  }

  private getUtility() {
    let data = {
      boardingHouseID: this.currentBh.id
    }
    this.addLoading();
    this.service.getUtility(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let resData = JSON.parse(response.data);
          console.log(resData)
          this.list = resData;
          //if have list utility
          if (this.list.length > 0) {
            for (let index = 0; index < this.list.length; index++) {
              let currency = this.list[index].value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
              $('#price-' + this.list[index].utility).val(currency);
              $("#select-" + this.list[index].utility).val(this.list[index].calculatingMethod);
            }
            $("input[type=submit]").attr("disabled", "disabled");
          }

          //if bh didn't have list utility
          else {

          }
        }
      }, err => {
        this.removeLoading();
        console.log(err);
      })
  }


  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }

  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  showInfo(mess) {
    this.toastr.info(mess, 'Thông báo !');
  }
}
