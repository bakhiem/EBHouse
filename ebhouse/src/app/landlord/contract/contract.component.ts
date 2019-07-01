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
import { Contract, Tenant, ContractTenant, User } from '../../models/contract';
import { Router } from '@angular/router';

import { map, startWith } from 'rxjs/operators';

import { InformationDialogComponent } from '../../shared/info-dialog/information-dialog.component';
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
  listContractFormat: any[];
  contractStatus: number = 1;
  isSelectAllStatus: number = 0;
  roomList: any[];
  // displayedColumns: string[] = 
  //Message
  message: Message = {
    content: '',
    type: 0
  }
  private subscription: ISubscription;

  //search
  roomControl = new FormControl();
  filteredOptions: Observable<any[]>;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private authenticationService: AuthenticationService,
    private router: Router) {

  }
  getDisplayedColumns(): string[] {
    if(this.isSelectAllStatus == 1){
      return ['room', 'owner', 'period', 'start', 'end', 'price', 'deposit', 'status','customColumn'];
    }
    else{
      return ['room', 'owner', 'period', 'start', 'end', 'price', 'deposit','customColumn'];
    }
  }
  ngOnInit() {
    this.subscription = this.service.currentBh.subscribe((data) => {
      this.currentBh = data;
      this.getContract();
      this.getRoomsFromCurrentBh();
      this.pageNumbers = [];
    })
    
  }
  displayDialog(message : string){
    this.dialog.open(InformationDialogComponent, {
      width: '400px',
      data: message
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getContract() {
    let page: any = {
      status: Number(this.contractStatus),
      boardingHouseID: this.currentBh.id,
      page: this.currentPage,
      roomID : this.roomControl.value ? this.roomControl.value.id : 0
    }
    if(this.contractStatus == 4){
      this.isSelectAllStatus = 1;
    }
    else{
      this.isSelectAllStatus = 0;
    }
    console.log(page);
    this.addLoading();
    this.service.getContract(page).subscribe(
      res => {
        let response = JSON.parse("" + res);
        console.log(response)
        if (response.type == 1) {
          try {
            let data = JSON.parse(response.data);
            this.listContract = data.contract;
            this.handleListContract();
            this.totalPage = Math.ceil(data.totalPage / this.perPage);
            this.toArray(this.totalPage);
          } catch (error) {
            console.log(response)
            this.errRequestHandle(error);
          }
        }
        this.removeLoading();
      }, err => {
        this.errRequestHandle(err);
      })
  }

  // search contract by room
  getRoomsFromCurrentBh() {
    this.resetMess();
    let data: any = {
      boardingHouseID: this.currentBh.id
    }
    this.addLoading();
    this.service.getRoomsAvailable(data).subscribe(
      res => {
        this.removeLoading();
        console.log(res)
        try {
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            let data = response.data;
            console.log(data)
            let elementAll = {
              name : 'Tất cả',
              id : 0
            }
            data.unshift(elementAll);
            this.roomList = data;
            if (this.roomList.length == 0) {
              // this.message.content = CommonMessage.BhHaveNoRoom;
              // this.message.type = 0;
            }
            this.filteredOptions = this.roomControl.valueChanges
              .pipe(
                startWith(''),
                map(value => {
                  if (value) {
                    if (typeof (value) === 'string') {
                      return value
                    }
                    else {
                      return value.name
                    }
                  }
                }),
                map(name => name ? this._filter(name) : this.roomList.slice())
              );
          }
        } catch (error) {

        }

      }, err => {
        this.removeLoading();
        console.log(err);
      })
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.roomList.filter(roomList => roomList.name.toLowerCase().indexOf(filterValue) === 0);
  }
  displayFn(room?: any): string | undefined {
    return room ? room.name : undefined;
  }
  
  searchByRoom(){
    let isValid = 0;
    if(!this.roomControl.value){
      this.roomControl.setValue(this.roomList[0]);
      this.getContract();
      return;
    }
    this.roomList.forEach(element => {
      if (element.name == this.roomControl.value || element.name == this.roomControl.value.name) {
        this.roomControl.setValue(element);
        isValid = 1;
        this.getContract();
        return;
      }
    });
    console.log(this.roomControl.value)
    if(isValid == 0){
      this.displayDialog('Không tồn tại phòng');
    }
  }

  createContract() {
    this.router.navigate(['/landlord/contract-create']);
  }
  handleListContract() {
    this.listContractFormat = [];
    let contract: any;
    this.listContract.forEach(element => {
      //add to contract
      contract = {
        room: element.room.name,
        start: this.formatDate(element.startDate),
        end: this.formatDate(element.endDate),
        price: element.roomPrice,
        deposit: element.deposit,
      }
      if(element.status == '1'){
        contract.status = 'Còn hạn'
      }
      else if(element.status == '2'){
        contract.status = 'Hết hạn'
      }
      else if(element.status == '3'){
        contract.status = 'Chờ xử lý'
      }
      element.lstContractTenant.forEach(element2 => {
        if (element2.isOwner == 1) {
          contract.owner = element2.tenant.user.name;
        }
      });
      contract.period = this.calPeriod(contract.start, contract.end);
      this.listContractFormat.push(contract);

    });
    this.dataSource.data = this.listContractFormat;
    console.log(this.dataSource.data)
  }
  calPeriod(startMonth, endMonth) {
    let monthBegin = startMonth.split('-');
    let monthEnd = endMonth.split('-');
    let month = (Number(monthEnd[2]) - Number(monthBegin[2])) * 12 + (Number(monthEnd[1]) - Number(monthBegin[1]));
    return month + 1;
  }
  formatDate(inputDate) {
    let d = inputDate.split(' ');
    let d2 = d[0].split('-');
    return '' + d2[2] + '-' + d2[1] + '-' + d2[0]
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
    this.service.changeCOntract(this.listContract[obj]);
    this.router.navigate(['/landlord/contract-update']);
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
  errRequestHandle(err?) {
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






