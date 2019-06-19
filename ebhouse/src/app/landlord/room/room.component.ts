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
import { LandlordComponent } from '../landlord.component';

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
  rtList: any[];
  createRoomFormGroup: FormGroup;
  isEdit: number = 0;
  roomList: any[];
  currentBh: BoardingHouse;
  
  currentRoom: any;


  submitted : any = false;
  //Message
  successMess: string;
  errMess: string;

  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number;
  pageNumbers: number[] = [];

  displayedColumns: string[] = ['name', 'roomType', 'area', 'capacity', 'price', 'description', 'customColumn'];


  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private authenticationService: AuthenticationService,
    private landlordComponent: LandlordComponent
  ) { }
  ngOnInit() {
    this.getRooms();
    this.getRoomType();
    this.createRoomFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      roomType: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      description: ''
    });
  }
  getRoomType() {
      this.service.getAllRoomTypes().subscribe(
        res => {
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            let data = JSON.parse(response.data);
            this.rtList = data.roomType;
          }
        }, err => {
          console.log(err);
        })
    
  }
  getRooms() {
    if (this.landlordComponent.currentBh != null) {
      this.currentBh = this.landlordComponent.currentBh;
      $('#boarding-house').val(this.currentBh.name);
      this.getRoomsFromCurrentBh();
    }
    else {
      this.service.getAllBoardingHouses().subscribe(
        res => {
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            let data = JSON.parse(response.data);
            this.bhList = data.boardingHouse;
            if (this.bhList.length > 0 && this.currentBh == null) {
              this.currentBh = this.bhList[0];
              $('#boarding-house').val(this.currentBh.name);
              this.getRoomsFromCurrentBh();
            }
          }
        }, err => {
          console.log(err);

        })
    }


  }

  getRoomsFromCurrentBh() {
    let page: any = {
      boardingHouseID: this.currentBh.id,
      page: this.currentPage
    }
    console.log(page)
    this.service.getRooms(page).subscribe(
      res => {
        console.log(res)
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.roomList = data.room;
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
    this.createRoomFormGroup.reset();
    this.currentRoom = null;
    this.isEdit = 0;
    this.resetMess();
    if(this.rtList){
      this.createRoomFormGroup.get('roomType').setValue(this.rtList[0]);
    }
    $('.bd-example-modal-lg').modal('show');
  }
  onSubmit() {
    this.resetMess();
    this.submitted = true;
    console.log(this.createRoomFormGroup.value);

    if (this.isEdit == 1) {
      let room: any = {
        bhouseID: Number(this.currentBh.id),
        roomTypeID: this.createRoomFormGroup.value.roomType.id,
        room : {
          id : this.currentRoom.id,
          name : this.createRoomFormGroup.value.name,
          description: this.createRoomFormGroup.value.description ? this.createRoomFormGroup.value.description : ''
        }
      }
      console.log(room)
      if (room.roomTypeID == this.currentRoom.roomType.id && room.room.name == this.currentRoom.name && room.room.description == this.currentRoom.description ) {
        this.errMess = Message.notChangeMess;
      }
      else {
        this.addLoading();
        this.service.editRoom(room).subscribe(
          res => {
            console.log(res)
            let resObject = JSON.parse("" + res);
            if (resObject.type == 1) {
              this.successMess = resObject.message;
              this.currentRoom = null;
              $('.bd-example-modal-lg').modal('hide');
              this.getRoomsFromCurrentBh();
            }
            else {
              this.errMess = resObject.message;
            }
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
      let room: any = {
        boardingHouseID:  Number(this.currentBh.id) ,
        roomTypeID: this.createRoomFormGroup.value.roomType.id,
        roomName: this.createRoomFormGroup.value.name,
        description: this.createRoomFormGroup.value.description ? this.createRoomFormGroup.value.description : ''
      }
      console.log(room);

      this.addLoading();
      this.service.createRoom(room).subscribe(
        res => {
          let resObject = JSON.parse("" + res);
          if (resObject.type == 1) {
            this.successMess = resObject.message;
            this.getRoomsFromCurrentBh()
            $('.bd-example-modal-lg').modal('hide');
          }
          else {
            this.errMess = resObject.message;
          }
          this.removeLoading();
          
          
        },
        err => {
          this.errMess = Message.defaultErrMess;
          this.hiddenMess();
          console.log(err)
          this.removeLoading();
        }
      )
    }
  }
  hiddenMess(){
      setTimeout(() => { this.resetMess() }, 5000);
  }

  addLoading() {
    this.submitted = false;
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    this.hiddenMess();
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }


  //edit and delete boarding-house :
  editRoom(obj) {
    this.createRoomFormGroup.reset();
    console.log(obj)
    this.isEdit = 1;
    this.currentRoom = obj;
    this.createRoomFormGroup.get('name').setValue(obj.name);
    this.createRoomFormGroup.get('description').setValue(obj.description);
    for(let i = 0; i < this.rtList.length; i++){
      if(this.rtList[i].id == obj.roomType.id){
        this.createRoomFormGroup.get('roomType').setValue(this.rtList[i]);
        break;
      }
    }
    
    $('.bd-example-modal-lg').modal('show');
    this.resetMess();
  }
  resetMess() {
    this.errMess = "";
    this.successMess = "";
    this.submitted = false;
  }
  deleteRoom(obj) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Bạn chắc chắn muốn xóa phòng trọ chứ ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetMess();
        let rooms = {
          roomID: [obj.id]
        }
        this.addLoading();
        this.service.deleteRoom(rooms).subscribe(
          res => {
            let resObject = JSON.parse("" + res);
            if (resObject.type == 1) {
              this.successMess = resObject.message;
              this.getRoomsFromCurrentBh();
            }
            else {
              this.errMess = resObject.message;
            }
            this.removeLoading();
          },
          err => {
            this.errMess = Message.defaultErrMess;
            this.removeLoading();
            console.log(err)
          }
        )
      }
    });
  }

  //paging
  toArray = function (num: number) {
    this.pageNumbers = [];
    for (let i = 1; i <= num; i++) {
      this.pageNumbers[i - 1] = i;
    }
  }
  goToPage(page: any) { // without type info
    this.currentPage = page;
    this.getRoomsFromCurrentBh();
  }
  prePage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
      this.getRoomsFromCurrentBh();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.getRoomsFromCurrentBh();
    }
  }
}






