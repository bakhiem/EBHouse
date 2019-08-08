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
import { Router } from '@angular/router';

import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapterMonth } from '../contract/customDate';
import { SharedServiceService } from '../../service/shared-service.service';
import { InformationDialogComponent } from '../../shared/info-dialog/information-dialog.component';

import { RedirectDialogComponent } from '../../shared/redirect-dialog/redirect-dialog.component';
@Component({
  selector: 'app-manage-tenant',
  templateUrl: './manage-tenant.component.html',
  styleUrls: ['./manage-tenant.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapterMonth }
  ]
})


export class ManageTenantComponent implements OnInit, OnDestroy {
  currentBh: BoardingHouse;
  //paging
  perPage: number = 5;
  currentPage: number = 1;
  totalPage: number = 0;

  dataSource = new MatTableDataSource();
  listTenant: any[];
  listTenantDisplay: any[];
  listTenantDisplayFormat: any[];
  contractStatus: number = 1;


  private subscription: ISubscription;
  //search
  month: FormControl;
  roomList: any[];
  roomControl = new FormControl();
  tenantControl = new FormControl();
  filteredOptions: Observable<any[]>;
  filteredOptionsRoom: Observable<any[]>;
  constructor(
    private shareService: SharedServiceService,
    public dialog: MatDialog,
    private service: LandlordService,
    private router: Router,
    private toastr: ToastrService) {

  }
  displayedColumns = ['name', 'phone', 'room', 'sex','date', 'address', 'customColumn'];

  chooseMonth(params, datepicker) {
    params.setDate(1);
    this.month.setValue(params);
    this.currentPage = 1;
    this.getTenant();
    datepicker.close();
  }

