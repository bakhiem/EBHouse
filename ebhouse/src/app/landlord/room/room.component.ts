import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import * as $AB from 'jquery';
import * as bootstrap from "bootstrap";
import { LandlordService } from '../service/landlord-service.service';

import { Landlord } from '../../models/landlord';
import { BoardingHouse } from '../../models/bh';


import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import { Message } from '../../models/message';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  dataProvince: any[];
  dataDistric: any[];
  dataWards: any[];
  arrAddress: any[];
  bhList: BoardingHouse[];
  createRoomFormGroup: FormGroup;
  currentUser: User;
  isEdit: number = 0;
  currentBh: BoardingHouse;

  //Message
  successMess: string;
  errMess: string;
  deleteSuccess: string;
  deleteErr: string;

  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number;
  pageNumbers: number[] = [];

  displayedColumns: string[] = ['name', 'address', 'numberOfRoom', 'description', 'customColumn'];


  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit() {

    this.getRooms();
    this.currentUser = this.authenticationService.currentUserValue;
    this.createRoomFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      id: '',
      boardingHouseID: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      roomTypeID: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      description: ''
    });

  }

  getRooms() {
    let page: any = {
      page: this.currentPage
    }
    this.service.getRooms(page).subscribe(
      res => {
        console.log(res)
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.bhList = data.boardingHouse;
          console.log(response)
          this.totalPage = Math.ceil(data.totalPage / this.perPage);
          this.toArray(this.totalPage);
        }
      }, err => {
        console.log(err);
        // this.message = "Có lỗi xảy ra";
      })
  }

  //create bh
  createRoom() {
    this.arrAddress = null;
    this.createRoomFormGroup.reset();
    this.isEdit = 0;
    this.currentBh = null;
    this.resetMess();
    $('.bd-example-modal-lg').modal('show');
  }
  onSubmit() {
    this.resetMess();
    let fullAddress = this.createRoomFormGroup.value.address + "-" + this.createRoomFormGroup.value.wards.name + "-" + this.createRoomFormGroup.value.distric.name + "-" + this.createRoomFormGroup.value.province.name;
    if (this.isEdit == 1) {
      let bh: BoardingHouse = {
        id: this.createRoomFormGroup.value.id,
        name: this.createRoomFormGroup.value.name,
        address: fullAddress,
        numberOfRoom: this.createRoomFormGroup.value.numberOfRoom,
        description: this.createRoomFormGroup.value.description ? this.createRoomFormGroup.value.description : ''
      }

      if (bh.address == this.currentBh.address && bh.name == this.currentBh.name && bh.numberOfRoom == this.currentBh.numberOfRoom && bh.description == this.currentBh.description) {
        this.errMess = Message.notChangeMess;
      }
      else {
        this.addLoading();
        this.service.editBh(bh).subscribe(
          res => {
            console.log(res)
            let resObject = JSON.parse("" + res);
            if (resObject.type == 1) {
              this.successMess = resObject.message;
              this.currentBh = bh;
            }
            else {
              this.errMess = resObject.message;
              this.currentBh = null;
            }
            this.getRooms()
            this.removeLoading();
          },
          err => {
            this.errMess = Message.defaultErrMess;
            console.log(err);
            this.removeLoading();
          }
        )
      }
    }


    else if (this.isEdit == 0) {
      let bh: BoardingHouse = {
        name: this.createRoomFormGroup.value.name,
        numberOfRoom: this.createRoomFormGroup.value.numberOfRoom,
        address: fullAddress,
        description: this.createRoomFormGroup.value.description ? this.createRoomFormGroup.value.description : ''
      }
      this.addLoading();
      this.service.createRoom(bh).subscribe(
        res => {
          let resObject = JSON.parse("" + res);
          if (resObject.type == 1) {
            this.successMess = resObject.message;
          }
          else {
            this.errMess = resObject.message;
            this.currentBh = null;
          }
          this.getRooms()
          this.removeLoading();
        },
        err => {
          this.errMess = Message.defaultErrMess;
          console.log(err)
          this.removeLoading();
        }
      )
    }
  }

  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }


  //edit and delete boarding-house :
  editBh(obj) {
    this.isEdit = 1;
    this.currentBh = obj;
    this.createRoomFormGroup.get('name').setValue(obj.name);
    this.createRoomFormGroup.get('numberOfRoom').setValue(obj.numberOfRoom);
    this.createRoomFormGroup.get('description').setValue(obj.description);
    this.createRoomFormGroup.get('id').setValue(obj.id);
    $('.bd-example-modal-lg').modal('show');
    this.resetMess();
  }
  resetMess() {
    this.errMess = "";
    this.successMess = "";
    this.deleteErr = "";
    this.deleteSuccess = "";
  }
  deleteBh(obj) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Bạn chắc chắn muốn xóa nhà trọ không ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetMess();
        let bh = {
          id: obj.id
        }
        this.addLoading();
        this.service.deleteBh(bh).subscribe(
          res => {
            console.log(res)
            this.removeLoading();
            let resObject = JSON.parse("" + res);
            if (resObject.type == 1) {
              this.deleteSuccess = resObject.message;
            }
            else {
              this.deleteErr = resObject.message;
            }
            this.getRooms()
          },
          err => {

            this.deleteErr = Message.defaultErrMess;
            this.removeLoading();
            console.log(err)
          }
        )
      }
    });
  }

  //paging
  toArray = function (num: number) {
    for (let i = 1; i <= num; i++) {
      this.pageNumbers[i - 1] = i;
    }
  }
  goToPage(page: any) { // without type info
    this.currentPage = page;
    this.getRooms();
  }
  prePage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
      this.getRooms();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.getRooms();
    }
  }
}






