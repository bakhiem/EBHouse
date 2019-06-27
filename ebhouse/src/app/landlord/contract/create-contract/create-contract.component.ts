import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import * as $AB from 'jquery';
import * as bootstrap from "bootstrap";
import { LandlordService } from '../../service/landlord-service.service';

import { map, startWith } from 'rxjs/operators';
import { Landlord } from '../../../models/landlord';
import { BoardingHouse } from '../../../models/bh';
import { LandlordComponent } from '../../landlord.component';

import { CommonMessage, Message } from '../../../models/message';
import { Observable, throwError } from 'rxjs';


//image
import { ImageResult, ResizeOptions } from 'ng2-imageupload';

import { ISubscription } from "rxjs/Subscription";
//date picker angular

import { NativeDateAdapter } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import 'moment-timezone';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { Router } from '@angular/router';
import {CustomDateAdapter} from './customDate'

const moment = _rollupMoment || _moment;


@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
})
export class CreateContractComponent implements OnInit {
  @ViewChild(MatDatepicker) picker;
  startDateStr: any;
  endDateSrt: any;
  minDate = new Date();
  //Message
  monthStartSelected(params, datepicker) {
    params.setDate(1)
    this.createContractFormGroup.get('beginDate').setValue(params);
    this.startDateStr = this.formatDate(params);
    datepicker.close();
    this.periodHandler();
  }

  monthEndSelected(params, datepicker) {
    var d = new Date(params.getFullYear(), params.getMonth() + 1, 0);
    params.setDate(d.getDate())
    this.endDateSrt = this.formatDate(params);
    this.createContractFormGroup.get('endDate').setValue(params);
    console.log(this.createContractFormGroup.get('endDate').value);
    datepicker.close();
    this.periodHandler();
  }

