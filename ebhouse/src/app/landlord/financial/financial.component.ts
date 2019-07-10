import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LandlordService } from '../service/landlord-service.service';
import { ISubscription } from "rxjs/Subscription";

import { SharedServiceService } from '../../service/shared-service.service';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { CommonMessage, Message } from '../../models/message';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { InformationDialogComponent } from '../../shared/info-dialog/information-dialog.component';
import { CustomDateAdapterMonth } from '../contract/customDate';
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
export class FinancialComponent implements OnInit {

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
  listFinancial: any[];
  roomList: any[];
  roomControl = new FormControl();
  listExtraFee: any[] = [];
  filteredOptions: Observable<any[]>;


  createEFFormGroup: FormGroup;
  isEdit: number;
  currentRoom: any;
  financialStatus: number = 1;
  constructor(private service: LandlordService,
    private shareService: SharedServiceService,
    public dialog: MatDialog,
    private fb: FormBuilder) { }
  maxDate = new Date();
  month: FormControl;

  displayedColumns: string[] = ['customColumn', 'room', 'total', 'payment', 'debt', 'date', 'status'];

  ngOnInit() {
    this.month = new FormControl({ value: new Date(), disabled: true });
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      this.getRoomsFromCurrentBh();
    });
    this.createEFFormGroup = this.fb.group({
      total: this.fb.control({ value: '', disabled: true }),
      payment: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      createDate: this.fb.control({ value: '', disabled: true }),
      newDebt: this.fb.control({ value: '', disabled: true }),
      id: '',
      room: '',
      money: this.fb.control({ value: '', disabled: true }),
      cDate: '',
      oldDebt: this.fb.control({ value: '', disabled: true }),
      description: '',
    });
  }

  chooseMonth(params, datepicker) {
    params.setDate(1);
    this.month.setValue(params);
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
      if (element.id == roomId) {
        return element;
      }
    }
    return '';
  }

   getFinancial() {
    if (!this.currentBh || !this.currentBh.id) {
      return;
    }
    let data: any = {
      boardingHouseID: this.currentBh.id,
      date: this.formatDate() + '-01',
      page: this.currentPage,
      roomID: this.roomControl.value ? this.roomControl.value.id : 0,
      status: this.financialStatus
    }
    console.log(data);
    this.addLoading();
    this.service.getFinancial(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let resData = JSON.parse("" + response.data)
          this.listFinancial = resData.financial;
          this.totalPage = Math.ceil(resData.totalPage / this.perPage);
          this.toArray(this.totalPage);
          for (let index = 0; index < this.listFinancial.length; index++) {

            const element = this.listFinancial[index];
            if (element.paymentDate == 'null') {
              this.listFinancial[index].paymentDate = ''
            }
            if (element.payment == 0) {
              this.listFinancial[index].statusStr = 'Chưa thanh toán'
              this.listFinancial[index].debt = ''
            } else {
              this.listFinancial[index].statusStr = 'Đã thanh toán'
              this.listFinancial[index].debt = element.total - element.payment
            }
            let roomObj = this.getRoomName(element.room);
            this.listFinancial[index].roomObj = roomObj;
          }
          console.log(this.listFinancial)
        }
      }, err => {
        this.message.content = CommonMessage.defaultErrMess;
        this.message.type = 0;
        this.removeLoading();
        console.log(err);
      })
  }

  ngAfterViewInit() {
    this.formatCurrency();
  }


  //send notification
  sendNoti() {

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

            if (this.roomList.length > 1) {
              this.getFinancial();
            }
            else {
              this.removeLoading()
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
          this.removeLoading();
        }
      }, err => {
        this.removeLoading();
        console.log(err);
      })
  }

  searchByRoom() {

    this.resetMess();
    let isValid = 0;
    if (!this.roomControl.value) {
      this.roomControl.setValue(this.roomList[0]);
      this.pageNumbers = [];
      this.currentPage = 1;
      this.getFinancial();
      return;
    }

    this.roomList.forEach(element => {
      if (element.name == this.roomControl.value || element.name == this.roomControl.value.name) {
        this.roomControl.setValue(element);
        isValid = 1;
        this.pageNumbers = [];
        this.currentPage = 1;
        this.getFinancial();
        return;
      }
    });

    if (isValid == 0) {
      this.displayDialog('Không tồn tại phòng');
    }
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
  createExtrafee(data, obj) {
    this.createEFFormGroup.reset();
    this.resetMess();
    if(obj.status == 1){
      $('#myButton').prop('disabled', true);
      this.createEFFormGroup.get('payment').disable()
    }
    else{
      this.createEFFormGroup.get('payment').enable()
    }
    this.createEFFormGroup.get('cDate').setValue(obj.cDate);
    this.createEFFormGroup.get('id').setValue(obj.id);
    this.createEFFormGroup.get('room').setValue(obj.room);
    this.currentRoom = obj.roomObj;
    let financialNew = JSON.parse(data.financialNew);
    $('.bd-example-modal-lg').modal('show');
    $('#myButton').prop('disabled', true);
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
      extraFee += lstExtraFee[index].amount;
      const element = {
        date: lstExtraFee[index].cDate,
        amount: lstExtraFee[index].amount,
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
      this.createEFFormGroup.get('createDate').setValue(this.formatDateFull(new Date(), 1));
    }
    $('.input-price').on("keyup", (event) => {
      let input = $('.input-price').val();
      let removeComma = input.toString().replace(/[^0-9]/g, '');
      if (isNaN(Number(removeComma)) == false) {
        let money = this.createEFFormGroup.get('money').value;
        let removeCommaMoney = money.toString().replace(/[^0-9]/g, '');
        this.createEFFormGroup.get('newDebt').setValue(this.convertCurrency( Number(removeCommaMoney) - Number(removeComma)));
      }
    })
    let isCollapShow = 0;
    $('#room-fee').html(this.convertCurrency(data.roomPrice));
    $('#electric-fee').html(this.convertCurrency(electricFee));
    $('#utility-fee').html(this.convertCurrency(utilityFee));
    $('#extra-fee').html(this.convertCurrency(extraFee));
    $('#total-money').html(this.convertCurrency(financialNew.total));
    $('#electric-fee').click(() => {
      if (isCollapShow == 0) {
        $('#accordionElectric').collapse('show');
        $('#e-last').html('' + data.electricityOld)
        $('#e-present').html('' + data.electricityNew)
        isCollapShow = 1;
      }
      else {
        $('.collapse').collapse('hide');
        isCollapShow = 0;

      }
    })
    $('#utility-fee').click(() => {
      if (isCollapShow == 0) {
        $('#accordionUtility').collapse('show');
        $('#water-fee').html(this.convertCurrency(data.WaterFee))
        $('#internet-fee').html(this.convertCurrency(data.InternetFee))
        $('#clean-fee').html(this.convertCurrency(data.CleaningFee))
        isCollapShow = 1;
      }
      else {
        $('.collapse').collapse('hide');
        isCollapShow = 0;
      }
    })
    $('#extra-fee').click(() => {
      if (isCollapShow == 0) {
        if (this.listExtraFee.length > 0) {
          $('#accordionExtraFee').collapse('show');
          isCollapShow = 1;
        }
      }
      else {
        $('.collapse').collapse('hide');
        isCollapShow = 0;
      }

    })
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
  onSubmit() {
    if (this.createEFFormGroup.invalid || this.createEFFormGroup.get('payment').value == '') {
      this.displayDialog(CommonMessage.inputAllFiel)
      return;
    }


    let paymentDateArr = this.createEFFormGroup.get('createDate').value.split('-');
    let paymentDate = [paymentDateArr[2], paymentDateArr[1], paymentDateArr[0]].join('-');
    let data = {
      id: this.createEFFormGroup.get('id').value,
      room: { id: this.createEFFormGroup.get('room').value },
      description: this.createEFFormGroup.value.description ? this.createEFFormGroup.value.description : '',
      total: this.convertToNumberPrice(this.createEFFormGroup.get('total').value),
      payment: this.convertToNumberPrice(this.createEFFormGroup.get('payment').value),
      paymentDate: paymentDate,
      cDate: this.createEFFormGroup.get('cDate').value
    }
    console.log(data)
    this.addLoading();
    this.service.updateFinancial(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          this.message.content = response.message;
          this.message.type = 1;
          $('.bd-example-modal-lg').modal('hide');
          this.isEdit = 0;;
          this.getFinancial();
        }
        else if (response.type == 2) {
          this.message.content = response.message;
          this.message.type = 0;
        }
      }, err => {
        this.removeLoading();
        this.message.content = CommonMessage.defaultErrMess;
        this.message.type = 0;
        console.log(err);
      })


  }

  //click in payment button 
  onClickPayment(obj) {
    let data = {
      date: this.formatDate() + '-01',
      roomID: obj.room
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
  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }
  //paging
  toArray = function (num: number) {
    this.pageNumbers = []
    for (let i = 1; i <= num; i++) {
      this.pageNumbers[i - 1] = i;
    }
  }
  goToPage(page: any) { // without type info
    this.currentPage = page;
    this.resetMess();
    this.getFinancial();
  }
  prePage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.resetMess();
      this.getFinancial();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.resetMess();
      this.getFinancial();
    }
  }
}
