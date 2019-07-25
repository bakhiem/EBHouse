import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Equipment } from '../../models/equipment';
import { Admin } from '../../models/admin';
import { AuthenticationService } from '../../user/service/authentication.service';

import { CommmonFunction } from '../../shared/common-function';
import { CommonMessage, Message } from '../../models/message';
import { ISubscription } from "rxjs/Subscription";

import { SharedServiceService } from '../../service/shared-service.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  dataSourceEquipment = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'cDate', 'mDate', 'status', 'action'];
  listEquipment: any[] = [];
  totalEquipment: number = 0;
  currentPage: number = 1;
  perPage: number = 5;

  private subscription: ISubscription;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private service: AdminService,
    private toastr : ToastrService
  ) {}

  ngOnInit() {
    this.getEquipmentByPage(this.currentPage);
  }

  getEquipmentByPage(currentPage: number){
    this.addLoading();
    this.service.getEquipmentByPage({ page: currentPage-1}).subscribe(
      res => {
        let response = JSON.parse("" + res);
        console.log(response);
        if (response.type == 1) {
          if(response.data != null){
            let data = response.data;
              console.log(data.listEquipment);
              this.listEquipment = data.listEquipment;
              this.totalEquipment = data.totalEquipment[0];
          }
          this.dataSourceEquipment.data = this.listEquipment;
        } else {
          this.showErr(response.message);
        }
        this.removeLoading();
      },
      err => {
        this.showErr(CommonMessage.defaultErrMess);
        this.removeLoading();
      }
    )
  }

  creatEquiment(){

  }

  editEquipment(row){

  }

  deleteEquipment(row){

  }

  pageChanged(page){
    this.currentPage = page;
    this.getEquipmentByPage(this.currentPage);
  }

  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }

  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }

  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }

  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
}
