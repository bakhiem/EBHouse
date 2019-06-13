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

export interface Food {
  address: string;
  numberOfRoom: number;
  name: string;
  description: string;
  id: string;
}
@Component({
  selector: 'app-bh-info',
  templateUrl: './bh-info.component.html',
  styleUrls: ['./bh-info.component.css']
})
export class BhInfoComponent implements OnInit {
  message: string = "";
  roleDefault: number = 1;
  dataProvince: any[];
  dataDistric: any[];
  dataWards: any[];
  arrAddress: any[];
  bhList: BoardingHouse[];
  createbhFormGroup: FormGroup;
  currentUser: User;
  isEdit: number = 0;
  currentBh: BoardingHouse;

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
    $('.bd-example-modal-lg').modal('show');
  }
  onSubmit() {
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
        
        console.log("chua sua gi")
      }
      else {
        $('.modal-content').addClass('preLoad');
        this.service.editBh(bh).subscribe(
          res => {
            console.log(res)
            this.getBoardingHouses()
          },
          err => {
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
      this.service.createBh(bh).subscribe(
        res => {
          console.log(res)
          this.getBoardingHouses()
        },
        err => {
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

  }

  deleteBh(obj) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Bạn chắc chắn muốn xóa nhà trọ không ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(obj);
        let bh = {
          id : obj.id
        }
        this.service.deleteBh(bh).subscribe(
          res => {
            console.log(res)
            this.getBoardingHouses()
          },
          err => {
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






