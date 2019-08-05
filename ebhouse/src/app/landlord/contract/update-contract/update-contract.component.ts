import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { InformationDialogComponent } from '../../../shared/info-dialog/information-dialog.component';
import { LandlordService } from '../../service/landlord-service.service';


import { ToastrService } from 'ngx-toastr';
import { CommonMessage } from '../../../models/message';


//image
import { Options, ImageResult } from "ngx-image2dataurl";

import { ISubscription } from "rxjs/Subscription";
//date picker angular
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { CustomDateAdapter } from '../customDate';

import { Contract, Tenant, } from '../../../models/contract';

import { SharedServiceService } from '../../../service/shared-service.service';
import { PlaceService } from '../../../service/place.service';
import { UserService } from '../../../user/service/user.service';
import { RotateImageFileProcessor } from '../../../shared/image-rotate';
@Component({
  selector: 'app-update-contract',
  templateUrl: './update-contract.component.html',
  styleUrls: ['./update-contract.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
})
export class UpdateContractComponent implements OnInit, OnDestroy {
  startDateStr: any;
  endDateSrt: any;
  minDate = new Date();
  capacity: number;
  CommonMessage = CommonMessage;
  availableInThisMonth: boolean = true;
  rotateImageFileProcessor = new RotateImageFileProcessor();

  dataDistric: any[];
  dataWards: any[];
  dataProvince: any[];
  createTenantFormGroup: FormGroup;
  appendDate = "?date=" + new Date().getTime();
  monthStartSelected(params, datepicker) {
    params.setDate(1)
    if (this.checkValidDate(params, 0)) {
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
    if (this.checkValidDate(params, 1)) {
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
  checkValidDate(d: Date, type: number): boolean {
    if (this.listContract.length == 0 && this.availableInThisMonth) {
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
        if (type == 0) {
          if (this.createContractFormGroup.get('endDate').value) {
            if (d <= startdate && this.createContractFormGroup.get('endDate').value >= enddate) {
              this.displayDialog(CommonMessage.HaveContractInDate);
              return false;
            }
          }
        }
        if (type == 1) {
          if (this.createContractFormGroup.get('beginDate').value) {
            if (this.createContractFormGroup.get('beginDate').value <= startdate && d >= enddate) {
              this.displayDialog(CommonMessage.HaveContractInDate);
              return false;
            }
          }
        }
      }
      // check availableInThisMonth
      if (this.availableInThisMonth == false) {
        let d1 = new Date();
        console.log(d1)
        console.log(d)
        if (d1.getMonth() == d.getMonth() && d1.getFullYear() == d.getFullYear()) {
          this.displayDialog(CommonMessage.HaveDisableContractInMonth)
          return false;
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

  currentOwner: Tenant;
  contractLog: any[];
  isExtraFee = 0;
  displayedColumnsContractLog: string[] = ['cDate', 'content'];
  displayedColumns: string[] = ['name', 'phone', 'customColumn'];
  listTenant = [];
  dataSource = new MatTableDataSource()
  //resize image
  options: Options = {
    resize: {
      maxHeight: 1000,
      maxWidth: 1000
    },
    allowedExtensions: ['JPG', 'PnG', 'JPEG']
  };
  isDisable = false;
  private subscription: ISubscription;
  listContractDisplay: string[] = [];
  listContract: Contract[];
  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private router: Router,
    private toastr: ToastrService,
    private placeService : PlaceService,
    private userService: UserService,
) {
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

    this.createTenantFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      id: '',
      phone: '',
      province: '',
      distric: '',
      wards: '',
      address: '',
      dateOfBirth :'',
      sex : ''
    });

  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.subscription = this.service.currentContract.subscribe(contract => {
      this.currentContract = contract;
    });
    this.placeService.getProvince().subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataProvince = arr;
      this.dataWards = null;
    });	
    if (this.currentContract == null) {
      this.router.navigate(['/landlord/contract']);
    }
    else if (this.currentContract.status != 4 && this.currentContract.status != 2) {
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
            this.listContract = response.data.lstDate;
            this.availableInThisMonth = response.data.availableInThisMonth;
            let display = []
            if (this.listContract.length > 0) {
              for (let index = 0; index < this.listContract.length; index++) {
                const element = this.listContract[index];
                if (element.id != this.currentContract.id) {
                  let startDate = new Date(element.startDate);
                  let endDate = new Date(element.endDate);
                  display.push('Phòng đang tồn tại hợp đồng từ ngày ' + this.formatDateDisplay(startDate) + ' đến ngày ' + this.formatDateDisplay(endDate));
                }

                // xóa bỏ hợp đồng mà edit trong list
                else {
                  this.listContract.splice(index, 1);
                }
              }
              // this.listContract.forEach(element => {


              // });
            }
            this.zone.run(() => { // <== added
              this.listContractDisplay = display;
            });
          }
          else {
            this.showErr(response.message);
          }
        }, err => {
          this.removeLoading();
          this.showErr(CommonMessage.defaultErrMess);
          console.log(err);
        })
      this.setValueForm();
      this.formatCurrency();
      this.jqueryCode();
    }
    else {
      this.isDisable = true;
      this.createContractFormGroup.get('tenantSearch').disable();
      this.createContractFormGroup.get('deposit').disable();
      this.createContractFormGroup.get('price').disable();
      this.createContractFormGroup.get('description').disable();
      this.setValueForm();
    }

  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
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
    if (this.currentContract.contractImg && this.currentContract.contractImg != 'NULL' && this.currentContract.contractImg != 'null') {
      this.listImg = this.currentContract.contractImg ? this.currentContract.contractImg.split(',') : [];
      for (let index = 0; index <  this.listImg.length; index++) {
        this.listImg[index] += "?date=" + new Date().getTime();
      }
    }
    this.contractLog = this.currentContract.lstContractLog;
  }
  formatDateFromServer(inputDate) {
    var d = new Date(inputDate),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  jqueryCode() {

  }
  displayDialog(message: string) {
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
      this.displayDialog(CommonMessage.OverCapacity)
    }
  }
  deleteRoom(obj) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: 'Bạn chắc chắn muốn xóa khách thuê không?'
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
  removeFieldModal(){
    $('#tenant-name').val('');
    $('#tenant-phone').val('');
    $('#tenant-address').val('');
    $('#tenant-sex').val('');
    $('#imgArnFront').attr('src','');
    $('#imgArnBack').attr('src','');
  }
  searchByPhone() {
    if (!this.capacity) {
      this.displayDialog(CommonMessage.SelectRoomFirst)
      return;
    }
    this.currentTenant = '';
    if (!this.createContractFormGroup.controls['tenantSearch'].hasError('pattern')) {
      let data: any = {
        phone: this.createContractFormGroup.value.tenantSearch
      }
      this.addLoading();
      this.service.searchTenantByPhone(data).subscribe(
        res => {
          this.removeLoading();
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            this.removeFieldModal();
            let data = JSON.parse(response.data);
            $('#tenant-name').val(data.user.name);
            $('#tenant-phone').val(data.user.phone);
            if(data.user.address){
              //xoa - o thon-xom
              let remove = data.user.address.split('-');
              if(remove[0].length == 0 && remove[1].length > 0){
                $('#tenant-address').val(remove[1] +'-'+ remove[2] +'-'+ remove[3]);
              }
              else{
                $('#tenant-address').val(data.user.address);
              }
            }
            if (data.user.sex == 0) {
              $('#tenant-sex').val('Giới tính khác');
            }
            if (data.user.sex == 1) {
              $('#tenant-sex').val('Nam');
            }
            if (data.user.sex == 2) {
              $('#tenant-sex').val('Nữ');
            }
            if (data.imgArnFront) {
              $('#imgArnFront').attr('src', data.imgArnFront.trim() + "?date=" + new Date().getTime());
            }
            if (data.imgArnBack) {
              $('#imgArnBack').attr('src', data.imgArnBack.trim() + "?date=" + new Date().getTime());
            }
            $('#tenant-date').val(this.formatDateDisplay(data.user.dateOfBirth));
            $('#modal2').modal('show');
            this.currentTenant = data;
          }
          else if (response.type == 2) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              width: '400px',
              data: 'Không tìm thấy khách thuê!!! Bạn có muốn thêm khách thuê có số điện thoại ' + this.createContractFormGroup.value.tenantSearch + ' không?'
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.createTenantFormGroup.reset();
                this.createTenantFormGroup.get('phone').setValue(this.createContractFormGroup.value.tenantSearch);
                this.createTenantFormGroup.controls['phone'].disable();
                $('#modal4').modal('show');
              }
            });

          }
        }, err => {
          this.removeLoading();
          console.log(err);
        })
    }
    else{
      this.showErr('Vui lòng nhập đúng số điện thoại')
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
      width: '450px',
      data: 'Bạn chắc chắn muốn xóa ảnh hợp đồng không?'
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
  // don't update startDate if contract is running
  checkStartDateValid(): boolean {
    let startDate = new Date(this.currentContract.startDate);
    let startDateInput = new Date(this.startDateStr);
    let today = new Date();
    if (!this.compareDate(startDate, startDateInput)) {
      if (today > startDate) {
        return false;
      }
    }
    else {
      return true;
    }
  }
  compareDate(date1, date2) {
    return (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())
  }
  onSubmit() {
    if (this.isDisable) {
      return;
    }
    console.log(this.createContractFormGroup.value)
    if (!this.createContractFormGroup.value.period || this.createContractFormGroup.value.period == '') {
      this.displayDialog(CommonMessage.DateFormat)
      return;
    }

    else if (this.createContractFormGroup.invalid) {
      this.displayDialog(CommonMessage.inputAllFiel)
      return;
    }
    if (this.checkStartDateValid() == false) {
      this.displayDialog('Không thể sửa thời gian bắt đầu của hợp đồng đã được bắt đầu.');
      this.createContractFormGroup.get('beginDate').setValue(this.formatDateFromServer(this.currentContract.startDate));
      let startDate = this.formatDateFromServer(this.currentContract.startDate);
      this.startDateStr = this.formatDate(startDate);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: "Bạn chắc chắn muốn lưu thay đổi không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
            if (this.listImg[index].includes('?date=')) {
              let tmp = this.listImg[index].split('?date=');
              listImgSplit.push(tmp[0]);
            }
            else{
              listImgSplit.push(this.listImg[index])
            }
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
        console.log(data);
        this.addLoading();
        this.service.updateContract(data).subscribe(
          res => {
            this.removeLoading();
            let response = JSON.parse("" + res);
            if (response.type == 1) {
              // this.displayDialog(response.message);
              this.showSuccess(response.message);
              setTimeout(() => { this.router.navigate(['/landlord/contract']) }, 1500);
            }
            else {

              this.showErr(response.message);
              this.displayDialog(response.message);
            }
          }, err => {
            this.removeLoading();
            this.showErr(CommonMessage.defaultErrMess);
            // this.displayDialog(CommonMessage.defaultErrMess);
            console.log(err);
          })
      }
    })

  }
  uploadImage(imageResult: ImageResult) {
    if (this.listImg.length < 5) {
      if (imageResult.error) {
        this.showErr('Vui lòng tải lên đúng định dạng ảnh')
      }
      else {
        let image = (imageResult.resized && imageResult.resized.dataURL) || imageResult.dataURL;
        this.getOrientation(imageResult.file, (orientation) => {
          this.rotateImageFileProcessor.process(orientation +','+image).then(res => {
            this.listImg.push(res);
          });
        });
      }
    }
  }

  getOrientation(file, callback) {
    var reader: any,
    target: EventTarget;
    reader = new FileReader();
    reader.onload = (event) => {
      var view = new DataView(event.target.result);
      if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
      var length = view.byteLength,
        offset = 2;
      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) {
            return callback(-1);
          }
          var little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;

          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + (i * 12), little) == 0x0112)
              return callback(view.getUint16(offset + (i * 12) + 8, little));
        }
        else if ((marker & 0xFF00) != 0xFF00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1);
    };
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  };


  // add tenant 
  onChangeProvince() {
    this.placeService.getDistric(this.createTenantFormGroup.value.province.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.createTenantFormGroup.get('distric').setValue(arr[0]);
      this.onChangeDistric();
      this.dataDistric = arr;
    });
  };
  onChangeDistric() {
    this.placeService.getWards(this.createTenantFormGroup.value.distric.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.createTenantFormGroup.get('wards').setValue(arr[0]);
      this.dataWards = arr;
    });
  };
  onSubmitTenant() {
    let address = '';
    if (this.createTenantFormGroup.value.address) {
      let address = this.createTenantFormGroup.value.address.replace(/-/g, ' ');
    }
    let fullAddress = '';
    if (this.createTenantFormGroup.value.wards) {
      fullAddress = address.trim() + "-" + this.createTenantFormGroup.value.wards.name + "-" + this.createTenantFormGroup.value.distric.name + "-" + this.createTenantFormGroup.value.province.name;
    }

    let tenant = {
      user: {
        name: this.createTenantFormGroup.value.name,
        phone: this.createTenantFormGroup.get('phone').value,
        address: fullAddress,
        dateOfBirth: this.createTenantFormGroup.value.dateOfBirth ? this.formatDate(this.createTenantFormGroup.value.dateOfBirth) : null,
        sex: this.createTenantFormGroup.value.sex,
      },
      role: 2,
      status: 3
    }

    console.log(tenant);
    this.addLoading();
    this.userService.submit(tenant).subscribe(
      res => {
        this.removeLoading();
        let mess: any;
        mess = JSON.parse("" + res);
        console.log(mess)
        if (mess.type == 1) {
          this.showSuccess(mess.message);
          $('#modal4').modal('hide');
          this.searchByPhone();
        }
        if (mess.type == 0) {
          this.showErr(mess.message)
        }
      },
      err => {
        this.removeLoading();
        console.log(err);
        this.showErr(CommonMessage.defaultErrMess)
      }
    );
  }


}