  ngOnInit() {
    this.month = new FormControl({ value: new Date(), disabled: true });
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.getTenantFromCurrentBh();
        this.getTenant();
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
    this.resetFormAndGetTenant();
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

  formatDate(): string {
    let month = this.month.value.getMonth() + 1;
    let year = this.month.value.getFullYear();
    return year + '-' + month
  }
  formatDateFull(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }
  resetModal(){
    $('#tenant-detail-name').html('');
    $('#tenant-phone').html('');
    $('#tenant-address').html('');
    $('#tenant-rooms').html('');
    $('#imgArnFront').attr('src','');
    $('#imgArnBack').attr('src','');
    $('#tenant-date').html('');
  }
  viewDetail(data) {
    this.resetModal();
    $('#tenant-detail-name').html(data.name);
    $('#tenant-phone').html(data.phone);
    $('#tenant-address').html(data.address);
    $('#tenant-rooms').html(data.listRoom);
    if(data.date_of_birth && data.date_of_birth.toLowerCase() != 'null'){
      $('#tenant-date').html(this.formatDateFull(data.date_of_birth));
    }
    if (data.imgArnFront) {
      $('#imgArnFront').attr('src', data.imgArnFront.trim() + "?date=" + new Date().getTime());
    }
    if (data.imgArnBack) {
      $('#imgArnBack').attr('src', data.imgArnBack.trim() + "?date=" + new Date().getTime());
    }
    $('#modal2').modal('show');

  }

  getTenant() {
    if (!this.currentBh || !this.currentBh.id) {
      return;
    }
    let page: any = {
      boardingHouseID: this.currentBh.id,
      page: this.currentPage,
      userID: this.tenantControl.value ? this.tenantControl.value.id : 0,
      date: this.formatDate() + '-01',
      roomID: this.roomControl.value ? this.roomControl.value.id : 0,
    }
    this.addLoading();
    this.service.getTenant(page).subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          try {
            if (response.data.length > 0) {
              let totalPage = response.data.pop();
              this.listTenantDisplay = response.data;
              this.handlelistTenantDisplay();
              this.totalPage = totalPage.totalRecord;
              console.log(this.listTenantDisplay)
            }
            else {
              this.listTenantDisplay = [];
              this.dataSource.data = [];
            }
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
  //search room
  getRoomsFromCurrentBh() {
    if (!this.currentBh || !this.currentBh.id) {
      return;
    }
    let data: any = {
      boardingHouseID: this.currentBh.id,
      date: this.formatDate() + '-01',
    }
    this.service.getRoomsAvailable(data).subscribe(
      res => {
        try {
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            let data = response.data;
            let elementAll = {
              name: 'Tất cả',
              id: 0
            }
            data.unshift(elementAll)
            this.roomList = data;
            this.filteredOptionsRoom = this.roomControl.valueChanges
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
                map(name => name ? this._filterRoom(name) : this.roomList.slice())
              );
          }
        } catch (error) {

        }
      }, err => {

        console.log(err);
      })
  }

  // search contract by room
  getTenantFromCurrentBh() {
    if (!this.currentBh || !this.currentBh.id) {
      return;
    }
    let data: any = {
      boardingHouseID: this.currentBh.id
    }
    this.service.getAllTenant(data).subscribe(
      res => {
        console.log(res)
        try {
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            this.listTenant = response.data;
            let elementAll = {
              name: 'Tất cả',
              id: 0
            }
            this.listTenant.unshift(elementAll);
            console.log(this.listTenant)
            this.filteredOptions = this.tenantControl.valueChanges
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
                map(name => name ? this._filter(name) : this.listTenant.slice())
              );
          }
        } catch (error) {

        }
      }, err => {
        console.log(err);
      })
  }

  //view contract disable

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.listTenant.filter(listTenant => listTenant.name.toLowerCase().indexOf(filterValue) === 0);
  }
  displayFn(room?: any): string | undefined {
    return room ? room.name : undefined;
  }
  private _filterRoom(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.roomList.filter(roomList => roomList.name.toLowerCase().indexOf(filterValue) === 0);
  }
  resetFormAndGetTenant() {
    this.currentPage = 1;
    this.getTenant();
  }
  searchByTenant() {
    if (this.isValidRoom() == true && this.isValidTenant() == true) {
      this.resetFormAndGetTenant()
    }
    else {
      this.displayDialog('Mời chọn phòng & khách thuê trong danh sách')
    }
  }
  isValidTenant(): boolean {
    let isvalid = false;
    if (!this.tenantControl.value) {
      this.tenantControl.setValue(this.listTenant[0]);
      isvalid = true;
      return isvalid;
    }
    this.listTenant.forEach(element => {
      if (element.name == this.tenantControl.value || element.name == this.tenantControl.value.name) {
        this.tenantControl.setValue(element);
        isvalid = true;
        return isvalid;
      }
    });
    return isvalid;
  }
  isValidRoom(): boolean {
    let isvalid = false;
    if (!this.roomControl.value) {
      this.roomControl.setValue(this.roomList[0]);
      isvalid = true;
      return isvalid;
    }
    this.roomList.forEach(element => {
      if (element.name == this.roomControl.value || element.name == this.roomControl.value.name) {
        this.roomControl.setValue(element);
        isvalid = true;
        return isvalid;
      }
    });
    return isvalid;
  }
  handlelistTenantDisplay() {
    this.listTenantDisplay.forEach(tenant => {
      //add to contract
      let roomStr = '';
      for (let index = 0; index < tenant.room.length; index++) {
        const element = tenant.room[index];
        roomStr += element.name + ',';
      }
      let formatRooms = roomStr.substring(0, roomStr.length - 1);
      tenant.listRoom = formatRooms;
      if(tenant.address && tenant.address.length > 0){
        let address = tenant.address.split('-');
        if (address[0].length == 0) {
          tenant.address = address[1] + '-' + address[2] + '-' + address[3]
        }
      }
     
    });
    this.dataSource.data = this.listTenantDisplay;
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
    this.getTenant();
  }


};






