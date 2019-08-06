import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { TenantServiceService } from '../service/tenant-service.service';

import { BoardingHouse } from '../../models/bh';
import { ToastrService } from 'ngx-toastr';
import { CommonMessage } from '../../models/message';
import { Observable, throwError } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";
import { Contract } from '../../models/contract';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../service/shared-service.service';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})

export class ContractComponent implements OnInit, OnDestroy {
  currentBh: BoardingHouse;
  //paging
  perPage: number = 5;
  currentPage: number = 1;
  totalPage: number = 0;

  dataSource = new MatTableDataSource();
  listContract: any[];
  listContractFormat: any[];
  contractStatus: number = 1;
  isSelectAllStatus: number = 0;
  roomList: any[];


  private subscription: ISubscription;

  //search
  roomControl = new FormControl();
  filteredOptions: Observable<any[]>;
  constructor(
    private shareService: SharedServiceService,
    private service: TenantServiceService,
    private router: Router,
    private toastr: ToastrService) {

  }
  getDisplayedColumns(): string[] {
    if (this.isSelectAllStatus == 1) {
      return ['room', 'owner', 'period', 'start', 'end', 'price', 'deposit', 'status', 'customColumn'];
    }
    else {
      return ['room', 'owner', 'period', 'start', 'end', 'price', 'deposit', 'customColumn'];
    }
  }
  ngOnInit() {
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.currentPage = 1;
        this.getContract();
      }
      

    })
  }

  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }

  onchangeStatus() {
    this.resetFormAndGetContract();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getContract() {
    let page: any = {
      status: Number(this.contractStatus),
      boardingHouseID: this.currentBh.id,
      page: this.currentPage
    }
    if (this.contractStatus == 5) {
      this.isSelectAllStatus = 1;
    }
    else {
      this.isSelectAllStatus = 0;
    }
    this.addLoading();
    this.service.getContract(page).subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          try {

            if (response.data.length > 0) {
              let totalPage = response.data.pop();
              this.listContract = response.data;
              this.totalPage = totalPage.totalRecord
              this.handleListContract();
            }
            else{
              this.listContract = [];
              this.listContractFormat = [];
              this.dataSource.data = [];
            }

          } catch (error) {
            this.errRequestHandle(error);
          }
        }
        this.removeLoading();
      }, err => {
        this.errRequestHandle(err);
      })
  }



  //view contract disable
  viewOnlyContract(obj) {
    this.service.changeContract(this.listContract[obj]);
    this.router.navigate(['/tenant/contract-view']);
  }

  resetFormAndGetContract() {
    this.currentPage = 1;
    this.getContract();
  }

  handleListContract() {
    this.listContractFormat = [];
    let contract: any;
    this.listContract.forEach(element => {
      //add to contract
      contract = {
        room: element.roomName,
        start: this.formatDateDisplay(element.start_date),
        end: this.formatDateDisplay(element.end_date),
        price: element.room_price,
        deposit: element.deposit,
        status: element.status,
        owner: element.owner
      }
      if (element.status == 1) {
        contract.statusStr = 'Còn hạn'
      }
      else if (element.status == 2) {
        contract.statusStr = 'Hết hạn'
      }
      else if (element.status == 3) {
        contract.statusStr = 'Chờ xử lý'
      }
      else if (element.status == 4) {
        contract.statusStr = 'Đã hủy'
      }
      contract.period = this.calPeriod(contract.start, contract.end);
      this.listContractFormat.push(contract);

    });
    this.dataSource.data = this.listContractFormat;
  }
  calPeriod(startMonth, endMonth) {
    let monthBegin = startMonth.split('-');
    let monthEnd = endMonth.split('-');
    let month = (Number(monthEnd[2]) - Number(monthBegin[2])) * 12 + (Number(monthEnd[1]) - Number(monthBegin[1]));
    return month + 1;
  }
  formatDateDisplay(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }

  errRequestHandle(err?) {
    this.showErr(CommonMessage.defaultErrMess)
    console.log(err);
    this.removeLoading();
  }

  //paging
  pageChanged(page) {
    this.currentPage = page;
    this.getContract();
  }


};






