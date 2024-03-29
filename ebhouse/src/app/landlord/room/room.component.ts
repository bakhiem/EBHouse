import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

import { LandlordService } from '../service/landlord-service.service';
import { ToastrService } from 'ngx-toastr';
import { BoardingHouse } from '../../models/bh';
import { AuthenticationService } from '../../user/service/authentication.service';

import { CommmonFunction } from '../../shared/common-function';
import { CommonMessage, Message } from '../../models/message';
import { ISubscription } from "rxjs/Subscription";

import { SharedServiceService } from '../../service/shared-service.service';
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
  roomList: any[] = [];
  currentBh: BoardingHouse;
  totalPageString: string;
  currentRoom: any;

  numberOfRoomBh: number;
  patternMultiName = '^([a-zA-Z0-9,]*)$';
  patternBeginName = '^([0-9]*)$';
  //paging
  perPage: number = 5;
  currentPage: number = 1;
  totalPage: number = 0;


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
    private shareService: SharedServiceService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      console.log(data)
      if (this.currentBh && this.currentBh.id) {
        this.currentPage = 1;
        this.numberOfRoomBh = data.numberOfRoom;
        $('.boarding-house').val(this.currentBh.name);
        this.getRoomsFromCurrentBh();
      }
      else if (this.currentBh) {
        this.showInfo(CommonMessage.InputBh)
      }
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

  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  showInfo(mess) {
    this.toastr.info(mess, 'Thông báo !');
  }
  getRoomType() {
    this.service.getAllRoomTypes().subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let data = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data));
          this.rtList = data.roomType;
        }
      }, err => {
        console.log(err);
      })
  }
  getRoomsFromCurrentBh() {
    this.selection.clear();
    if (!this.currentBh.id) {
      return;
    }
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
          let data = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data));
          this.roomList = data.room;
          this.totalPage = data.totalPage;
        }
      }, err => {
        this.removeLoading();
        this.showErr(CommonMessage.defaultErrMess);
        console.log(err);
      })
  }

  //create bh
  createRoom() {
    if (!this.currentBh.id) {
      this.showErr(CommonMessage.InputBh);
      return;
    }
    if (!this.rtList || this.rtList.length == 0) {
      this.showErr(CommonMessage.InputRt);
      return;
    }

    this.createRoomFormGroup.reset();
    this.currentRoom = null;
    this.isEdit = 0;
    if (this.rtList) {
      this.createRoomFormGroup.get('roomType').setValue(this.rtList[0]);
    }
    $('.bd-example-modal-lg.one-room').modal('show');
  }
  createMultiRoom() {
    if (!this.currentBh.id) {
      this.showErr(CommonMessage.InputBh);
      return;
    }
    if (!this.rtList || this.rtList.length == 0) {
      this.showErr(CommonMessage.InputRt);
      return;
    }
    this.createMultiRoomFormGroup.reset();
    if (this.rtList) {
      this.createMultiRoomFormGroup.get('roomType').setValue(this.rtList[0]);
    }
    $('.bd-example-modal-lg.multi-room').modal('show');
  }
  onSubmit() {
    if (this.isEdit == 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: "Bạn chắc chắn muốn lưu thay đổi không?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let room: any = {
            bhouseID: Number(this.currentBh.id),
            roomTypeID: this.createRoomFormGroup.value.roomType.id,
            room: {
              id: this.currentRoom.id,
              name: this.createRoomFormGroup.value.name.trim().replace(/"/g, "\\\""),
              description: this.createRoomFormGroup.value.description ? this.createRoomFormGroup.value.description.trim().replace(/"/g, "\\\"") : ''
            }
          }
          if (room.roomTypeID == this.currentRoom.roomType.id && room.room.name == this.currentRoom.name && room.room.description == this.currentRoom.description) {
            this.showErr(CommonMessage.notChangeMess)
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
      })


    }


    else if (this.isEdit == 0) {

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: "Bạn chắc chắn muốn tạo phòng không không?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let room: any = {
            boardingHouseID: Number(this.currentBh.id),
            roomTypeID: this.createRoomFormGroup.value.roomType.id,
            roomName: this.createRoomFormGroup.value.name.trim().replace(/"/g, "\\\""),
            description: this.createRoomFormGroup.value.description ? this.createRoomFormGroup.value.description.trim().replace(/"/g, "\\\"") : ''
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
      })

    }
  }
  successRequestHandle(res) {
    let resObject = JSON.parse("" + res);
    if (resObject.type == 1) {
      this.showSuccess(resObject.message);
      this.removeLoading();
      this.currentRoom = null;
      $('.bd-example-modal-lg.multi-room').modal('hide');
      $('.bd-example-modal-lg.one-room').modal('hide');
      this.getRoomsFromCurrentBh();
    }
    else {
      this.showErr(resObject.message);
      this.removeLoading();
    }
  }
  errRequestHandle(err) {
    this.showErr(CommonMessage.defaultErrMess);
    console.log(err);
    this.removeLoading();
  }
  onSubmitMultiRoom() {
    if (this.createMultiRoomFormGroup.value.name.nameBegin != null && this.createMultiRoomFormGroup.value.name.nameEnd == '' && this.createMultiRoomFormGroup.value.name.nameFormat == '') {
      this.showErr(CommonMessage.inputAllFiel);
    }
    else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: "Bạn chắc chắn muốn tạo phòng trọ không?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let room: any;
          var active = $(".nav-link.active").attr("id");
          console.log(active);
          if(active == 'home-tab'){
            if (this.createMultiRoomFormGroup.value.name.nameFormat != null) {
              let arr = this.createMultiRoomFormGroup.value.name.nameFormat.split(',');
              if (arr.length > 150) {
                this.showErr(CommonMessage.InputMaxRoom);
                return;
              }
              room = {
                boardingHouseID: Number(this.currentBh.id),
                roomTypeID: this.createMultiRoomFormGroup.value.roomType.id,
                roomName: this.createMultiRoomFormGroup.value.name.nameFormat,
                description: this.createMultiRoomFormGroup.value.description ? this.createMultiRoomFormGroup.value.description.trim().replace(/"/g, "\\\"") : ''
              }
            }
            else{
              this.showErr('Vui lòng nhập tên phòng');
              return;
            }
          }
          else  if(active == 'profile-tab'){
            if(!this.createMultiRoomFormGroup.value.name.nameBegin || !this.createMultiRoomFormGroup.value.name.nameEnd){
              this.showErr('Vui lòng nhập vào phòng bắt đầu và phòng kết thúc');
              return;
            }
            let from = this.createMultiRoomFormGroup.value.name.nameBegin;
            let to = this.createMultiRoomFormGroup.value.name.nameEnd;
            let arrRoom = '';
            if (Number(to) < Number(from)) {
              this.showErr(CommonMessage.toSmallerThanFrom);
              return;
            }
            if (Number(to) - Number(from) > 150) {
              this.showErr(CommonMessage.InputMaxRoom);
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
              description: this.createMultiRoomFormGroup.value.description ? this.createMultiRoomFormGroup.value.description.trim().replace(/"/g, "\\\"") : ''
            }
          }
          else{
            return;
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
      })


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
    $('.bd-example-modal-lg.one-room').modal('show');

  }




  deleteRoom(obj) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: "Bạn chắc chắn muốn xóa phòng trọ không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let rooms = {
          roomID: [obj.id],
          boardingHouseID: [this.currentBh.id]
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: "Bạn chắc chắn muốn xóa phòng trọ không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let roomID = [];
        for (let i = 0; i < this.selection.selected.length; i++) {
          roomID.push(this.selection.selected[i].id);
        }
        let rooms = {
          roomID: roomID,
          boardingHouseID: [this.currentBh.id]
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
  pageChanged(page) {
    this.currentPage = page;
    this.getRoomsFromCurrentBh();
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






