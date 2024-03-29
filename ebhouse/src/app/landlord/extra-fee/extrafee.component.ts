import { Component, OnInit, OnDestroy } from '@angular/core';
import { Calculating, Utility } from '../../models/utility';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LandlordService } from '../service/landlord-service.service';
import { ISubscription } from "rxjs/Subscription";
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { CommmonFunction } from '../../shared/common-function';
import { SharedServiceService } from '../../service/shared-service.service';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { CommonMessage, Message } from '../../models/message';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { InformationDialogComponent } from '../../shared/info-dialog/information-dialog.component';
import { CustomDateAdapterMonth } from '../contract/customDate';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-extrafee',
  templateUrl: './extrafee.component.html',
  styleUrls: ['./extrafee.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapterMonth }
  ]
})
export class ExtraFeeComponent implements OnInit, OnDestroy {


  //paging
  perPage: number = 5;
  currentPage: number = 1;
  totalPage: number = 0;
  private subscription: ISubscription;
  currentBh: any;
  listExtrafee: any[];
  roomList: any[];
  roomControl = new FormControl();
  dataSource = new MatTableDataSource();
  roomControlCreate = new FormControl();
  filteredOptions: Observable<any[]>;

  filteredOptionsCreate: Observable<any[]>;
  createEFFormGroup: FormGroup;
  isEdit: number;
  roomListCreate: any[];
  constructor(private service: LandlordService,
    private shareService: SharedServiceService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService) { }
  month: FormControl;
  haveContractInMonth = false;
  displayedColumns: string[] = ['room', 'amount', 'description', 'date', 'payer','customColumn'];

