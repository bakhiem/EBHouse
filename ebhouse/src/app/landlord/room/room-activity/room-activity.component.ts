import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl} from '@angular/forms';
import { LandlordService } from '../../service/landlord-service.service';
import { ISubscription } from "rxjs/Subscription";
import { ToastrService } from 'ngx-toastr';
import { EquipmentServiceService } from '../../service/equipment-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommmonFunction } from '../../../shared/common-function';
import { CommonMessage, Message } from '../../../models/message';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { InformationDialogComponent } from '../../../shared/info-dialog/information-dialog.component';
import { CustomDateAdapterMonth } from '../../contract/customDate';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SharedServiceService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-room-activity',
  templateUrl: './room-activity.component.html',
  styleUrls: ['./room-activity.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapterMonth }
  ]
})
export class RoomActivityComponent implements OnInit,OnDestroy {
  //paging
  perPage: number = 5;
  currentPage: number = 1;
  totalPage: number = 0;
  private subscription: ISubscription;
  currentBh: any;
  dataSource = new MatTableDataSource();
  listRooms: any[];
  roomStatus: number = 3;
  constructor(private equipService : EquipmentServiceService,
    private service: LandlordService,
    private shareService: SharedServiceService,
    private toastr: ToastrService) { }

  month: FormControl;
  isSelectAllStatus: number = 0;
  dataEquipment : any[];
  chooseMonth(params, datepicker) {
    params.setDate(1);
    this.month.setValue(params);
    this.currentPage = 1;
    this.getRoomsInfo();
    datepicker.close();
  }

  getDisplayedColumns(): string[] {
    if (this.isSelectAllStatus == 1) {
      return [ 'room','roomType', 'price','area', 'numberTenant',  'listEquip','status', 'description'];
    }
    else {
      return [ 'room','roomType', 'price','area', 'numberTenant', 'listEquip', 'description'];
    }
  }
  ngOnInit() {
    this.month = new FormControl({ value: new Date(), disabled: true });
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      if (this.currentBh && this.currentBh.id) {
        this.currentPage = 1;
        if(this.dataEquipment){
          this.getRoomsInfo();
        }
        else{
          this.getEquipment();
        }
        
      }
      else if(this.currentBh){
        this.showInfo(CommonMessage.InputBh)
      } 
    });
  }
  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  
   getEquipment() {
    this.addLoading();
    this.equipService.getEquipment().subscribe(res => {
      this.removeLoading();
      let response = JSON.parse("" + res);
      if (response.type == 1) {
        this.dataEquipment = JSON.parse(response.data);
        this.getRoomsInfo();
      }
      else{
        this.dataEquipment = [];
        this.getRoomsInfo();
      }
    },
    err =>{
      this.removeLoading();
      console.log(err);
      this.showErr(CommonMessage.defaultErrMess);
    });
  }
  getEquipmentName(id) :string{
    for (let index = 0; index <  this.dataEquipment.length; index++) {
      const element =  this.dataEquipment[index];
      if(element.id == id){
        return element.name
      }
    }
    return '';
  }
  getStringEquipment() {
    this.listRooms.forEach(element => {
      let stringEquip = '';
      if(element.equipmentID && element.equipmentID.length > 0){
        let arrEquip = element.equipmentID.split(',');
        arrEquip.forEach(equipmentID => {
          if(equipmentID.length > 0)
          stringEquip += this.getEquipmentName(equipmentID) + " - ";
        });
        element.equipments = stringEquip.substring(0, stringEquip.length - 2);
      }
      else{
        element.equipments = stringEquip;
      }
      
      
    });
    this.dataSource.data = this.listRooms;
  }
  formatDate(): string {
    let month = this.month.value.getMonth() + 1;
    let year = this.month.value.getFullYear();
    return year + '-' + month
  }
  getRoomsInfo(){
    let data: any = {
      boardingHouseID: this.currentBh.id,
      page: this.currentPage,
      status: this.roomStatus,
      date : this.formatDate() + '-01'
    }
    if (this.roomStatus == 3) {
      this.isSelectAllStatus = 1;
    }
    else {
      this.isSelectAllStatus = 0;
    }
    console.log(data)
    this.addLoading();
    this.service.getRoomsInfo(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
         if (response.data.length > 0) {
           console.log(response.data)
          let totalPage = response.data.pop();
          this.listRooms = response.data;
          this.totalPage = totalPage.totalRecord;
          this.handleListRoom();
          this.getStringEquipment();
        }
          console.log(this.listRooms)
        }
      }, err => {
        this.showErr(CommonMessage.defaultErrMess);
        this.removeLoading();
        console.log(err);
      })
  }
  handleListRoom(){
    for (let index = 0; index < this.listRooms.length; index++) {
      const element = this.listRooms[index];
      if (element.numberTenant == 0) {
        this.listRooms[index].statusStr = 'Trống';
      }
      else{
        this.listRooms[index].statusStr = 'Đã có người';
      }
     
    }
    this.dataSource.data = this.listRooms;
  }
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
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
  pageChanged(page) {
    this.currentPage = page;
    this.getRoomsInfo();
  }
}
