import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LandlordService } from '../../service/landlord-service.service';
import { ISubscription } from "rxjs/Subscription";
import { MatTableDataSource } from '@angular/material/table';
import { SharedServiceService } from '../../../service/shared-service.service';
import { MatDialog, MatCheckboxModule } from '@angular/material';

import { CommmonFunction } from '../../../shared/common-function';
import { CommonMessage, Message } from '../../../models/message';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { InformationDialogComponent } from '../../../shared/info-dialog/information-dialog.component';
import { CustomDateAdapterMonth } from '../../contract/customDate';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-other-financial',
  templateUrl: './other-financial.component.html',
  styleUrls: ['./other-financial.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapterMonth }
  ]
})
export class OtherFinancialComponent implements OnInit, OnDestroy {


  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number = 0;

  dataSourceExtra = new MatTableDataSource();
  dataSourceElectric = new MatTableDataSource();
  //paging electric
  currentPageElectric: number = 1;
  totalPageElectric: number = 0;

  private subscription: ISubscription;
  currentBh: any;
  listOtherExtrafee: any[] = [];
  listOtherElectric: any[] = [];
  roomList: any[];
  roomControl = new FormControl();
  listExtraFee: any[] = [];
  filteredOptions: Observable<any[]>;
  isEdit: number;
  currentRoom: any;
  constructor(private service: LandlordService,
    private shareService: SharedServiceService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) { }
  maxDate = new Date();
  month: FormControl;
  eMonth = this.maxDate.getMonth();
  pMonth = this.maxDate.getMonth() + 1;
  displayedColumnsExtraFee: string[] = ['room', 'amount', 'description', 'date'];
  displayedColumnsElectric: string[] = ['room', 'eLast', 'ePresent', 'usage', 'amount'];
  ngOnInit() {
    this.month = new FormControl({ value: new Date(), disabled: true });
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.getRoomsFromCurrentBh();
        
        
      }
      else if(this.currentBh){
        this.showInfo(CommonMessage.InputBh)
      } 


    });
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  chooseMonth(params, datepicker) {
    params.setDate(1);
    this.month.setValue(params);
    this.eMonth = params.getMonth();
    this.pMonth = params.getMonth() + 1;
    this.getFinancial();
    datepicker.close();
  }
  displayDialog(message: string) {
    this.dialog.open(InformationDialogComponent, {
      width: '400px',
      data: message
    });
  }

  formatDate(): string {
    let month = this.month.value.getMonth() + 1;
    let year = this.month.value.getFullYear();
    return year + '-' + month
  }
  getRoomName(roomId): string {
    for (let index = 0; index < this.roomList.length; index++) {
      const element = this.roomList[index];
      // console.log('element.id' +element.id  );
      // console.log('room.id' + roomId  );
      if (element.id == roomId) {
        return element;
      }
    }
    return '';
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
  getFinancial() {
    if(!this.currentBh.id){
      return;
    }
    let data: any = {
      boardingHouseID: this.currentBh.id,
      date: this.formatDate() + '-01',
      page: this.currentPage,
      roomID: this.roomControl.value ? this.roomControl.value.id : 0
    }
    console.log(data);
    this.addLoading();
    this.service.geOthertFinancial(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);

        if (response.type == 1) {
          this.listOtherElectric = [];
          console.log(response.data)
          let eValue = response.data.valuePerElectricity;
          let resDataExtra = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data.extraFee));
          let resDataElectricNew = JSON.parse(response.data.electricityNew);
          let resDataElectricOld = JSON.parse(response.data.electricityOld);
          this.listOtherExtrafee = resDataExtra.extraFee;
          for (let index = 0; index < this.listOtherExtrafee.length; index++) {
            const element = this.listOtherExtrafee[index];
            let roomObj = this.getRoomName(element.room);
            this.listOtherExtrafee[index].roomObj = roomObj;
          }
          this.dataSourceExtra.data = this.listOtherExtrafee;
          let listElectricNew = resDataElectricNew;
          let listElectricOld = resDataElectricOld;

          for (let index = 0; index < listElectricNew.length; index++) {
            let roomObj = this.getRoomName(listElectricNew[index].room);
            let eLast = listElectricOld[index].total;
            let ePresent = listElectricNew[index].total;
            let elm = {
              roomObj: roomObj,
              eLast: eLast,
              ePresent: ePresent,
              usage: Number(ePresent) - Number(eLast),
              amount: (Number(ePresent) - Number(eLast)) * eValue
            }
            this.listOtherElectric.push(elm);
          }
          this.dataSourceElectric.data = this.listOtherElectric;
          this.totalPageElectric = response.data.totalPageElectricity;
          console.log(listElectricNew)
          console.log(listElectricOld)
          this.totalPage = resDataExtra.totalPage;

        }
      }, err => {
        this.errRequestHandle(err)
      })
  }

  errRequestHandle(err) {
    this.showErr(CommonMessage.defaultErrMess);
    console.log(err);
    this.removeLoading();
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
    this.addLoading();
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
            this.getFinancial();
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

  searchByRoom() {
    let isValid = 0;
    let activeTab = $(".nav-link.active.show").attr('id');
    if (!this.roomControl.value) {
      this.roomControl.setValue(this.roomList[0]);
      if (activeTab == 'extrafee-tab') {
        this.currentPage = 1;
        this.getFinancialExtraFee();
      }
      else {
        this.currentPageElectric = 1;
        this.getFinancialElectric();
      }

      return;
    }
    this.roomList.forEach(element => {
      if (element.name == this.roomControl.value || element.name == this.roomControl.value.name) {
        this.roomControl.setValue(element);
        isValid = 1;
        if (activeTab == 'extrafee-tab') {
          this.currentPage = 1;
          this.getFinancialExtraFee();
        }
        else {
          this.currentPageElectric = 1;
          this.getFinancialElectric();
        }
        return;
      }
    });

    if (isValid == 0) {
      this.displayDialog('Không tồn tại phòng');
    }
  }

  getFinancialExtraFee() {
    let data: any = {
      boardingHouseID: this.currentBh.id,
      date: this.formatDate() + '-01',
      page: this.currentPage,
      roomID: this.roomControl.value ? this.roomControl.value.id : 0
    }
    console.log(data);
    this.addLoading();
    this.service.getOtherExtrafee(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);

        if (response.type == 1) {
          let resData = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data))
          this.listOtherExtrafee = resData.extraFee;

          // console.log(this.listOtherExtrafee);
          for (let index = 0; index < this.listOtherExtrafee.length; index++) {
            const element = this.listOtherExtrafee[index];
            let roomObj = this.getRoomName(element.room);
            this.listOtherExtrafee[index].roomObj = roomObj;
          }
          this.dataSourceExtra.data = this.listOtherExtrafee;
          this.totalPage = resData.totalPage;
        }
      }, err => {
        this.errRequestHandle(err)
      })
  }

  getFinancialElectric() {
    let data: any = {
      boardingHouseID: this.currentBh.id,
      date: this.formatDate() + '-01',
      page: this.currentPageElectric,
      roomID: this.roomControl.value ? this.roomControl.value.id : 0
    }
    console.log(data);
    this.addLoading();
    this.service.getOtherElectric(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);

        if (response.type == 1) {
          this.listOtherElectric = [];
          console.log(response.data)
          let eValue = response.data.valuePerElectricity;
          let resDataElectricNew = JSON.parse(response.data.electricityNew);
          let resDataElectricOld = JSON.parse(response.data.electricityOld);

          let listElectricNew = resDataElectricNew;
          let listElectricOld = resDataElectricOld;

          for (let index = 0; index < listElectricNew.length; index++) {
            let roomObj = this.getRoomName(listElectricNew[index].room);
            let eLast = listElectricOld[index].total;
            let ePresent = listElectricNew[index].total;
            let elm = {
              roomObj: roomObj,
              eLast: eLast,
              ePresent: ePresent,
              usage: Number(ePresent) - Number(eLast),
              amount: (Number(ePresent) - Number(eLast)) * eValue
            }
            this.listOtherElectric.push(elm);
          }
          this.dataSourceElectric.data = this.listOtherElectric;

          this.totalPageElectric = response.data.totalPageElectricity;
          console.log(listElectricNew)
          console.log(listElectricOld)
        }
      }, err => {
        this.errRequestHandle(err)
      })
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.roomList.filter(roomList => roomList.name.toLowerCase().indexOf(filterValue) === 0);
  }
  displayFn(room?: any): string | undefined {
    return room ? room.name : undefined;
  }

  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }

  formatCurrency() {
    var $input = $(".input-price");
    $input.on("keyup", function (event) {
      // When user select text in the document, also abort.
      var selection = window.getSelection().toString();
      if (selection !== '') {
        return;
      }
      // When the arrow keys are pressed, abort.
      if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
        return;
      }
      $('#myButton').prop('disabled', false);
      var $this = $(this);
      // Get the value.
      let input = $this.val();
      let removeZero = input.toString().replace(/^0+/, '');
      let removeComma = removeZero.replace(/[^0-9]/g, '');
      let currency = removeComma.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      $this.val(function () {
        return (Number(currency) === 0) ? "0" : currency;
      });
    });
  }
  formatDateFull(d, type) {
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (type == 1) {
      return [day, month, year].join('-');
    } else {
      return [year, month, day].join('-');
    }

  }

  convertCurrency(value): string {
    let currency = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return currency
  }

  checkRoomValid() {
    for (let i = 0; i < this.roomList.length; i++) {
      if (this.roomList[i].name == $('#room-name').val().toString().trim()) {
        this.roomControl.setValue(this.roomList[i])
        return true;
      }
    }
    return false;
  }

  convertToNumberPrice(value): Number {
    return Number(value.split('.').join(''));
  }

  //paging
  pageChanged(page) {
    this.currentPage = page;
    this.getFinancialExtraFee();
  }

  //paging electric
  pageChangedElectric(page) {
    this.currentPageElectric = page;
    this.getFinancialElectric();
  }
}
