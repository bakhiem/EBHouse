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
  selector: 'app-electric',
  templateUrl: './electric.component.html',
  styleUrls: ['./electric.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapterMonth }
  ]
})
export class ElectricComponent implements OnInit {

  //Message
  message: Message = {
    content: '',
    type: 0
  }

  private subscription: ISubscription;
  currentBh: any;
  list: any[];
  constructor(private service: LandlordService,
    private shareService: SharedServiceService,
    public dialog: MatDialog) { }
  maxDate = new Date();
  month: FormControl;
  ngOnInit() {
    this.month = new FormControl({ value: new Date(), disabled: true });
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh  && this.currentBh.id) {
        this.getElectric();
      }
      
    })
    this.scrollTop();
  }
  chooseMonth(params, datepicker) {
    params.setDate(1);
    this.month.setValue(params);
    this.resetMess();
    this.getElectric();
    datepicker.close();
  }
  displayDialog(message: string) {
    this.dialog.open(InformationDialogComponent, {
      width: '400px',
      data: message
    });
  }
  scrollTop(){
    //  $('.electric').animate({scrollTop: '200px'}, 0);
    var elmnt = document.getElementsByClassName("electric");
    elmnt[0].scrollIntoView({behavior:"smooth"});
  }
  formatDate(): string {
    let month = this.month.value.getMonth() + 1;
    let year = this.month.value.getFullYear();
    return year + '-' + month
  }
  private getElectric() {
    let data: any = {
      boardingHouseID: this.currentBh.id,
      date: this.formatDate() + '-01'
    }
    console.log(data)
    if(this.maxDate.getMonth() == this.month.value.getMonth() && this.maxDate.getFullYear() == this.month.value.getFullYear() ){
      $("input[type=submit]").removeAttr("disabled");
    }
    else{
      $("input[type=submit]").attr("disabled", "disabled");
    }
    this.addLoading();
    this.service.getElectric(data).subscribe(
      res => {
        this.removeLoading();
        console.log(res)
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let resData = response.data;
          console.log(resData)
          this.list = resData;
        
          $('#lastMonth').html("Công tơ điện tháng " + this.month.value.getMonth());
          $('#presentMonth').html("Công tơ điện tháng " + (this.month.value.getMonth() + 1));
          if (this.list.length > 0) {
            for (let index = 0; index < this.list.length; index++) {
              let usage = Number(this.list[index].eNow) - Number(this.list[index].eBefore)
              this.list[index].usage = usage;
              this.list[index].amount = usage * this.list[index].value;

              if (this.list[index].statusBefore == 1) {
                this.list[index].disabledBefore = true;
              }
              if (this.list[index].statusNow == 1) {
                this.list[index].disabledNow = true;
              }
            }
            // $("input[type=submit]").attr("disabled", "disabled");
          }
          // //if bh didn't have list utility
          // else{
          //   this.resetForm();
          // }
        }
      }, err => {
        this.removeLoading();
        console.log(err);
      })
  }


  focusoutFunction(id) {

    if (Number($('#present-' + id).val()) < Number($('#last-' + id).val())) {
      $('#present-' + id).val(Number($('#last-' + id).val()));
      $('#usage-' + id).html(''+0);
      $('#amount-' + id).html(''+0);
      this.displayDialog(CommonMessage.Electric);
    }
    else {
      let usage = Number($('#present-' + id).val()) - Number($('#last-' + id).val());
      $('#present-' + id).val(Number($('#present-' + id).val()));
      $('#last-' + id).val(Number($('#last-' + id).val()));
      $('#usage-' + id).html('' + usage);
      let amount = usage * Number(this.list[1].value);
      let currency = amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      $('#amount-' + id).html(currency);
    }

  }
  //check if eNow > ebefore
  checkValidBeforeSubmit() : boolean{
    for (let index = 0; index < this.list.length; index++) {
      if((Number($('#present-' + this.list[index].id).val()) < Number($('#last-' + this.list[index].id).val()))){
          return false;
      }
    }
    return true;
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
  save() {
    this.resetMess();
    // if (this.checkValidBeforeSubmit() == false) {
    //   this.displayDialog(CommonMessage.Electric);
    //   return;
    // }
    let listSendServer = []
    for (let index = 0; index < this.list.length; index++) {

      if (this.list[index].statusBefore != 1) {
        let electricBefore = {
          id: this.list[index].idBefore ? this.list[index].idBefore : 0,
          room: { id: this.list[index].roomID },
          total: Number($('#last-' + this.list[index].id).val()),
          status: this.list[index].statusBefore,
          cDate: this.formatDateFull(this.list[index].cDateBefore)
        }
        listSendServer.push(electricBefore);
      }
      if (this.list[index].statusNow != 1){
        let electricNow = {
          id: this.list[index].id,
          room: { id: this.list[index].roomID },
          total: Number($('#present-' + this.list[index].id).val()),
          status: this.list[index].statusNow,
          cDate:this.formatDateFull(this.list[index].cDate)
        }
        listSendServer.push(electricNow);
      }
     
    }
    let data = {
      data: listSendServer
    }
    console.log(data);
    this.addLoading();
    this.service.updateElectric(data).subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          this.message.type = 1;
          this.message.content = response.message;
          this.getElectric();
        }
        else {
          this.removeLoading();
          this.message.type = 0;
          this.message.content = response.message;
        }
      }, err => {
        this.removeLoading();
        this.message.type = 0;
        this.message.content = CommonMessage.defaultErrMess;
        console.log(err);
      })
  }

  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }
}