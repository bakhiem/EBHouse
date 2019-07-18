import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TenantServiceService } from '../service/tenant-service.service';
import { ISubscription } from "rxjs/Subscription";
import { ToastrService } from 'ngx-toastr';

import { SharedServiceService } from '../../service/shared-service.service';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { CommonMessage, Message } from '../../models/message';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { InformationDialogComponent } from '../../shared/info-dialog/information-dialog.component';
import { CustomDateAdapterMonth } from './customDate';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapterMonth }
  ]
})
export class FinancialComponent implements OnInit, OnDestroy {

  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number = 0;
  private subscription: ISubscription;
  currentBh: any;
  listFinancial: any[];
  listExtraFee: any[] = [];
  createEFFormGroup: FormGroup;
  isEdit: number;
  currentRoom: any = {};
  financialStatus: number = 1;
  constructor(private service: TenantServiceService,
    private shareService: SharedServiceService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  maxDate = new Date();
  month: FormControl;
  isSelectAllStatus: number = 0;
  getDisplayedColumns(): string[] {
    if (this.isSelectAllStatus == 1) {
      return ['room', 'total', 'payment', 'debt', 'date', 'status','customColumn'];
    }
    else {
      return [ 'room', 'total', 'payment', 'debt', 'date','customColumn'];
    }
  }

  ngOnInit() {
    this.month = new FormControl({ value: new Date(), disabled: true });
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.currentPage = 1;
        this.getFinancial();
      }
      
      
    });
    this.createEFFormGroup = this.fb.group({
      total: this.fb.control({ value: '', disabled: true }),
      payment: this.fb.control({ value: '', disabled: true }),
      createDate: this.fb.control({ value: '', disabled: true }),
      newDebt: this.fb.control({ value: '', disabled: true }),
      id: '',
      room: '',
      money: this.fb.control({ value: '', disabled: true }),
      cDate: '',
      oldDebt: this.fb.control({ value: '', disabled: true }),
      description:  this.fb.control({ value: '', disabled: true }),
      status: ''
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
    this.currentPage = 1;
    this.getFinancial();
    datepicker.close();
  }


  formatDate(): string {
    let month = this.month.value.getMonth() + 1;
    let year = this.month.value.getFullYear();
    return year + '-' + month
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  getFinancial() {
    let data: any = {
      boardingHouseID: this.currentBh.id,
      page: this.currentPage,
      status: this.financialStatus,
      date : this.formatDate() + '-01'
    }
    if (this.financialStatus == 3) {
      this.isSelectAllStatus = 1;
    }
    else {
      this.isSelectAllStatus = 0;
    }
    console.log(data)
    this.addLoading();
    this.service.getFinancial(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
         console.log(response)
         if (response.data.length > 0) {
          let totalPage = response.data.pop();
          this.listFinancial = response.data;
          this.totalPage = totalPage.totalRecord;
          this.handleListFinancial();
         
        }
      
          console.log(this.listFinancial)
        }
      }, err => {
        this.showErr(CommonMessage.defaultErrMess);
        this.removeLoading();
        console.log(err);
      })
  }

  handleListFinancial(){
    for (let index = 0; index < this.listFinancial.length; index++) {

      const element = this.listFinancial[index];
      if (element.paymentDate == 'null') {
        this.listFinancial[index].paymentDate = ''
      }
      if (element.payment == 0) {
        this.listFinancial[index].statusStr = 'Chưa T.Toán'
        this.listFinancial[index].debt = ''
      } else {
        this.listFinancial[index].statusStr = 'Đã T.Toán'
        this.listFinancial[index].debt = element.total - element.payment
      }
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
  createExtrafee(data, obj) {
    this.createEFFormGroup.reset();
    $('.collapse').collapse('hide');
    this.createEFFormGroup.get('status').setValue(obj.status);
    this.createEFFormGroup.get('cDate').setValue(obj.cDate);
    this.createEFFormGroup.get('id').setValue(obj.id);
    this.createEFFormGroup.get('room').setValue(obj.room);
    this.currentRoom = obj.roomName;
    let financialNew = JSON.parse(data.financialNew);
    $('.bd-example-modal-lg').modal('show');
    let electricFee = ((Number(data.electricityNew) - Number(data.electricityOld)) * Number(data.valuePerElectricity));
    let utilityFee = Number(data.InternetFee) + Number(data.WaterFee) + Number(data.CleaningFee);
    let lstExtraFee = JSON.parse(data.lstExtraFee);
    let oldDebt = 0;
    if (data.financialOld.length > 0) {
      let financialOld = JSON.parse(data.financialOld);
      oldDebt = financialOld.total
    }
    let extraFee = 0;
    this.listExtraFee = [];
    for (let index = 0; index < lstExtraFee.length; index++) {
      extraFee += lstExtraFee[index].amount * -1;
      const element = {
        date: lstExtraFee[index].cDate,
        amount: lstExtraFee[index].amount * -1,
        description: lstExtraFee[index].description,
      };
      this.listExtraFee.push(element);
    }
    this.createEFFormGroup.get('total').setValue(this.convertCurrency(financialNew.total));
    this.createEFFormGroup.get('oldDebt').setValue(this.convertCurrency(oldDebt));
    this.createEFFormGroup.get('money').setValue(this.convertCurrency(Number(financialNew.total) + Number(oldDebt)));
    //edit payment
    if (Number(financialNew.payment) > 0) {
      this.isEdit = 1;
      this.createEFFormGroup.get('createDate').setValue(this.formatDateFull(new Date(financialNew.paymentDate), 1));
      this.createEFFormGroup.get('payment').setValue(this.convertCurrency(financialNew.payment));
      this.createEFFormGroup.get('newDebt').setValue(this.convertCurrency(Number(financialNew.total) - Number(financialNew.payment) + Number(oldDebt)));
    }
    else {
      this.isEdit = 0;
      this.createEFFormGroup.get('createDate').setValue('');
    }

    let isCollapShow1 = 0;
    let isCollapShow2 = 0;
    let isCollapShow3= 0;
    $('#room-fee').html(this.convertCurrency(data.roomPrice));
    $('#electric-fee').html(this.convertCurrency(electricFee));
    $('#utility-fee').html(this.convertCurrency(utilityFee));
    $('#extra-fee').html(this.convertCurrency(extraFee));
    $('#total-money').html(this.convertCurrency(financialNew.total));
    $('#electric-fee').click(() => {
      if (isCollapShow1 == 0) {
        $('#accordionElectric').collapse('show');
        $('#e-last').html('' + data.electricityOld)
        $('#e-present').html('' + data.electricityNew)
        isCollapShow1 = 1;
      }
      else {
        $('#accordionElectric').collapse('hide');
        isCollapShow1 = 0;

      }
    })
    $('#utility-fee').click(() => {
      if (isCollapShow2 == 0) {
        $('#accordionUtility').collapse('show');
        $('#water-fee').html(this.convertCurrency(data.WaterFee))
        $('#internet-fee').html(this.convertCurrency(data.InternetFee))
        $('#clean-fee').html(this.convertCurrency(data.CleaningFee))
        isCollapShow2 = 1;
      }
      else {
        $('#accordionUtility').collapse('hide');
        isCollapShow2 = 0;
      }
    })
    $('#extra-fee').click(() => {
      if (isCollapShow3 == 0) {
        if (this.listExtraFee.length > 0) {
          $('#accordionExtraFee').collapse('show');
          isCollapShow3 = 1;
        }
      }
      else {
        $('#accordionExtraFee').collapse('hide');
        isCollapShow3 = 0;
      }

    })
  }
  convertCurrency(value): string {
    let currency = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return currency
  }

  convertToNumberPrice(value): Number {
    return Number(value.split('.').join(''));
  }


  //click in payment button 
  onClickPayment(obj) {
    let data = {
      date: this.formatDate() + '-01',
      roomID: obj.room_id
    }
    console.log(data)
    this.addLoading();
    this.service.getOneFinancial(data).subscribe(
      res => {
        this.removeLoading();
        try {
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            let data = response.data;
            console.log(data)
            this.createExtrafee(data, obj);
          }
        } catch (error) {
          console.log(error)
        }
      }, err => {
        console.log(err);
      })

  }
  pageChanged(page) {
    this.currentPage = page;
    this.getFinancial();
  }

}
