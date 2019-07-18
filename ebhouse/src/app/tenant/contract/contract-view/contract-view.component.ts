import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { TenantServiceService } from '../../service/tenant-service.service';
import { ToastrService } from 'ngx-toastr';
import { CommonMessage } from '../../../models/message';
import { ISubscription } from "rxjs/Subscription";
//date picker angular

import { Router } from '@angular/router';

import { Contract, Tenant, } from '../../../models/contract';

import { SharedServiceService } from '../../../service/shared-service.service';
@Component({
  selector: 'app-contract-view',
  templateUrl: './contract-view.component.html',
  styleUrls: ['./contract-view.component.css'],
  providers: [],
})
export class ContractViewComponent implements OnInit, OnDestroy {
  startDateStr: any;
  endDateSrt: any;
  minDate = new Date();
  capacity: number;

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
  listImg = [];
  currentContract: any;

  contractLog: any[];

  displayedColumnsContractLog: string[] = ['cDate', 'content'];
  displayedColumns: string[] = ['name', 'phone', 'address'];
  listTenant = [];
  dataSource = new MatTableDataSource()


  private subscription: ISubscription;
  listContractDisplay: string[] = [];
  listContract: Contract[];
  constructor(
    private fb: FormBuilder,
    private service: TenantServiceService,
    private router: Router,
    private toastr: ToastrService) {
      this.createContractFormGroup = this.fb.group({
        room: { value: '', disabled: true },
        owner: { value: '', disabled: true },
        deposit: { value: '', disabled: true },
        price: { value: '', disabled: true },
        beginDate: { value: '', disabled: true },
        endDate:  { value: '', disabled: true },
        period: { value: '', disabled: true },
        description: { value: '', disabled: true }
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
      console.log(this.currentContract)
    });
    if (this.currentContract == null) {
      this.router.navigate(['/tenant/contract']);
    }
    else {
      let startDate = this.formatDateDisplay(this.currentContract.start_date)
      let endDate = this.formatDateDisplay(this.currentContract.end_date)
      this.createContractFormGroup.get('room').setValue(this.currentContract.roomName);
      this.createContractFormGroup.get('owner').setValue(this.currentContract.owner);
      this.createContractFormGroup.get('deposit').setValue(this.convertCurrency(this.currentContract.deposit));
      this.createContractFormGroup.get('price').setValue(this.convertCurrency(this.currentContract.room_price));
      this.createContractFormGroup.get('beginDate').setValue(startDate);
      this.createContractFormGroup.get('endDate').setValue(endDate);
      this.createContractFormGroup.get('period').setValue(this.calPeriod(startDate,endDate));
      this.createContractFormGroup.get('description').setValue(this.currentContract.owner);

      this.dataSource.data = this.currentContract.tenantList;
      this.contractLog = JSON.parse(this.currentContract.listLog)
      if(this.currentContract.contract_img){
        this.listImg = this.currentContract.contract_img.split(',')
      }
    }

  }
  convertCurrency(value): string {
    let currency = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return currency
  }
  calPeriod(startMonth, endMonth) {
    let monthBegin = startMonth.split('-');
    let monthEnd = endMonth.split('-');
    let month = (Number(monthEnd[2]) - Number(monthBegin[2])) * 12 + (Number(monthEnd[1]) - Number(monthBegin[1]));
    return month + 1;
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
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
}
