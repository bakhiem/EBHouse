import { Component, OnInit } from '@angular/core';
import { Calculating, Utility } from '../../models/utility';

import { LandlordService } from '../service/landlord-service.service';
import { ISubscription } from "rxjs/Subscription";

import { SharedServiceService } from '../../service/shared-service.service';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { CommonMessage, Message } from '../../models/message';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { InformationDialogComponent } from '../../shared/info-dialog/information-dialog.component';
import { CustomDateAdapterMonth } from '../contract/customDate';

import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-extrafee',
  templateUrl: './extrafee.component.html',
  styleUrls: ['./extrafee.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapterMonth }
  ]
})
export class ExtraFeeComponent implements OnInit {

  //Message
  message: Message = {
    content: '',
    type: 0
  }
  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number;
  pageNumbers: number[] = [];
  private subscription: ISubscription;
  currentBh: any;
  listExtrafee: any[];
  constructor(private service: LandlordService,
    private shareService: SharedServiceService,
    public dialog: MatDialog) { }
  maxDate = new Date();
  month: FormControl;

  displayedColumns: string[] = ['name', 'price', 'description', 'date'];

  ngOnInit() {
    this.month = new FormControl({ value: new Date(), disabled: true });
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      this.getExtrafee();
    })
  }
  chooseMonth(params, datepicker) {
    params.setDate(1);
    this.month.setValue(params);
    this.resetMess();
    this.getExtrafee();
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
  private getExtrafee() {
    if (!this.currentBh || !this.currentBh.id) {
      return;
    }
    let data: any = {
      boardingHouseID: this.currentBh.id,
      date: this.formatDate() + '-01',
      page : this.currentPage
    }
    console.log(data)
    // if (this.maxDate.getMonth() == this.month.value.getMonth() && this.maxDate.getFullYear() == this.month.value.getFullYear()) {
    //   $("input[type=submit]").removeAttr("disabled");
    // }
    // else {
    //   $("input[type=submit]").attr("disabled", "disabled");
    // }
    this.addLoading();
    this.service.getExtrafee(data).subscribe(
      res => {
        this.removeLoading();
        console.log(res)
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let resData = response.data;
          console.log(resData)
          this.listExtrafee = resData;
        }
      }, err => {
        this.removeLoading();
        console.log(err);
      })
  }




  resetForm() {
    $("input[type=number]").val('');
    // $("input[type=submit]").attr("disabled", "disabled");
  }
  ngAfterViewInit() {
    this.formatCurrency();
    // this.jqueryCode();
  }


  jqueryCode() {
    $("input[type=submit]").keypress(function () {
      console.log(this)
    });

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
    console.log($(".input-price"))
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

  formatDateFull(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  createExtrafee() {
    this.resetMess();
    // let listSendServer = []
    // let data = {
    //   data: listSendServer
    // }
    // console.log(data);
    // this.addLoading();
    // this.service.updateElectric(data).subscribe(
    //   res => {
    //     let response = JSON.parse("" + res);
    //     if (response.type == 1) {
    //       this.message.type = 1;
    //       this.message.content = response.message;
    //       this.getExtrafee();
    //     }
    //     else {
    //       this.removeLoading();
    //       this.message.type = 0;
    //       this.message.content = response.message;
    //     }
    //   }, err => {
    //     this.removeLoading();
    //     this.message.type = 0;
    //     this.message.content = CommonMessage.defaultErrMess;
    //     console.log(err);
    //   })
  }

  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }
}
