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
import { Options, ImageResult } from "ngx-image2dataurl";

import { ISubscription } from "rxjs/Subscription";
//date picker angular

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { CustomDateAdapter } from '../customDate'

import { SharedServiceService } from '../../../service/shared-service.service';
import { CommmonFunction } from '../../../shared/common-function';
//add new tenant
import { PlaceService } from '../../../service/place.service';
import { UserService } from '../../../user/service/user.service';
import { RotateImageFileProcessor } from '../../../shared/image-rotate';
@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
})
export class CreateContractComponent implements OnInit, OnDestroy {
  startDateStr: any;
  endDateSrt: any;
  minDate = new Date();
  CommonMessage = CommonMessage;
  dataDistric: any[];
  dataWards: any[];
  dataProvince: any[];
  rotateImageFileProcessor = new RotateImageFileProcessor();
  createTenantFormGroup: FormGroup;
  //Message
  monthStartSelected(params, datepicker) {
    params.setDate(1);
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
    datepicker.close();
  }

  checkValidDate(d: Date, type: number): boolean {
    if (!this.listContract) {
      this.displayDialog(CommonMessage.SelectRoomFirst)
      return false;
    }
    // else if (this.listContract.length == 0 && this.availableInThisMonth) {
    //   return true;
    // }
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
              this.displayDialog(CommonMessage.HaveContractInDate)
              return false;
            }
          }
        }
        if (type == 1) {
          if (this.createContractFormGroup.get('beginDate').value) {
            if (this.createContractFormGroup.get('beginDate').value <= startdate && d >= enddate) {
              this.displayDialog(CommonMessage.HaveContractInDate)
              return false;
            }
          }
        }

      }
      // check availableInThisMonth
      let d1 = new Date();
      if (d1.getMonth() == d.getMonth() && d1.getFullYear() == d.getFullYear() && type == 0) {
        if (this.availableInThisMonth == false) {
          this.displayDialog(CommonMessage.HaveDisableContractInMonth)
          return false;
        }
        if (this.extraFeeList.length > 0) {
          $('#modal3').modal('show');
        }
      }
      return true;




      //check if room has extrafee in month

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
  phonePattern = '((09|03|07|08|05)([0-9]{8}))';
  listImg = [];
  capacity: number;
  isExtraFee = 0;
  displayedColumns: string[] = ['name', 'phone', 'customColumn'];
  listTenant = [];
  dataSource = new MatTableDataSource()
  //resize image
  options: Options = {
    resize: {
      maxHeight: 1000,
      maxWidth: 10000
    },
    allowedExtensions: ['JPG', 'PnG', 'JPEG']
  };
  //extra fee
  extraFeeList: any[] = [];
  private subscription: ISubscription;
  listContractDisplay: string[] = [];
  listContract: Contract[];
  filteredOptions: Observable<any[]>;
  availableInThisMonth: boolean = true;
  constructor(
    private shareService: SharedServiceService,
    private zone: NgZone,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private router: Router,
    private toastr: ToastrService,
    private placeService: PlaceService,
    private userService: UserService, ) {
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
      description: '',
      sex: ''
    });

    this.createTenantFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([Validators.required])),
      id: '',
      phone: '',
      province: '',
      distric: '',
      wards: '',
      address: '',
      dateOfBirth: { value: '', disabled: true },
      sex: ''
    });


  }

  ngOnInit() {
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.getRoomsFromCurrentBh();
        this.resetFormChangeBh();
      }
      else if (this.currentBh) {
        this.showInfo(CommonMessage.InputBh)
      }
    })
    this.formatCurrency();
    this.jqueryCode();

    this.placeService.getProvince().subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataProvince = arr;
      this.dataWards = null;
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
  resetFormChangeBh() {
    this.listImg = [];
    this.listTenant = [];
    this.dataSource.data = [];
    $("#customCheck1").prop("checked", false);
    $('#mycollapse').collapse('hide');
    $('#extraFee').val('');
    this.isExtraFee = 0;
    this.listContractDisplay = [];
  }

  displayDialog(message: string) {
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
          for (let index = 0; index < this.roomList.length; index++) {
            if (this.roomList[index].status == 0) {
              this.roomList.splice(index, 1);
              index--;
            }
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
      width: '450px',
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
  removeFieldModal() {
    $('#tenant-name').html('');
    $('#tenant-phone').html('');
    $('#tenant-address').html('');
    $('#tenant-sex').html('');
    $('#tenant-date').html('');

  }
  searchByPhone() {
    if (!this.capacity) {
      this.displayDialog(CommonMessage.SelectRoomFirst)
      return;
    }
    this.currentTenant = '';
    console.log(this.createContractFormGroup.get('tenantSearch').value == null)
    if (!this.createContractFormGroup.controls['tenantSearch'].hasError('pattern') && this.createContractFormGroup.get('tenantSearch').value) {
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
            let data = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data));
            $('#tenant-name').html(data.user.name);
            $('#tenant-phone').html(data.user.phone);
            if (data.user.address) {
              //xoa - o thon-xom
              let remove = data.user.address.split('-');
              if (remove[0].length == 0 && remove[1].length > 0) {
                $('#tenant-address').html(remove[1] + '-' + remove[2] + '-' + remove[3]);
              }
              else {
                $('#tenant-address').html(data.user.address);
              }
            }
            if (data.user.sex == 0) {
              $('#tenant-sex').html('Giới tính khác');
            }
            if (data.user.sex == 1) {
              $('#tenant-sex').html('Nam');
            }
            if (data.user.sex == 2) {
              $('#tenant-sex').html('Nữ');
            }
            if(data.user.dateOfBirth && data.user.dateOfBirth.toLowerCase() != 'null'){
              $('#tenant-date').html(this.formatDateDisplay(data.user.dateOfBirth));
            }
            $('#modal2').modal('show');
            this.currentTenant = data;
          }
          else if (response.type == 2) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              width: '400px',
              data: 'Không tìm thấy khách thuê! Bạn có muốn thêm khách thuê có số điện thoại ' + this.createContractFormGroup.value.tenantSearch + ' không?'
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
    else {
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
  onChooseRoom(value) {
    console.log(value)
    //reset form
    this.createContractFormGroup.reset();
    this.listImg = [];
    $('#extraFee').val('');
    $('#customCheck1').prop('checked', false);
    $('#mycollapse').collapse('hide');
    this.isExtraFee = 0;
    this.listTenant = [];
    this.dataSource.data = [];
    // set capacity and room price, format room price
    this.createContractFormGroup.get('room').setValue(value);
    this.capacity = Number(value.capacity);
    let currency = value.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    this.createContractFormGroup.get('price').setValue(currency);
    this.listContractDisplay = []
    // print alert start date and end date of contract in room
    let data = {
      id: value.id
    }
    this.addLoading()
    this.service.getContractByRoom(data).subscribe(
      res => {
        // this.removeLoading();
        let response = JSON.parse("" + res);
        console.log(response)
        this.getExtraFee(value);
        if (response.type == 1) {
          this.listContract = response.data.lstDate;
          this.availableInThisMonth = response.data.availableInThisMonth;
          let display = [];
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
  getCurrentDate(): string {
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return year + '-' + month
  }
  getExtraFee(value) {
    let data = {
      roomID: value.id,
      date: this.getCurrentDate() + '-01'
    }
    this.service.getOtherExtraFee(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);

        if (response.type == 1) {
          this.extraFeeList = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data));
          console.log(this.extraFeeList)
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
  displayFn(room?: any): string | undefined {
    return room ? room.name : undefined;
  }
  saveExtraFee() {

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
    let d = new Date();
    let dStart = new Date(this.startDateStr);
    let listExtraFeeSend = [];
    if (d.getMonth() == dStart.getMonth() && d.getFullYear() == dStart.getFullYear()) {
      if (this.extraFeeList.length > 0) {
        for (let index = 0; index < this.extraFeeList.length; index++) {
          const element = this.extraFeeList[index];
          if ($('#tenant-' + element.id).is(':checked')) {
            let elm = {
              id: element.id
            }
            listExtraFeeSend.push(elm);
          }
        }
      }
    }

    if (this.checkRoomValid()) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: "Bạn chắc chắn muốn lưu thông tin hợp đồng không?"
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
              description: this.createContractFormGroup.value.description ? this.createContractFormGroup.value.description.trim().replace(/"/g, "\\\"") : '',

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
            extraFeeUpdate: listExtraFeeSend,
          }
          console.log(JSON.stringify(data))
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
  isMorethan5Image = false;
  uploadImage(imageResult: ImageResult) {
    if (this.listImg.length < 5) {
      if (imageResult.error) {
        this.showErr('Vui lòng tải lên đúng định dạng ảnh')
      }
      else {
        this.isMorethan5Image = false;
        let image = (imageResult.resized && imageResult.resized.dataURL) || imageResult.dataURL;
        this.getOrientation(imageResult.file, (orientation) => {
          this.rotateImageFileProcessor.process(orientation + ',' + image).then(res => {
            this.listImg.push(res);
          });
        });
      }
    }
    else {
      if (this.isMorethan5Image) {

      }
      else {
        this.isMorethan5Image = true;
        this.showErr('Tải lên nhiều nhất 5 ảnh')
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

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.roomList.filter(roomList => roomList.name.toLowerCase().indexOf(filterValue) === 0);
  }
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
      address = this.createTenantFormGroup.value.address.replace(/-/g, ' ').replace(/"/g, "\\\"");
    }
    let fullAddress = '';
    if (this.createTenantFormGroup.value.wards) {
      fullAddress = address.trim() + "-" + this.createTenantFormGroup.value.wards.name + "-" + this.createTenantFormGroup.value.distric.name + "-" + this.createTenantFormGroup.value.province.name;
    }
    if (this.createTenantFormGroup.get('name').value.trim() == '') {
      this.showErr('Vui lòng nhập họ tên hợp lệ');
      return;
    }
    let tenant = {
      user: {
        name: this.createTenantFormGroup.value.name.trim().replace(/"/g, ""),
        phone: this.createTenantFormGroup.get('phone').value,
        address: fullAddress,
        dateOfBirth: this.createTenantFormGroup.get('dateOfBirth').value ? this.formatDate(this.createTenantFormGroup.get('dateOfBirth').value) : null,
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
