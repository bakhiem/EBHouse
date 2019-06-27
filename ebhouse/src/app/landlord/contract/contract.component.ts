import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import * as $AB from 'jquery';
import * as bootstrap from "bootstrap";
import { LandlordService } from '../service/landlord-service.service';

import { Landlord } from '../../models/landlord';
import { BoardingHouse } from '../../models/bh';
import { LandlordComponent } from '../landlord.component';

import { AuthenticationService } from '../../user/service/authentication.service';
import { CommonMessage, Message } from '../../models/message';
import { Observable, throwError } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";
import {Contract,Tenant,ContractTenant,User} from '../../models/contract';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})

export class ContractComponent implements OnInit, OnDestroy {
  currentBh: BoardingHouse;
  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number;
  pageNumbers: number[] = [];
  dataSource = new MatTableDataSource();
  listContract: Contract[];
  listContractFormat: any[] = [];
  displayedColumns: string[] = ['room', 'owner', 'period', 'start', 'end', 'price', 'deposit', 'customColumn'];
  //Message
  message: Message = {
    content: '',
    type: 0
  }
  private subscription: ISubscription;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private authenticationService: AuthenticationService,
    private router: Router) {

  }
  ngOnInit() {
    this.subscription = this.service.currentBh.subscribe((data) => {
      this.currentBh = data;
      this.getContract();
      this.pageNumbers = [];
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getContract() {
    let page: any = {
      status : 1,
      boardingHouseID: this.currentBh.id,
      page: this.currentPage
    }
    this.addLoading();
    this.service.getContract(page).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        console.log(response)
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.listContract  = data.contract;
          this.handleListContract();
          this.totalPage = Math.ceil(data.totalPage / this.perPage);
          this.toArray(this.totalPage);
          console.log(this.listContract);
        }
      }, err => {
        this.errRequestHandle(err);
      })
  }
  createContract(){
    this.router.navigate(['/landlord/contract-create']);
  }
  handleListContract(){
    let contract : any;
    this.listContract.forEach(element => {
      //add to contract
      contract = {
        room : element.room.name,
        start : this.formatDate(element.startDate),
        end : this.formatDate(element.endDate),
        price : element.roomPrice,
        deposit : element.deposit,
      }
      element.lstContractTenant.forEach(element2 => {
        if(element2.isOwner == 1){
          contract.owner = element2.tenant.user.name;
        }
      });
      contract.period = this.calPeriod(contract.start, contract.end);
      this.listContractFormat.push(contract);
      
    });
    this.dataSource.data = this.listContractFormat;
    console.log(this.dataSource.data)
  }
  calPeriod(startMonth, endMonth){
    let monthBegin = startMonth.split('-');
    let monthEnd = endMonth.split('-');
    let month = (Number(monthEnd[2]) - Number(monthBegin[2])) * 12 + (Number(monthEnd[1]) - Number(monthBegin[1]));
    return month + 1;
  }
  formatDate(inputDate){
    let d = inputDate.split(' ');
    let d2 = d[0].split('-');
    return '' + d2[2] + '-' + d2[1]+ '-' + d2[0]
  }
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }


  //edit and delete boarding-house :
  editContract(obj) {


  }
  deleteContract(obj) {
    this.resetMess();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Bạn chắc chắn muốn xóa hợp đồng không ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   let rooms = {
      //     roomID: [obj.id],
      //     boardingHouseID: [this.currentBh.id]
      //   }
      //   this.addLoading();
      //   this.service.deleteRoom(rooms).subscribe(
      //     res => {
      //       this.successRequestHandle(res)
      //     },
      //     err => {
      //       this.errRequestHandle(err)
      //     }
      //   )
      // }
    });
  }
  successRequestHandle(res) {
    let resObject = JSON.parse("" + res);
    if (resObject.type == 1) {
      this.message.type = 1;
      this.message.content = resObject.message;
      this.removeLoading();
      this.getContract();
    }
    else {
      this.message.type = 0;
      this.message.content = resObject.message;
      this.removeLoading();
    }
  }
  errRequestHandle(err) {
    this.message.type = 0;
    this.message.content = CommonMessage.defaultErrMess;
    console.log(err);
    this.removeLoading();
  }
  resetMess() {
    this.message.content = '';
    this.message.type = 0;
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
      this.getContract();
    }
    prePage() {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1
        this.resetMess();
        this.getContract();
      }
    }
  
    nextPage() {
      if (this.currentPage < this.totalPage) {
        this.currentPage = this.currentPage + 1;
        this.resetMess();
        this.getContract();
      }
    }

};






