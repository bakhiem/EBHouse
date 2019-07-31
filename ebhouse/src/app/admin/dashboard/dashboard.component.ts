import { Component, OnInit } from '@angular/core';
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
import { EquipmentServiceService } from "../../landlord/service/equipment-service.service"
import { SharedServiceService } from '../../service/shared-service.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'address', 'phone', 'total_room', 'total_room_register', 'total_user'];
  list: any[] = [];
  totalLandlord: number = 0;
  totalRoom: number = 0;
  totalTenant: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  isEdit: number = 0;
  myDate: Date = new Date();
  equipment: Equipment = new Equipment();
  check: number = 0;
  listData: any[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private service: AdminService,
    private equipmentService: EquipmentServiceService,
    private toastr : ToastrService
    ) { }

  ngOnInit() {
    this.getDataByPage(this.currentPage);
  }

  getDataByPage(currentPage: number){
    this.addLoading();
    this.service.dashboard({ page: currentPage-1}).subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          if(response.data != null){
            let data = response.data;
            console.log(data);
            this.list = data.listLandlord;
            this.totalLandlord = data.totalLandlord.total;
            this.totalRoom = data.totalRoom.total;
            this.totalTenant = data.totalTenant.total;
          }
          this.dataSource.data = this.list;
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

  pageChanged(page){
    this.currentPage = page;
    this.getDataByPage(this.currentPage);
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
