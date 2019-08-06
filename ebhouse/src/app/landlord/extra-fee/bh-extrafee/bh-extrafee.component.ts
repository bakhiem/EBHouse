import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LandlordService } from '../../service/landlord-service.service';
import { ISubscription } from "rxjs/Subscription";
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { CommmonFunction } from '../../../shared/common-function';
import { SharedServiceService } from '../../../service/shared-service.service';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { CommonMessage, Message } from '../../../models/message';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { InformationDialogComponent } from '../../../shared/info-dialog/information-dialog.component';
import { CustomDateAdapterMonth } from '../../contract/customDate';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-bh-extrafee',
  templateUrl: './bh-extrafee.component.html',
  styleUrls: ['./bh-extrafee.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapterMonth }
  ]
})
export class BhExtrafeeComponent implements OnInit, OnDestroy {


  //paging
  perPage: number = 5;
  currentPage: number = 1;
  totalPage: number = 0;
  private subscription: ISubscription;
  currentBh: any;
  listExtrafee: any[];
  dataSource = new MatTableDataSource();

  createEFFormGroup: FormGroup;
  isEdit: number;
  constructor(private service: LandlordService,
    private shareService: SharedServiceService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService) { }
  month: FormControl;
  displayedColumns: string[] = ['amount', 'description', 'date', 'customColumn'];

  ngOnInit() {
    this.month = new FormControl({ value: new Date(), disabled: true });
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.getExtrafee();
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
      roomID: -1
    }
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
          this.dataSource.data = this.listExtrafee;
          console.log(this.listExtrafee);
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
  //search room

  editEF(obj) {
    this.isEdit = 1;
    console.log(obj);
    this.createEFFormGroup.reset();
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
      this.disableForm();
      this.isEdit = 3;
    }
    else {
      this.enableForm();
      this.isEdit = 1;
    }
    $('.bd-example-modal-lg').modal('show');
  }
  enableForm() {
    $("#decrease").prop("disabled", false);
    $("#increase").prop("disabled", false);
    this.createEFFormGroup.get('cDate').enable();
    this.createEFFormGroup.get('description').enable();
    this.createEFFormGroup.get('price').enable();
  }

  disableForm() {
    this.createEFFormGroup.get('cDate').disable();
    this.createEFFormGroup.get('description').disable();
    this.createEFFormGroup.get('price').disable();
    $("#decrease").attr('disabled', 'true');
    $("#increase").attr('disabled', 'true');
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
    $('#date-create').val(this.formatDateStr('', 2));
    this.createEFFormGroup.reset();
    this.enableForm();
    this.isEdit = 0;
    $('.bd-example-modal-lg').modal('show');
  }
  onSubmit() {
    if (this.createEFFormGroup.invalid) {
      this.displayDialog(CommonMessage.inputAllFiel)
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: "Bạn chắc chắn muốn lưu không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
              room: { id: -1 },
              description: this.createEFFormGroup.value.description.trim().replace(/"/g, "\\\""),
              amount: amount,
              cDate: this.createEFFormGroup.value.cDate
            },
            isLandlord: true,
            boardingHouseID: this.currentBh.id,
          }
        }
        else if (this.isEdit == 0) {
          data = {
            extraFee: {
              id: 0,
              room: { id: -1 },
              description: this.createEFFormGroup.value.description.trim().replace(/"/g, "\\\""),
              amount: amount
            },
            isLandlord: true,
            boardingHouseID: this.currentBh.id
          }
        }
        console.log(JSON.stringify(data));
        this.addLoading();
        this.service.addExtrafee(data).subscribe(
          res => {
            this.successRequestHandle(res);
          }, err => {
            this.errRequestHandle(err);
          })
      }
    })

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
      data: "Bạn chắc chắn muốn xóa chi phí khác không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let element = this.listExtrafee[index];
        let data = {
          amount: element.amount,
          description: element.description,
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
