import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PlaceService } from '../../service/place.service';
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
  selector: 'app-bh-info',
  templateUrl: './bh-info.component.html',
  styleUrls: ['./bh-info.component.css']
})
export class BhInfoComponent implements OnInit {
  dataProvince: any[];
  dataDistric: any[];
  dataWards: any[];
  arrAddress: any[];
  bhList: BoardingHouse[];
  createbhFormGroup: FormGroup;
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
    private placeService: PlaceService,
    public dialog: MatDialog,
    private service: LandlordService,
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit() {

    this.getBoardingHouses();
    this.currentUser = this.authenticationService.currentUserValue;
    //get province from service
    this.placeService.getProvince().subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataProvince = arr;
      this.dataWards = null;
    });
    //create form group
    this.createbhFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      id: '',
      numberOfRoom: this.fb.control('', Validators.compose([
        Validators.required, Validators.pattern("[0-9]+")
      ])),

      province: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      distric: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      wards: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      address: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      description: ''
    });

  }

  getBoardingHouses() {
    let page: any = {
      page: this.currentPage
    }
    this.service.getBoardingHouses(page).subscribe(
      res => {
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
  createBh() {
    this.arrAddress = null;
    this.createbhFormGroup.reset();
    this.isEdit = 0;
    this.currentBh = null;
    this.resetMess();
    $('.bd-example-modal-lg').modal('show');
  }
  onSubmit() {
    this.resetMess();
    let fullAddress = this.createbhFormGroup.value.address + "," + this.createbhFormGroup.value.wards.name + "," + this.createbhFormGroup.value.distric.name + "," + this.createbhFormGroup.value.province.name;
    if (this.isEdit == 1) {
      let bh: BoardingHouse = {
        id: this.createbhFormGroup.value.id,
        name: this.createbhFormGroup.value.name,
        address: fullAddress,
        numberOfRoom: this.createbhFormGroup.value.numberOfRoom,
        description: this.createbhFormGroup.value.description
      }

      if (bh.address == this.currentBh.address && bh.name == this.currentBh.name && bh.numberOfRoom == this.currentBh.numberOfRoom && bh.description == this.currentBh.description) {
        this.errMess = Message.notChangeMess;
      }
      else {
        $('.customLoading').addClass('preloader');
        $('.customLoader').addClass('loader');
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
            }
            this.getBoardingHouses()
            $('.customLoading').removeClass('preloader');
            $('.customLoader').removeClass('loader');
          },
          err => {
            this.errMess = Message.defaultErrMess;
            console.log(err)
          }
        )
      }
    }


    else if (this.isEdit == 0) {
      let bh: BoardingHouse = {
        name: this.createbhFormGroup.value.name,
        numberOfRoom: this.createbhFormGroup.value.numberOfRoom,
        address: fullAddress,
        description: this.createbhFormGroup.value.description,
      }
      $('.customLoading').addClass('preloader');
      $('.customLoader').addClass('loader');
      this.service.createBh(bh).subscribe(
        res => {
          let resObject = JSON.parse("" + res);
          if (resObject.type == 1) {
            this.successMess = resObject.message;
          }
          else {
            this.errMess = resObject.message;
          }
          this.getBoardingHouses()
          $('.customLoading').removeClass('preloader');
          $('.customLoader').removeClass('loader');
        },
        err => {
          this.errMess = Message.defaultErrMess;
          console.log(err)
        }
      )
    }
  }
  getProvinceOnEdit(provinceName: string) {
    for (let province of this.dataProvince) {
      if (provinceName == province.name) {
        this.createbhFormGroup.get('province').setValue(province);
        this.onChangeProvince();
      }
    }
    return '';
  }
  getDistricOnEdit(districName: string) {
    for (let distric of this.dataDistric) {
      if (districName == distric.name) {
        this.createbhFormGroup.get('distric').setValue(distric);
        this.onChangeDistric();

      }
    }
    return '';
  }
  //edit and delete boarding-house :
  editBh(obj) {
    this.isEdit = 1;
    this.currentBh = obj;
    this.createbhFormGroup.get('name').setValue(obj.name);
    this.createbhFormGroup.get('numberOfRoom').setValue(obj.numberOfRoom);
    this.createbhFormGroup.get('description').setValue(obj.description);
    this.createbhFormGroup.get('id').setValue(obj.id);
    this.arrAddress = obj.address.split(',');
    this.getProvinceOnEdit(this.arrAddress[3]);
    this.createbhFormGroup.get('address').setValue(this.arrAddress[0]);
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
        $('.customLoading').addClass('preloader');
        $('.customLoader').addClass('loader');
        this.service.deleteBh(bh).subscribe(
          res => {
            console.log(res)
            $('.customLoading').removeClass('preloader');
            $('.customLoader').removeClass('loader');
            let resObject = JSON.parse("" + res);
            if (resObject.type == 1) {
              this.deleteSuccess = resObject.message;
            }
            else {
              this.deleteErr = resObject.message;
            }
            this.getBoardingHouses()
          },
          err => {

            this.deleteErr = Message.defaultErrMess;
            console.log(err)
          }
        )
      }
    });
  }
  onChangeProvince() {
    this.placeService.getDistric(this.createbhFormGroup.value.province.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
        if (this.arrAddress && this.arrAddress[2] == response[key].name) {
          this.createbhFormGroup.get('distric').setValue(response[key]);
          this.onChangeDistric();
        }
      }
      if (!this.arrAddress) {
        this.createbhFormGroup.get('distric').setValue(arr[0]);
        this.onChangeDistric();
      }
      this.dataDistric = arr;
    });
  };
  onChangeDistric() {
    this.placeService.getWards(this.createbhFormGroup.value.distric.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
        if (this.arrAddress && this.arrAddress[1] == response[key].name) {
          this.createbhFormGroup.get('wards').setValue(response[key]);
        }
      }
      if (!this.arrAddress) {
        this.createbhFormGroup.get('wards').setValue(arr[0]);
      }
      this.dataWards = arr;
    });
  };
  //paging
  toArray = function (num: number) {
    for (let i = 1; i <= num; i++) {
      this.pageNumbers[i - 1] = i;
    }
  }
  goToPage(page: any) { // without type info
    this.currentPage = page;
    this.getBoardingHouses();
  }
  prePage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
      this.getBoardingHouses();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage = this.currentPage + 1;
      this.getBoardingHouses();
    }
  }
}






