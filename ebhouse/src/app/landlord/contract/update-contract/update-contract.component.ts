import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { InformationDialogComponent } from '../../../shared/info-dialog/information-dialog.component';
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
import { Router } from '@angular/router';
import { CustomDateAdapter } from '../customDate';

import { Contract, Tenant, ContractTenant, User } from '../../../models/contract';

import { SharedServiceService } from '../../../service/shared-service.service';
@Component({
  selector: 'app-update-contract',
  templateUrl: './update-contract.component.html',
  styleUrls: ['./update-contract.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
})
export class UpdateContractComponent implements OnInit {
  startDateStr: any;
  endDateSrt: any;
  minDate = new Date();
  capacity: number;
  //Message
  monthStartSelected(params, datepicker) {
    params.setDate(1)
    if (this.checkValidDate(params,0)) {
      this.createContractFormGroup.get('beginDate').setValue(params);
      this.startDateStr = this.formatDate(params);
      this.periodHandler();
    }
    else {
      this.createContractFormGroup.get('beginDate').setValue('');
      this.createContractFormGroup.get('period').setValue('');
    }
    datepicker.close();
  }

  monthEndSelected(params, datepicker) {
    var d = new Date(params.getFullYear(), params.getMonth() + 1, 0);
    params.setDate(d.getDate())
    if (this.checkValidDate(params,1)) {
      this.endDateSrt = this.formatDate(params);
      this.createContractFormGroup.get('endDate').setValue(params);
      this.periodHandler();
    }
    else {
      this.createContractFormGroup.get('endDate').setValue('');
      this.createContractFormGroup.get('period').setValue('');
    }
    datepicker.close()
  }
  checkValidDate(d: Date, type : number): boolean {
    if (!this.listContract) {
      this.displayDialog(CommonMessage.SelectRoomFirst);
      return false;
    }
    else if (this.listContract.length == 0) {
      return true;
    }
    else {
      for (let index = 0; index < this.listContract.length; index++) {
        let startdate = new Date(this.listContract[index].startDate);
        let enddate = new Date(this.listContract[index].endDate);
        if (d >= startdate && d <= enddate) {
          this.displayDialog(CommonMessage.HaveContractInDate)
          return false;
        }
        if(type == 0){
          if(this.createContractFormGroup.get('endDate').value){
            if (d <= startdate && this.createContractFormGroup.get('endDate').value >= enddate) {
              this.displayDialog(CommonMessage.HaveContractInDate);
              return false;
            }
          }
        }
        if(type == 1){
          if(this.createContractFormGroup.get('beginDate').value){
            if (this.createContractFormGroup.get('beginDate').value <= startdate && d >= enddate  ) {
              this.displayDialog(CommonMessage.HaveContractInDate);
              return false;
            }
          }
        }
      }
    }
    return true;
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
          this.displayDialog(CommonMessage.DateFormat)

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

  formatDateDisplay(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }
  createContractFormGroup: FormGroup;
  currentTenant: any;
  phonePattern = '((09|03|07|08|05)+([0-9]{8}))';
  listImg = [];
  currentContract: Contract;
  //Message
  message: Message = {
    content: '',
    type: 0
  }
  currentOwner: Tenant;
  contractLog: any[];
  isExtraFee = 0;
  displayedColumnsContractLog: string[] = ['cDate', 'content'];
  displayedColumns: string[] = ['name', 'phone', 'customColumn'];
  listTenant = [];
  dataSource = new MatTableDataSource()
  //resize image
  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 1000,
    resizeMaxWidth: 1000
  };
  private subscription: ISubscription;
  listContractDisplay: string[] = [];
  listContract: Contract[];
  constructor(
    private shareService: SharedServiceService,
    private zone: NgZone,
    private fb: FormBuilder,
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
      deposit: '',
      price: this.fb.control('', Validators.required),
      beginDate: this.fb.control({ value: '', disabled: true }, Validators.required),
      endDate: this.fb.control({ value: '', disabled: true }, Validators.required),
      period: '',
      description: ''
    });
  }

  ngOnInit() {
    this.service.currentContract.subscribe(contract => {
      this.currentContract = contract;

    });
    if (this.currentContract == null) {
      this.router.navigate(['/landlord/contract']);
    }
    else {
      let data = {
        id: this.currentContract.room.id
      }
      this.addLoading()
      this.service.getContractByRoom(data).subscribe(
        res => {
          this.removeLoading();
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            console.log(response.data)
            this.listContract = response.data;
            let display = []
            if (this.listContract.length > 0) {
              this.listContract.forEach(element => {
                if (element.id != this.currentContract.id) {
                  let startDate = new Date(element.startDate);
                  let endDate = new Date(element.endDate);
                  display.push('Phòng đang tồn tại hợp đồng từ ngày ' + this.formatDateDisplay(startDate) + ' đến ngày ' + this.formatDateDisplay(endDate));
                }

                // xóa bỏ hợp đồng mà edit trong list
                else {
                  var index = this.listContract.indexOf(element);
                  if (index > -1) {
                    this.listContract.splice(index, 1);
                  }
                }

              });
            }
            this.zone.run(() => { // <== added
              this.listContractDisplay = display;
            });
          }
          else {
            this.message.type = 0;
            this.message.content = response.message;
          }
        }, err => {
          this.removeLoading();
          this.message.type = 0;
          this.message.content = CommonMessage.defaultErrMess;
          console.log(err);
        })
      this.setValueForm();
      this.formatCurrency();
      this.jqueryCode();
    }

  }
  setValueForm() {
    this.listTenant = [];
    this.createContractFormGroup.get('room').setValue(this.currentContract.room.name);
    this.createContractFormGroup.get('description').setValue(this.currentContract.description);

    let depositFormat = this.currentContract.deposit.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    this.createContractFormGroup.get('deposit').setValue(depositFormat);

    //set price
    this.capacity = Number(this.currentContract.room.roomType.capacity);
    let currency = this.currentContract.roomPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    this.createContractFormGroup.get('price').setValue(currency);

    // this.listTenant = this.currentContract.lstContractTenant.
    this.createContractFormGroup.controls['room'].disable();
    this.createContractFormGroup.controls['owner'].disable();

    this.currentContract.lstContractTenant.forEach(element => {
      this.listTenant.push(element.tenant);
      if (element.isOwner == 1) {
        this.currentOwner = element.tenant;
        this.createContractFormGroup.get('owner').setValue(element.tenant);
      }
    });

    this.dataSource.data = this.listTenant;
    let startDate = this.formatDateFromServer(this.currentContract.startDate);
    let endDate = this.formatDateFromServer(this.currentContract.endDate)
    this.endDateSrt = this.formatDate(endDate);
    this.startDateStr = this.formatDate(startDate);
    this.periodHandler();
    this.createContractFormGroup.get('beginDate').setValue(startDate);
    this.createContractFormGroup.get('endDate').setValue(endDate);
    if(this.currentContract.contractImg && this.currentContract.contractImg != 'NULL' && this.currentContract.contractImg != 'null')
    this.listImg = this.currentContract.contractImg ? this.currentContract.contractImg.split(',') : [];
    this.contractLog = this.currentContract.lstContractLog;
  }

  formatDateFromServer(inputDate) {
    let d = inputDate.split(' ');
    let d2 = d[0].split('-');
    let date = new Date(d2[0], d2[1] - 1, d2[2]);
    return date;
  }
  jqueryCode() {
    
  }

  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }
  displayDialog(message : string){
    this.dialog.open(InformationDialogComponent, {
      width: '400px',
      data: message
    });
  }
  saveTenant() {
    let isDuplicate = 0;
    if (this.listTenant.length < this.capacity) {
      this.listTenant.forEach(element => {
        if (this.currentTenant.id == element.id) {
          this.displayDialog(CommonMessage.DuplicateTenant)
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
      this.displayDialog( CommonMessage.OverCapacity)
    }
  }
  deleteRoom(obj) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: 'Bạn chắc chắn muốn xóa khách thuê không ?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        for (let i = 0; i < this.listTenant.length; i++) {
          if (obj.id == this.listTenant[i].id) {
            this.listTenant.splice(i, 1);
            this.dataSource.data = this.listTenant
            return false;
          }
        }
      }
    });
  }
  searchByPhone() {
    if (!this.capacity) {
      this.displayDialog( CommonMessage.SelectRoomFirst)
     
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
            this.displayDialog(CommonMessage.NoTenant)
            
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

  deleteImage(src) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: 'Bạn chắc chắn muốn xóa ảnh hợp đồng không ?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listImg.splice(src, 1);
      }
    });

  }

  viewImg(src) {
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
  onSubmit() {
    console.log(this.createContractFormGroup.value)
    if (!this.createContractFormGroup.value.period || this.createContractFormGroup.value.period == '') {
      this.displayDialog(CommonMessage.DateFormat)
      return;
    }

    else if (this.createContractFormGroup.invalid) {
      this.displayDialog(CommonMessage.inputAllFiel)
      return;
    }


    let formatRoomPrice = this.createContractFormGroup.value.price.toString().split('.').join('');
    let roomPrice = Number(formatRoomPrice);
    let deposit = 0;
    if (this.createContractFormGroup.value.deposit) {
      let formatDeposit = this.createContractFormGroup.value.deposit.toString().split('.').join('');
      deposit = Number(formatDeposit);
    }
    
    let listImgSplit = []
    for (let index = 0; index < this.listImg.length; index++) {
      if (this.listImg[index].includes(',')) {
        let tmp = this.listImg[index].split(',');
        listImgSplit.push(tmp[1]);
      }
      else {
        listImgSplit.push(this.listImg[index])
      }
    }
    let data = {
      contract: [{
        id: this.currentContract.id,
        contractImg: this.currentContract.contractImg,
        roomPrice: roomPrice,
        deposit: deposit,
        startDate: this.startDateStr,
        endDate: this.endDateSrt,
        description: this.createContractFormGroup.value.description ? this.createContractFormGroup.value.description : ''
      }],
      room: [{
        id: this.currentContract.room.id
      }],
      lstTenant: this.listTenant,
      owner: [this.currentOwner.id],
      imgContract: listImgSplit,

    }
    console.log(data)
    this.addLoading();
    this.service.updateContract(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          this.displayDialog(response.message);
          this.message.type = 1;
          this.message.content = response.message;
          setTimeout(() => { this.router.navigate(['/landlord/contract']) }, 1500);
        }
        else {
          this.message.type = 0;
          this.message.content = response.message;
          this.displayDialog(response.message);
        }
      }, err => {
        this.removeLoading();
        this.message.type = 0;
        this.message.content = CommonMessage.defaultErrMess;
        this.displayDialog(CommonMessage.defaultErrMess);
        console.log(err);
      })
  }
  uploadImage(imageResult: ImageResult) {
    if (this.listImg.length < 5) {
      this.listImg.push(imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL);
    }

  }
}
