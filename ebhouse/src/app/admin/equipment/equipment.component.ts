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
import { EquipmentServiceService } from "../../landlord/service/equipment-service.service"
import { SharedServiceService } from '../../service/shared-service.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  createEquipmentFormGroup: FormGroup;
  dataSourceEquipment = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'cDate', 'mDate', 'status', 'action'];
  listEquipment: any[] = [];
  totalEquipment: number = 0;
  currentPage: number = 1;
  perPage: number = 5;
  isEdit: number = 0;
  myDate: Date = new Date();
  equipment: Equipment = new Equipment();
  check: number = 0;
  listDataEquipment: any[];

  private subscription: ISubscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private service: AdminService,
    private equipmentService: EquipmentServiceService,
    private toastr : ToastrService
  ) {
  }

  ngOnInit() {
    this.subscription = this.service.listEquipment.subscribe((data) => {
      this.getEquipmentByPage(this.currentPage);
    });
    this.createEquipmentFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([Validators.required])),
      id: this.fb.control(''),
    });
  }

  getEquipmentByPage(currentPage: number){
    this.addLoading();
    this.service.getEquipmentByPage({ page: currentPage-1}).subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          if(response.data != null){
            let data = response.data;
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

  onSubmit(){
    if (!this.createEquipmentFormGroup.invalid && this.createEquipmentFormGroup.value.name.trim() != "") {
      this.addLoading();
      if(this.equipment.name != this.createEquipmentFormGroup.value.name){
        this.equipment.name = this.createEquipmentFormGroup.value.name;
        this.service.addOrUpdateEquipment({equipment: this.equipment}).subscribe(
            res => {
              this.removeLoading();
              let response = JSON.parse('' + res);
              if (response.type == 1) {
                this.service.listEquipment.next(1);
                $("#creatEquipment").modal('toggle');
                this.showSuccess(response.message);
              } else {
                this.showErr(response.message);
              }
            },
            err => {
              this.showErr(CommonMessage.defaultErrMess);
            }
          );
      }else{
        this.check = 1;
        this.removeLoading();
      }
    } else {
      this.showErr(CommonMessage.inputAllFiel);
    }

  }

  addOrEditEquipment(flag, row, index){
    $("#creatEquipment").modal('toggle');
    this.createEquipmentFormGroup.reset();
    this.isEdit = 0;
    this.check = 0;
    this.isEdit = flag;
    this.equipment.id = null;
    this.equipment.name = "";
    if(flag == 1){
      this.equipment.id = row.id;
      this.equipment.name = row.name;
      this.createEquipmentFormGroup.get('name').setValue(row.name);
      this.createEquipmentFormGroup.get('id').setValue(row.id);
    }
  }

  deleteOrActiveEquipment(row, index){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Bạn chắc chắn muốn thay đổi trạng thái tiện ích không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addLoading();
        this.service.deleteOrActiveEquipment({ equipment: { id: row.id, status: row.status, name: row.name }}).subscribe(
          res => {
            let response = JSON.parse("" + res);
            if (response.type == 1) {
              this.service.listEquipment.next(1);
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
    });
  }

  activeEquipment(row, index){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Bạn chắc chắn khôi phục tiện ích không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addLoading();
        this.service.activeEquipment({ equipment: { id: row.id, status: row.status, name: row.name }}).subscribe(
          res => {
            let response = JSON.parse("" + res);
            if (response.type == 1) {
              this.service.listEquipment.next(1);
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
    });
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
