import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';

import { LandlordService } from '../../service/landlord-service.service';
import { InformationDialogComponent } from '../../../shared/info-dialog/information-dialog.component';
import { map, startWith } from 'rxjs/operators';
import { BoardingHouse } from '../../../models/bh';

import { ToastrService } from 'ngx-toastr';
import { CommonMessage } from '../../../models/message';
import { Observable, throwError } from 'rxjs';

import { Contract, Tenant, ContractTenant, User } from '../../../models/contract';

//image
import { ImageResult, ResizeOptions } from 'ng2-imageupload';

import { ISubscription } from "rxjs/Subscription";
//date picker angular

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { CustomDateAdapter } from '../customDate'

import { SharedServiceService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
})
export class CreateContractComponent implements OnInit,OnDestroy {
  startDateStr: any;
  endDateSrt: any;
  minDate = new Date();
  //Message
  monthStartSelected(params, datepicker) {
    params.setDate(1);
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
    datepicker.close();
  }

  checkValidDate(d: Date, type : number): boolean {
    if (!this.listContract) {
      this.displayDialog(CommonMessage.SelectRoomFirst)
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
              this.displayDialog( CommonMessage.HaveContractInDate)
              
              return false;
            }
          }
        }
        if(type == 1){
          if(this.createContractFormGroup.get('beginDate').value){
            if (this.createContractFormGroup.get('beginDate').value <= startdate && d >= enddate  ) {
              this.displayDialog( CommonMessage.HaveContractInDate)
              
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
          this.displayDialog(CommonMessage.DateFormat);
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
  roomList: any[] = [];
  currentBh: BoardingHouse;
  currentTenant: any;
  phonePattern = '((09|03|07|08|05)+([0-9]{8}))';
  listImg = [];
  

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
  listContractDisplay: string[] = [];
  listContract: Contract[];
  filteredOptions: Observable<any[]>;

  constructor(
    private shareService :SharedServiceService,
    private zone:NgZone,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private router: Router,
    private toastr: ToastrService) {
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
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.getRoomsFromCurrentBh();
        this.resetFormChangeBh();
      }
    })
    this.formatCurrency();
    this.jqueryCode();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  resetFormChangeBh(){
    this.listImg = [];
    this.listTenant = [];
    this.dataSource.data = [];
    $("#customCheck1"). prop("checked", false);
    $('#mycollapse').collapse('hide');
    $('#extraFee').val('');
    this.isExtraFee = 0;
    this.listContractDisplay = [];
  }
  displayDialog(message : string){
    this.dialog.open(InformationDialogComponent, {
      width: '400px',
      data: message
    });
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
          let data = response.data;
          this.roomList = data;
          if (this.roomList.length == 0) {
            this.showErr(CommonMessage.BhHaveNoRoom);
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
      this.displayDialog(CommonMessage.OverCapacity)
      
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
      this.displayDialog(CommonMessage.SelectRoomFirst)
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
            this.displayDialog(CommonMessage.NoTenant);
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
    //reset form
    this.createContractFormGroup.reset();
    this.listImg = [];
    $('#extraFee').val('');
    $('#customCheck1').prop('checked',false);
    $('#mycollapse').collapse('hide');
    this.isExtraFee = 0;
    this.listTenant = [];
    // set capacity and room price, format room price
     this.createContractFormGroup.get('room').setValue(value);
    this.capacity = Number(value.capacity);
    let currency = value.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    this.createContractFormGroup.get('price').setValue(currency);
    this.listContractDisplay =[]
    // print alert start date and end date of contract in room
    let data = {
      id: value.id
    }
    this.addLoading()
    this.service.getContractByRoom(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          this.listContract = response.data;
          let display = []
          if (this.listContract.length > 0) {
            this.listContract.forEach(element => {
              let startDate = new Date(element.startDate);
              let endDate = new Date(element.endDate);

              display.push('Phòng đang tồn tại hợp đồng từ ngày ' + this.formatDateDisplay(startDate) + ' đến ngày ' + this.formatDateDisplay(endDate));
              
            });
          }
          this.zone.run(() => { // <== added
              this.listContractDisplay = display;
          });
          console.log(this.listContractDisplay)
        }
        else {
          this.showErr(response.message);
        }
      }, err => {
        this.removeLoading();
        this.showErr(CommonMessage.defaultErrMess);
        console.log(err);
      })
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
  displayFn(room?: any): string | undefined {
    return room ? room.name : undefined;
  }
  onSubmit() {
    if (!this.createContractFormGroup.value.period || this.createContractFormGroup.value.period == '') {
      this.displayDialog(CommonMessage.DateFormat)
      return;
    }
    if (this.createContractFormGroup.invalid) {
      this.displayDialog(CommonMessage.inputAllFiel)
      return;
    }

    if (this.checkRoomValid()) {
      let formatRoomPrice = this.createContractFormGroup.value.price.toString().split('.').join('');
      let roomPrice = Number(formatRoomPrice);
      let deposit = 0;
      if (this.createContractFormGroup.value.deposit) {
        let formatDeposit = this.createContractFormGroup.value.deposit.toString().split('.').join('');
        deposit = Number(formatDeposit);
      }
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
          description: this.createContractFormGroup.value.description ? this.createContractFormGroup.value.description : ''
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
            this.showSuccess(response.message);
            setTimeout(() => { this.router.navigate(['/landlord/contract']) }, 1500);
          }
          else {
            this.showErr(response.message);
          }
        }, err => {
          this.removeLoading();
          this.showErr(CommonMessage.defaultErrMess);
          console.log(err);
        })
    }
    else {
      this.displayDialog(CommonMessage.NoExitstRoom)
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
