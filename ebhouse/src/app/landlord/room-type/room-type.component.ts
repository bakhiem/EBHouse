import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { EquipmentServiceService } from '../service/equipment-service.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import * as $AB from 'jquery';
import * as bootstrap from "bootstrap";
import { LandlordService } from '../service/landlord-service.service';

import { Landlord } from '../../models/landlord';
import { RoomType } from '../../models/room-type';


import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import { CommonMessage, Message } from '../../models/message';

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.css']
})
export class RoomTypeComponent implements OnInit {
  rtList: any[];
  createRtFormGroup: FormGroup;
  currentUser: User;
  isEdit: number = 0;
  currentRt: RoomType;

  //equipment
  dataEquipment: any[];
  //Message

  message: Message = {
    content: '',
    type: 0
  }
  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number;
  pageNumbers: number[] = [];
  displayedColumns: string[] = ['name', 'area', 'capacity', 'price', 'description', 'equipment', 'customColumn'];


  constructor(private fb: FormBuilder,
    private equipmentService: EquipmentServiceService,
    public dialog: MatDialog,
    private service: LandlordService,
    private authenticationService: AuthenticationService
  ) {
  }
  ngOnInit() {
    this.createRtFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      id: '',
      price: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      capacity: this.fb.control('', Validators.compose([
        Validators.required, Validators.pattern("[0-9]+")
      ])),
      area: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      description: '',
      dataEquipment: new FormArray([])
    });
    this.getEquipment();
    this.getRoomTypes();
    this.formatCurrency();

  }
  formatCurrency() {
    var $input = $("#input-price");
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
      var input = $this.val();
      input = ("" + input).replace(/[\D\s\._\-]+/g, "");
      input = input ? parseInt("" + input, 10) : 0;
      $this.val(function () {
        return (input === 0) ? "" : input.toLocaleString("en-US");
      });
    });
  }

  private getEquipment() {
    this.equipmentService.getEquipment().subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataEquipment = arr;
      this.addCheckboxes();
    });
  }
  private addCheckboxes() {
    this.dataEquipment.map((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.createRtFormGroup.controls.dataEquipment as FormArray).push(control);
    });
  }

  getRoomTypes() {
    let page: any = {
      page: this.currentPage
    }
    this.addLoading();
    this.service.getRoomTypes(page).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let resData = JSON.parse(response.data);
          this.rtList = resData.roomType;
          this.getChecked();
          this.totalPage = Math.ceil(resData.totalPage / this.perPage);
          this.toArray(this.totalPage);
        }
      }, err => {
        this.removeLoading();
        this.message.content = CommonMessage.defaultErrMess;
        this.message.type = 0;
        console.log(err);
      })
  }
  //convert list id equipment to string equipment
  getStringEquipment() {
    this.rtList.forEach(element => {
      let stringEquip = '';
      element.lstEquipment.forEach(equipment => {
        stringEquip += equipment.name + " - ";
      });
      element.equipment = stringEquip.substring(0, stringEquip.length - 2);
    });
    console.log(this.rtList);
  }

  //get checked from rtlist
  getChecked() {
    this.rtList.forEach(element => {
      let checked = Array.apply(null, Array(this.dataEquipment.length)).map(function () { return false });
      for (let i = 0; i < this.dataEquipment.length; i++) {
        element.lstEquipment.forEach(equipment => {
          if (this.dataEquipment[i].id == equipment.id) {
            checked[i] = true
          }
        });
      }
      element.checked = checked;
    });
  }
  //create rt
  createRt() {
    this.createRtFormGroup.reset();
    this.isEdit = 0;
    this.currentRt = null;
    this.resetMess();
    $('#modalRoomType').modal('show');
  }
  listEquipmentOnSubmit() {
    let listEquipment = new Array();
    for (let i = 0; i < this.dataEquipment.length; i++) {
      if (this.createRtFormGroup.value.dataEquipment[i] != null && this.createRtFormGroup.value.dataEquipment[i] == true) {
        listEquipment.push(this.dataEquipment[i].id);
      }
    }
    return listEquipment;
  }
  onSubmit() {
    let formatPrice = this.createRtFormGroup.value.price.split(',').join('');
    if (this.isEdit == 1) {
      let sendToServer = {
        roomType: [{
          id: this.createRtFormGroup.value.id,
          name: this.createRtFormGroup.value.name,
          area: this.createRtFormGroup.value.area,
          price: formatPrice,
          capacity: this.createRtFormGroup.value.capacity,
          description: this.createRtFormGroup.value.description ? this.createRtFormGroup.value.description : '',
        }],
        equipment: this.listEquipmentOnSubmit()
      }
      let newRt = sendToServer.roomType[0];
      if (newRt.area == this.currentRt.area && newRt.name == this.currentRt.name && newRt.price == this.currentRt.price && newRt.capacity == this.currentRt.capacity && newRt.description == this.currentRt.description && JSON.stringify(this.currentRt['checked']) == JSON.stringify(this.createRtFormGroup.controls.dataEquipment.value)) {
        this.message.content = CommonMessage.notChangeMess;
        this.message.type = 0;
      }
      else {
        this.addLoading();
        this.service.editRt(sendToServer).subscribe(
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
      let sendToServer = {
        roomType: [{
          name: this.createRtFormGroup.value.name,
          area: this.createRtFormGroup.value.area,
          price: formatPrice,
          capacity: this.createRtFormGroup.value.capacity,
          description: this.createRtFormGroup.value.description ? this.createRtFormGroup.value.description : '',
        }],
        equipment: this.listEquipmentOnSubmit()
      }
      this.addLoading();
      this.service.createRt(sendToServer).subscribe(
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
      this.currentRt = null;
      $('.bd-example-modal-lg').modal('hide');
      this.getRoomTypes();
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
    this.currentRt = obj;
    this.createRtFormGroup.get('name').setValue(obj.name);
    this.createRtFormGroup.get('area').setValue(obj.area);
    this.createRtFormGroup.get('description').setValue(obj.description);
    this.createRtFormGroup.get('price').setValue(obj.price);
    this.createRtFormGroup.get('capacity').setValue(obj.capacity);
    this.createRtFormGroup.get('id').setValue(obj.id);
    this.createRtFormGroup.setControl('dataEquipment', this.fb.array(obj.checked || []));
    $('#modalRoomType').modal('show');
    this.resetMess();
  }
  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }
  deleteBh(obj) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Bạn chắc chắn muốn xóa loại phòng chứ ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(obj);
        let rt = {
          id: obj.id
        }
        this.addLoading();
        this.service.deleteRt(rt).subscribe(
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
    this.pageNumbers = []
    for (let i = 1; i <= num; i++) {
      this.pageNumbers[i - 1] = i;
    }
  }
  goToPage(page: any) { // without type info
    this.currentPage = page;
    this.getRoomTypes();
    this.resetMess();
  }
  prePage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
      this.getRoomTypes();
      this.resetMess();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.getRoomTypes();
      this.resetMess();
    }
  }
}