  periodHandler() {
    if (this.startDateStr && this.endDateSrt) {
      let monthBegin = this.startDateStr.split('-');
      let monthEnd = this.endDateSrt.split('-');
      let month = (Number(monthEnd[0]) - Number(monthBegin[0])) * 12 + (Number(monthEnd[1]) - Number(monthBegin[1]));
      if (typeof month === 'number') {
        if (month >= 0) {
          this.createContractFormGroup.get('period').setValue(month + 1)
        }
        else {
          alert('Tháng kết thúc phải lớn hơn tháng bắt đầu');
          this.createContractFormGroup.get('period').setValue('')
        }
      }
      else {
        this.createContractFormGroup.get('period').setValue('')
      }

    }
  }
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  isEdit : boolean = false;
  createContractFormGroup: FormGroup;
  roomList: any[] = [];
  currentBh: BoardingHouse;
  currentTenant: any;
  phonePattern = '((09|03|07|08|05)+([0-9]{8}))';
  listImg = [];
  //Message
  message: Message = {
    content: '',
    type: 0
  }
  capacity: number;
  isExtraFee = 0;
  displayedColumns: string[] = ['name', 'phone', 'customColumn'];
  listTenant = [];
  dataSource = new MatTableDataSource()
  //resize image
  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 1000,
    resizeMaxWidth: 1000
  };
  private subscription: ISubscription;
  filteredOptions: Observable<any[]>;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private router: Router) {
    this.createContractFormGroup = this.fb.group({
      room: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      tenantSearch: this.fb.control('', Validators.compose([
        Validators.pattern(this.phonePattern)
      ])),
      owner: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      deposit: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      price: this.fb.control('', Validators.required),
      beginDate: this.fb.control({ value: '', disabled: true }, Validators.required),
      endDate: this.fb.control({ value: '', disabled: true }, Validators.required),
      period: '',
      description: ''
    });
  }

  ngOnInit() {

    if(this.isEdit){
      this.createContractFormGroup.controls['room'].disable();
      this.createContractFormGroup.controls['owner'].disable();

    }
    else{
      this.subscription = this.service.currentBh.subscribe((data) => {
        this.currentBh = data;
        if (data.id) {
          this.getRoomsFromCurrentBh();
        }
      })
    }
    
    this.formatCurrency();
    this.jqueryCode();

  }

  jqueryCode() {
    $("#room-name").focusout(() => {
      this.roomList.forEach(element => {
        if (element.name == this.createContractFormGroup.value.room) {
          this.onChooseRoom(element)
        }
      });
    })


    //extra fee

    $('#customCheck1').change(() => {
      if (this.isExtraFee == 0) {
        $('#mycollapse').collapse('show');
        this.isExtraFee = 1;
      }
      else {
        $('#mycollapse').collapse('hide');
        this.isExtraFee = 0;
      }
    });

  }

  getRoomsFromCurrentBh() {
    this.capacity = 0;
    this.resetMess();
    this.createContractFormGroup.reset();
    let data: any = {
      boardingHouseID: this.currentBh.id
    }
    this.addLoading();
    this.service.getRoomsAvailable(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          console.log(data)
          this.roomList = data;
          if (this.roomList.length == 0) {
            this.message.content = CommonMessage.BhHaveNoRoom;
            this.message.type = 0;
          }
          this.filteredOptions = this.createContractFormGroup.get('room').valueChanges
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

      }, err => {
        this.removeLoading();
        console.log(err);
      })
  }
  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }
  saveTenant() {
    let isDuplicate = 0;
    if (this.listTenant.length < this.capacity) {
      this.listTenant.forEach(element => {
        if (this.currentTenant.id == element.id) {
          alert(CommonMessage.DuplicateTenant)
          isDuplicate = 1;
          return false;
        }
      });
      if (isDuplicate == 0) {
        this.listTenant.push(this.currentTenant);
        this.dataSource.data = this.listTenant;
      }
    }
    else {
      alert(CommonMessage.OverCapacity);
    }
  }
  deleteRoom(obj) {
    for (let i = 0; i < this.listTenant.length; i++) {
      if (obj.id == this.listTenant[i].id) {
        this.listTenant.splice(i, 1);
        this.dataSource.data = this.listTenant
        return false;
      }
    }
  }
  searchByPhone() {
    if (!this.capacity) {
      alert(CommonMessage.SelectRoomFirst);
      return;
    }
    this.currentTenant = '';
    var reg = new RegExp(this.phonePattern);
    if (reg.test(this.createContractFormGroup.value.tenantSearch)) {
      let data: any = {
        phone: this.createContractFormGroup.value.tenantSearch
      }
      this.addLoading();
      this.service.searchTenantByPhone(data).subscribe(
        res => {
          this.removeLoading();
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            let data = JSON.parse(response.data);
            $('#tenant-name').val(data.user.name);
            $('#tenant-phone').val(data.user.phone);
            $('#tenant-address').val(data.user.address);
            if (data.imgArnFront) {
              $('#imgArnFront').attr('src', data.imgArnFront);
            }
            if (data.imgArnBack) {
              $('#imgArnBack').attr('src', data.imgArnBack);
            }
            $('#modal2').modal('show');
            this.currentTenant = data;
          }
          else if (response.type == 2) {
            alert(CommonMessage.NoTenant)
          }
        }, err => {
          this.removeLoading();
          console.log(err);
        })
    }
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
      var $this = $(this);
      // Get the value.
      let input = $this.val();
      let removeComma = input.toString().replace(/[^0-9]/g, '');
      let currency = removeComma.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      $this.val(function () {
        return (Number(currency) === 0) ? "" : currency;
      });
    });
  }
  onChooseRoom(value) {
    this.capacity = Number(value.roomType.capacity);
    let currency = value.roomType.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    this.createContractFormGroup.get('price').setValue(currency);
  }
  deleteImage(src) {
    this.listImg.splice(src, 1);
  }
  viewImg(src) {
    console.log(src)
    $(".modalImg").attr("src", src);
    $('#modal1').modal('show');
  }
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
  displayFn(room?: any): string | undefined {
    return room ? room.name : undefined;
  }
  onSubmit() {
    if (!this.createContractFormGroup.value.period || this.createContractFormGroup.value.period == '') {
      alert(CommonMessage.DateFormat);
      return;
    }
    if (this.createContractFormGroup.invalid) {
      alert('Vui lòng điền đầy đủ thông tin')
      return;
    }
    if (this.checkRoomValid()) {
      let formatRoomPrice = this.createContractFormGroup.value.price.toString().split('.').join('');
      let roomPrice = Number(formatRoomPrice);
      let formatDeposit = this.createContractFormGroup.value.deposit.toString().split('.').join('');
      let deposit = Number(formatDeposit);
      var extraFee = 0;
      if ($('#customCheck1').is(':checked')) {
        if ($('#extraFee').val()) {
          let formatPrice = $('#extraFee').val().toString().split('.').join('');
          if ($('#increase').is(':checked')) {
            extraFee = Number(formatPrice);
          }
          else if ($('#decrease').is(':checked')) {
            extraFee = Number(formatPrice) * -1;
          }
        }
      }
      let listImgSplit = []
      for (let index = 0; index < this.listImg.length; index++) {
        let tmp = this.listImg[index].split(',');
        listImgSplit.push(tmp[1]);
      }
      let data = {
        contract: [{
          roomPrice: roomPrice,
          deposit: deposit,
          startDate: this.startDateStr,
          endDate: this.endDateSrt,
          description : this.createContractFormGroup.value.description ? this.createContractFormGroup.value.description : ''
        }],
        room: [{
          id: this.createContractFormGroup.value.room.id
        }],
        lstTenant: this.listTenant,
        owner: [this.createContractFormGroup.value.owner.id],
        extraFee: [{
          amount: extraFee
        }],
        imgContract: listImgSplit,
       
      }
      console.log(data)

      this.addLoading();
      this.service.addContract(data).subscribe(
        res => {
          this.removeLoading();
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            console.log(res)
            this.message.type = 1;
            this.message.content = response.message;
            setTimeout(() => {   this.router.navigate(['/landlord/contract']) }, 1500);
          }
          else {
            this.message.type = 0;
            this.message.content = response.message;
          }
        }, err => {
          this.removeLoading();
          this.message.type = 0;
            this.message.content =CommonMessage.defaultErrMess;
          console.log(err);
        })
    }
    else {
      alert(CommonMessage.NoExitstRoom)
    }


  }
  checkRoomValid() {
    for (let i = 0; i < this.roomList.length; i++) {
      if (this.roomList[i].name == $('#room-name').val().toString().trim()) {
        this.createContractFormGroup.get('room').setValue(this.roomList[i])
        return true;
      }
    }
    return false;

  }
  uploadImage(imageResult: ImageResult) {
    if (this.listImg.length < 5) {
      this.listImg.push(imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL);
    }

  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.roomList.filter(roomList => roomList.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
