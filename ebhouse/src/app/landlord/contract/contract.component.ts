import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

import { LandlordService } from '../service/landlord-service.service';

import { BoardingHouse } from '../../models/bh';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../user/service/authentication.service';

import { CommmonFunction } from '../../shared/common-function';
import { CommonMessage, Message } from '../../models/message';
import { Observable, throwError } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";
import { Contract } from '../../models/contract';
import { Router } from '@angular/router';

import { map, startWith } from 'rxjs/operators';

import { SharedServiceService } from '../../service/shared-service.service';
import { InformationDialogComponent } from '../../shared/info-dialog/information-dialog.component';

import { RedirectDialogComponent } from '../../shared/redirect-dialog/redirect-dialog.component';
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
  listContract: Contract[];
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
    private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private authenticationService: AuthenticationService,
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
        this.getRoomsFromCurrentBh();
      } else if (this.currentBh) {
        this.showInfo(CommonMessage.InputBh)
      }
    })
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

  onchangeStatus() {
    this.resetFormAndGetContract();
  }
  displayDialog(message: string) {
    this.dialog.open(InformationDialogComponent, {
      width: '400px',
      data: message
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getContract() {
    if (!this.currentBh || !this.currentBh.id) {
      return;
    }
    let page: any = {
      status: Number(this.contractStatus),
      boardingHouseID: this.currentBh.id,
      page: this.currentPage,
      roomID: this.roomControl.value ? this.roomControl.value.id : 0
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
        console.log(response)
        if (response.type == 1) {
          try {
            let data = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data));
            this.listContract = data.contract;
            this.handleListContract();
            this.totalPage = data.totalPage
            console.log(this.listContract)
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
    if (!this.currentBh || !this.currentBh.id) {
      return;
    }
    let data: any = {
      boardingHouseID: this.currentBh.id
    }
    this.service.getRoomsAvailable(data).subscribe(
      res => {
        console.log(res)
        try {
          let response = JSON.parse("" + res);
          if (response.type == 1) {
           
            let data = response.data;
            console.log(data)
            let elementAll = {
              name: 'Tất cả',
              id: 0
            }
            data.unshift(elementAll);
            this.roomList = data;
            this.getContract();
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
        console.log(err);
      })
  }
  getRoomName(roomId): string {
    for (let index = 0; index < this.roomList.length; index++) {
      const element = this.roomList[index];
      if (element.id == roomId) {
        return element.name;
      }
    }
    return '';
  }
  //view contract disable
  viewOnlyContract(obj) {
    this.service.changeCOntract(this.listContract[obj]);
    this.router.navigate(['/landlord/contract-update']);
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.roomList.filter(roomList => roomList.name.toLowerCase().indexOf(filterValue) === 0);
  }
  displayFn(room?: any): string | undefined {
    return room ? room.name : undefined;
  }
  resetFormAndGetContract() {
    this.currentPage = 1;
    this.getContract();
  }
  searchByRoom() {
    let isValid = 0;
    if (!this.roomControl.value) {
      this.roomControl.setValue(this.roomList[0]);
      this.resetFormAndGetContract();
      return;
    }
    this.roomList.forEach(element => {
      if (element.name == this.roomControl.value || element.name == this.roomControl.value.name) {
        this.roomControl.setValue(element);
        isValid = 1;
        this.resetFormAndGetContract();
        return;
      }
    });
    console.log(this.roomControl.value)
    if (isValid == 0) {
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
        room:  this.getRoomName(element.room.id),
        start: this.formatDate(element.startDate),
        end: this.formatDate(element.endDate),
        price: element.roomPrice,
        deposit: element.deposit,
        status: element.status
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: "Bạn chắc chắn muốn xóa hợp đồng không ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(this.listContract[obj])
      if (result) {
        let data = {
          contract: [
            {
              room: { id: Number(this.listContract[obj].room.id) },
              id: this.listContract[obj].id,
              roomPrice: this.listContract[obj].roomPrice,
              deposit: this.listContract[obj].deposit,
              description: this.listContract[obj].description.trim().replace(/"/g, "\\\""),
              startDate: this.listContract[obj].startDate,
              contractImg : this.listContract[obj].contractImg,
              endDate: this.listContract[obj].endDate,
            }
          ]
        }
        console.log(data)
        this.addLoading();
        this.service.deleteContract(data).subscribe(
          res => {
            let resObject = JSON.parse("" + res);
            if (resObject.type == 1) {
              this.showSuccess(resObject.message);
              this.removeLoading();
              this.getContract();
            }
            else if (resObject.type == 2) {
              this.removeLoading();
              const dialogRefElectric = this.dialog.open(RedirectDialogComponent, {
                width: '400px',
                data: CommonMessage.InputElectricBefore
              });
              dialogRefElectric.afterClosed().subscribe(result => {
                if (result) {
                  this.router.navigate(['/landlord/electric']);
                }
              })
            }
            else if (resObject.type == 3) {
              this.removeLoading();
              const dialogRefFinancial = this.dialog.open(RedirectDialogComponent, {
                width: '400px',
                data: resObject.message
              });
              dialogRefFinancial.afterClosed().subscribe(result => {
                if (result) {
                  let roomID = this.listContract[obj].room.id;
                  this.router.navigate(['/landlord/financial',roomID]);
                }
              })
            }
          },
          err => {
            this.errRequestHandle(err)
          }
        )
      }
    });
  }
  successRequestHandle(res) {
    let resObject = JSON.parse("" + res);
    if (resObject.type == 1) {
      this.showSuccess(resObject.message)
      this.removeLoading();
      this.getContract();
    }
    else {

      this.showErr(resObject.message)
      this.removeLoading();
    }
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