  ngOnInit() {
    this.month = new FormControl({ value: new Date(), disabled: true });
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.getRoomsFromCurrentBh();
      }
      else if (this.currentBh) {
        this.showInfo(CommonMessage.InputBh)
      }

    })
    this.createEFFormGroup = this.fb.group({
      price: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      id: '',
      cDate: '',
      description: this.fb.control('', Validators.compose([
        Validators.required
      ])),
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
  chooseMonth(params, datepicker) {
    params.setDate(1);
    this.month.setValue(params);
    this.currentPage = 1;
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
  getRoomName(roomId): string {
    for (let index = 0; index < this.roomList.length; index++) {
      const element = this.roomList[index];
      if (element.id == roomId) {
        return element;
      }
    }
    return '';
  }
  formatDateStr(date, type) {
    var d;
    if (type == 1) {
      d = new Date(date)
    }
    else {
      d = new Date();
    }
    var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('-');
  }

  private getExtrafee() {
    if (!this.currentBh.id) {
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
    this.service.getExtrafee(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        console.log
        if (response.type == 1) {
          let resData = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data))
          this.listExtrafee = resData.extraFee;
          this.totalPage = resData.totalPage;

          for (let index = 0; index < this.listExtrafee.length; index++) {
            const element = this.listExtrafee[index];
            let roomObj = this.getRoomName(element.room);
            this.listExtrafee[index].roomObj = roomObj;
          }
          this.dataSource.data = this.listExtrafee;
        }
        else {
          this.showErr(CommonMessage.defaultErrMess);
        }
      }, err => {
        this.showErr(CommonMessage.defaultErrMess);
        this.removeLoading();
        console.log(err);
      })
  }

  ngAfterViewInit() {
    this.formatCurrency();
  }
  jqueryCode() {

  }

  //search room
  getRoomsFromCurrentBh() {
    let data: any = {
      boardingHouseID: this.currentBh.id
    }
    this.addLoading();
    this.service.getRoomsAvailable(data).subscribe(
      res => {
        try {
          let response = JSON.parse("" + res);
          console.log(response)
          if (response.type == 1) {
            let data = response.data;
            this.roomListCreate = data.slice(0);
            let elementAll = {
              name: 'Tất cả',
              id: 0
            }
            data.unshift(elementAll)
            this.roomList = data.slice(0);
            this.getExtrafee();
            for (let index = 0; index < this.roomListCreate.length; index++) {
              if (this.roomListCreate[index].status == 0) {
                this.roomListCreate.splice(index, 1);
                index--;
              }
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

            this.filteredOptionsCreate = this.roomControlCreate.valueChanges
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
                map(name => name ? this._filter2(name) : this.roomListCreate.slice())
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
    if (!this.roomControl.value) {
      this.roomControl.setValue(this.roomList[0]);
      this.currentPage = 1;
      this.getExtrafee();
      return;
    }
    this.roomList.forEach(element => {
      if (element.name == this.roomControl.value || element.name == this.roomControl.value.name) {
        this.roomControl.setValue(element);
        isValid = 1;
        this.currentPage = 1;
        this.getExtrafee();
        return;
      }
    });
    console.log(this.roomControl.value)

    if (isValid == 0) {
      this.displayDialog('Không tồn tại phòng');
    }
  }

  editEF(obj) {
    if (obj.status != 12 && obj.status != 13) {
      this.onChooseRoom(obj.roomObj);
    }

    this.isEdit = 1;
    console.log(obj);
    this.createEFFormGroup.reset();
    this.roomControlCreate.setValue(obj.roomObj);
    this.roomControlCreate.disable();
    $('#date-create').val(this.formatDateStr(obj.cDate, 1));
    this.createEFFormGroup.get('cDate').setValue(obj.cDate);
    this.createEFFormGroup.get('description').setValue(obj.description);
    this.createEFFormGroup.get('id').setValue(obj.id);
    if (obj.amount < 0) {
      $('#decrease').prop('checked', true)
      $('#increase').prop('checked', false)
      let positiveNumber = Number(obj.amount) * -1
      let currency = positiveNumber.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      this.createEFFormGroup.get('price').setValue(currency);
    }
    else {
      $('#decrease').prop('checked', false)
      $('#increase').prop('checked', true)
      let currency = obj.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      this.createEFFormGroup.get('price').setValue(currency);
    }

    //last month and can't edit
    if (obj.status == 13) {
      this.disableForm(13);
      this.isEdit = 3;
    }
    else if (obj.status == 12) {
      this.disableForm(12);
      this.isEdit = 3;
    }
    else {
      this.enableForm();
      this.isEdit = 1;
      if (obj.status == 2) {
        $('#landlord').prop('checked', false);
        $('#tenant').prop('checked', true);
      } else if (obj.status == 3) {
        $('#landlord').prop('checked', true);
        $('#tenant').prop('checked', false);
      }
    }
    $('.bd-example-modal-lg').modal('show');
  }
  enableForm() {
    $("#landlord").prop("disabled", false);
    $("#tenant").prop("disabled", false);
    $("#decrease").prop("disabled", false);
    $("#increase").prop("disabled", false);
    this.createEFFormGroup.get('cDate').enable();
    this.createEFFormGroup.get('description').enable();
    this.createEFFormGroup.get('price').enable();
  }
  disableForm(status) {
    if (status == 13) {
      this.createEFFormGroup.get('cDate').disable();
      this.createEFFormGroup.get('description').disable();
      this.createEFFormGroup.get('price').disable();
      $('#landlord').prop('checked', true);
      $('#tenant').prop('checked', false);
      $("#landlord").attr('disabled', 'true');
      $("#tenant").attr('disabled', 'true');
      $("#decrease").attr('disabled', 'true');
      $("#increase").attr('disabled', 'true');
    }
    else if (status == 12) {
      this.createEFFormGroup.get('cDate').disable();
      this.createEFFormGroup.get('description').disable();
      this.createEFFormGroup.get('price').disable();
      $('#landlord').prop('checked', false);
      $('#tenant').prop('checked', true);

      $("#landlord").attr('disabled', 'true');
      $("#tenant").attr('disabled', 'true');
      $("#decrease").attr('disabled', 'true');
      $("#increase").attr('disabled', 'true');
    }
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.roomList.filter(roomList => roomList.name.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filter2(name: string): any[] {
    const filterValueCreate = name.toLowerCase();
    return this.roomListCreate.filter(roomList => roomList.name.toLowerCase().indexOf(filterValueCreate) === 0);
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
  createExtrafee() {
    if (!this.currentBh.id) {
      this.showErr(CommonMessage.InputBh);
      return;
    }
    if (!this.roomList) {
      this.showErr(CommonMessage.InputRoom);
      return;
    }
    $('#haveTenantMessage').html('');
    $('#date-create').val(this.formatDateStr('', 2));
    this.createEFFormGroup.reset();
    this.roomControlCreate.reset();
    this.roomControlCreate.enable();
    this.enableForm();
    this.isEdit = 0;
    $('.bd-example-modal-lg').modal('show');
  }
  checkRoomValid() {
    for (let i = 0; i < this.roomList.length; i++) {
      if (this.roomList[i].name == $('#room-name').val().toString().trim()) {
        this.roomControlCreate.setValue(this.roomList[i])
        return true;
      }
    }
    return false;
  }
  onChooseRoom(value) {
    let data = {
      id: value.id
    }
    this.addLoading()
    this.service.getContractByRoom(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          console.log(response.data)
          let listContract = response.data.lstDate;
          //check 
          let isAvailable = false;
          if (response.data.availableInThisMonth == false) {
            isAvailable = false;
            this.haveContractInMonth = false;
            this.handleAvailable(value.name);
          }
          if (listContract.length > 0) {
            for (let index = 0; index < listContract.length; index++) {
              const element = listContract[index];
              let toDay = new Date(this.month.value);
              let startDate = new Date(element.startDate);
              let endDate = new Date(element.endDate);
              console.log(toDay)
              toDay.setHours(0);
              toDay.setSeconds(0);
              toDay.setMilliseconds(0);
              toDay.setMinutes(0);
              if (startDate.getTime() <= toDay.getTime() && endDate.getTime() >= toDay.getTime()) {
                if (response.data.availableInThisMonth == true) {
                  this.haveContractInMonth = true;
                  isAvailable = true;
                  this.handleAvailable(value.name);
                  break;
                }
              }
            }
          }
          if (isAvailable == false) {
            this.haveContractInMonth = false;
            this.handleAvailable(value.name);
          }
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
  handleAvailable(name) {
    if (this.haveContractInMonth == false) {
      $('#haveTenantMessage').html('Phòng ' + name + ' không tồn tại khách thuê trong tháng ' + (Number(this.month.value.getMonth()) + 1));
      $('#landlord').prop('checked', true);
      $("#landlord").attr('disabled', 'true');
      $("#tenant").attr('disabled', 'true');
    }
    else {
      $('#haveTenantMessage').html('');
      $("#landlord").prop("disabled", false);
      $("#tenant").prop("disabled", false);
    }
  }
  onSubmit() {
    if (this.createEFFormGroup.invalid) {
      this.displayDialog(CommonMessage.inputAllFiel)
      return;
    }
    if (this.checkRoomValid()) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: "Bạn chắc chắn muốn lưu không?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        var amount = 0;
        if ($('#extraFee').val()) {
          let formatPrice = $('#extraFee').val().toString().split('.').join('');
          if ($('#increase').is(':checked')) {
            amount = Number(formatPrice);
          }
          else if ($('#decrease').is(':checked')) {
            amount = Number(formatPrice) * -1;
          }
        }
        let data;

        if (this.isEdit == 1) {
          data = {
            extraFee: {
              id: this.createEFFormGroup.value.id,
              room: { id: this.roomControlCreate.value.id },
              description: this.createEFFormGroup.value.description.trim().replace(/"/g, "\\\""),
              amount: amount,
              cDate: this.createEFFormGroup.value.cDate
            },
            boardingHouseID: this.currentBh.id,
            isLandlord: $('#landlord').is(':checked')
          }
        }
        else if (this.isEdit == 0) {
          data = {
            extraFee: {
              id: 0,
              room: { id: this.roomControlCreate.value.id },
              description: this.createEFFormGroup.value.description.trim().replace(/"/g, "\\\""),
              amount: amount
            },
            boardingHouseID: this.currentBh.id,
            isLandlord: $('#landlord').is(':checked')
          }
        }
        console.log(data)
        this.addLoading();
        this.service.addExtrafee(data).subscribe(
          res => {
            this.successRequestHandle(res);
          }, err => {
            this.errRequestHandle(err);
          })
     } })

    }
    else {
      this.displayDialog(CommonMessage.NoExitstRoom);
    }
  }

  successRequestHandle(res) {
    this.removeLoading();
    let resObject = JSON.parse("" + res);
    if (resObject.type == 1) {
      this.showSuccess(resObject.message);
      this.isEdit = 0;
      $('.bd-example-modal-lg').modal('hide');
      this.getExtrafee();
    }
    else {
      this.showErr(resObject.message);
    }
  }
  errRequestHandle(err) {
    this.showErr(CommonMessage.defaultErrMess);
    console.log(err);
    this.removeLoading();
  }
  deleteEF(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: "Bạn chắc chắn muốn xóa chi phí phát sinh không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let element = this.listExtrafee[index];
        let data = {
          amount: element.amount,
          description: element.description.trim().replace(/"/g, "\\\""),
          cDate: element.cDate,
          id: element.id,
          status: element.status,
          room: { id: element.room }
        }
        console.log(data)
        this.addLoading();
        this.service.deleteExtrafee(data).subscribe(
          res => {
            this.successRequestHandle(res);
          }, err => {
            this.errRequestHandle(err);
          }
        )
      }
    });
  }
  pageChanged(page) {
    this.currentPage = page;
    this.getExtrafee();
  }

}
