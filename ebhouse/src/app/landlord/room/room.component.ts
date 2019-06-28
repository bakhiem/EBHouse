import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import * as $AB from 'jquery';
import * as bootstrap from "bootstrap";
import { LandlordService } from '../service/landlord-service.service';

import { Landlord } from '../../models/landlord';
import { BoardingHouse } from '../../models/bh';
import { LandlordComponent } from '../landlord.component';

import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import { CommonMessage, Message } from '../../models/message';
import { Observable, throwError } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  private subscription: ISubscription;
  rtList: any[];
  createRoomFormGroup: FormGroup;
  createMultiRoomFormGroup: FormGroup;
  isEdit: number = 0;
  roomList: any[];
  currentBh: BoardingHouse;

  currentRoom: any;


  //Message
  message: Message = {
    content: '',
    type: 0
  }

  patternMultiName = '^([a-zA-Z0-9,]*)$';
  patternBeginName = '^([0-9]*)$';
  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number;
  pageNumbers: number[] = [];

  displayedColumns: string[] = ['select', 'name', 'roomType', 'area', 'capacity', 'price', 'description', 'customColumn'];

  selection = new SelectionModel<any>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.roomList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.roomList.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private service: LandlordService,
    private authenticationService: AuthenticationService
  ) { }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.subscription = this.service.currentBh.subscribe((data) => {
      this.currentBh = data;
      $('.boarding-house').val(this.currentBh.name);
      this.getRoomsFromCurrentBh();
    })
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


    this.createMultiRoomFormGroup = this.fb.group({
      name: this.fb.group({
        nameFormat: this.fb.control('', Validators.pattern(this.patternMultiName)),
        nameBegin: this.fb.control('', Validators.pattern(this.patternBeginName)),
        nameEnd: this.fb.control('', Validators.pattern(this.patternMultiName)),
      }, { validator: atLeastOne(Validators.required, ['nameFormat', 'nameBegin']) }),
      roomType: this.fb.control('', Validators.compose([
        Validators.required
      ])),
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
  getRoomsFromCurrentBh() {
    this.selection.clear();
    let page: any = {
      boardingHouseID: this.currentBh.id,
      page: this.currentPage
    }
    console.log(page)
    this.addLoading();
    this.service.getRooms(page).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        console.log(response)
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.roomList = data.room;
          this.totalPage = Math.ceil(data.totalPage / this.perPage);
          this.toArray(this.totalPage);
        }
      }, err => {
        this.removeLoading();
        console.log(err);
      })
  }

  //create bh
  createRoom() {
    this.createRoomFormGroup.reset();
    this.currentRoom = null;
    this.isEdit = 0;
    if (this.rtList) {
      this.createRoomFormGroup.get('roomType').setValue(this.rtList[0]);
    }
    this.resetMess();
    $('.bd-example-modal-lg.one-room').modal('show');
  }
  createMultiRoom() {
    this.createMultiRoomFormGroup.reset();
    if (this.rtList) {
      this.createMultiRoomFormGroup.get('roomType').setValue(this.rtList[0]);
    }
    this.resetMess();
    $('.bd-example-modal-lg.multi-room').modal('show');
  }
  onSubmit() {
    if (this.isEdit == 1) {
      let room: any = {
        bhouseID: Number(this.currentBh.id),
        roomTypeID: this.createRoomFormGroup.value.roomType.id,
        room: {
          id: this.currentRoom.id,
          name: this.createRoomFormGroup.value.name,
          description: this.createRoomFormGroup.value.description ? this.createRoomFormGroup.value.description : ''
        }
      }
      if (room.roomTypeID == this.currentRoom.roomType.id && room.room.name == this.currentRoom.name && room.room.description == this.currentRoom.description) {
        this.message.content = CommonMessage.notChangeMess;
        this.message.type = 0;
      }
      else {
        this.addLoading();
        this.service.editRoom(room).subscribe(
          res => {
            this.successRequestHandle(res);
          },
          err => {
            this.errRequestHandle(err);
          }
        )
      }
    }


    else if (this.isEdit == 0) {
      let room: any = {
        boardingHouseID: Number(this.currentBh.id),
        roomTypeID: this.createRoomFormGroup.value.roomType.id,
        roomName: this.createRoomFormGroup.value.name,
        description: this.createRoomFormGroup.value.description ? this.createRoomFormGroup.value.description : ''
      }

      this.addLoading();
      this.service.createRoom(room).subscribe(
        res => {
          this.successRequestHandle(res);
        },
        err => {
          this.errRequestHandle(err);

        }
      )
    }
  }
  successRequestHandle(res) {
    let resObject = JSON.parse("" + res);
    if (resObject.type == 1) {
      this.message.type = 1;
      this.message.content = resObject.message;
      this.removeLoading();
      this.currentRoom = null;
      $('.bd-example-modal-lg.multi-room').modal('hide');
      $('.bd-example-modal-lg.one-room').modal('hide');
      this.getRoomsFromCurrentBh();
    }
    else {
      this.message.type = 0;
      this.message.content = resObject.message;
      this.removeLoading();
    }
  }
  errRequestHandle(err) {
    this.message.type = 0;
    this.message.content = CommonMessage.defaultErrMess;
    console.log(err);
    this.removeLoading();
  }
  onSubmitMultiRoom() {
    if (this.createMultiRoomFormGroup.value.name.nameBegin != null && this.createMultiRoomFormGroup.value.name.nameEnd == '' && this.createMultiRoomFormGroup.value.name.nameFormat == '') {
      this.message.content = CommonMessage.inputAllFiel;
      this.message.type = 0;
    }
    else {
      let room: any;
      if (this.createMultiRoomFormGroup.value.name.nameFormat != null) {
        room = {
          boardingHouseID: Number(this.currentBh.id),
          roomTypeID: this.createMultiRoomFormGroup.value.roomType.id,
          roomName: this.createMultiRoomFormGroup.value.name.nameFormat,
          description: this.createMultiRoomFormGroup.value.description ? this.createMultiRoomFormGroup.value.description : ''
        }
      }
      else {
        let from = this.createMultiRoomFormGroup.value.name.nameBegin;
        let to = this.createMultiRoomFormGroup.value.name.nameEnd;
        let arrRoom = '';
        if (Number(to) < Number(from)) {
          this.message.content = CommonMessage.toSmallerThanFrom;
          this.message.type = 0;
          return;
        }
        for (let i = Number(from); i <= Number(to); i++) {
          arrRoom += ',' + i;
        }
        if (arrRoom.charAt(0) == ',') {
          arrRoom = arrRoom.substr(1);
        }
        room = {
          boardingHouseID: Number(this.currentBh.id),
          roomTypeID: this.createMultiRoomFormGroup.value.roomType.id,
          roomName: arrRoom,
          description: this.createMultiRoomFormGroup.value.description ? this.createMultiRoomFormGroup.value.description : ''
        }
      }
      this.addLoading();
      this.service.createRoom(room).subscribe(
        res => {
          this.successRequestHandle(res);
        },
        err => {
          this.errRequestHandle(err);
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
  editRoom(obj) {
    this.createRoomFormGroup.reset();
    this.isEdit = 1;
    this.currentRoom = obj;
    this.createRoomFormGroup.get('name').setValue(obj.name);
    this.createRoomFormGroup.get('description').setValue(obj.description);
    for (let i = 0; i < this.rtList.length; i++) {
      if (this.rtList[i].id == obj.roomType.id) {
        this.createRoomFormGroup.get('roomType').setValue(this.rtList[i]);
        break;
      }
    }
    this.resetMess();
    $('.bd-example-modal-lg.one-room').modal('show');

  }

  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }


  deleteRoom(obj) {
    this.resetMess();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Bạn chắc chắn muốn xóa phòng trọ chứ ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let rooms = {
          roomID: [obj.id],
          boardingHouseID : [this.currentBh.id]
        }
        this.addLoading();
        this.service.deleteRoom(rooms).subscribe(
          res => {
            this.successRequestHandle(res)

          },
          err => {
            this.errRequestHandle(err)
          }
        )
      }
    });
  }
  deleteMultiRoom() {
    this.resetMess();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Bạn chắc chắn muốn xóa phòng trọ chứ ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let roomID = [];
        for (let i = 0; i < this.selection.selected.length; i++) {
          roomID.push(this.selection.selected[i].id);
        }
        let rooms = {
          roomID: roomID,
          boardingHouseID : [this.currentBh.id]
        }
        this.addLoading();
        this.service.deleteRoom(rooms).subscribe(
          res => {
            this.successRequestHandle(res)
          },
          err => {
            this.errRequestHandle(err)
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
    this.resetMess();
    this.getRoomsFromCurrentBh();
  }
  prePage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
      this.resetMess();
      this.getRoomsFromCurrentBh();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.resetMess();
      this.getRoomsFromCurrentBh();
    }
  }
}
export const atLeastOne = (validator: ValidatorFn, controls: string[] = null) => (
  group: FormGroup,
): ValidationErrors | null => {
  if (!controls) {
    controls = Object.keys(group.controls)
  }

  const hasAtLeastOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]));

  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
};






