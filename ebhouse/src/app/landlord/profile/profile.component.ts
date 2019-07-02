import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { DataService } from '../../user/service/data.service';
import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CommonMessage, Message } from '../../models/message';
import { LandlordService } from '../service/landlord-service.service';
import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import { Landlord } from '../../models/landlord';
import * as $ from 'jquery';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class LandlordProfileComponent implements OnInit {
  roleDefault: number = 1;
  dataProvince: any[];
  dataDistric: any[];
  dataWards: any[];
  phonePattern = '((09|03|07|08|05)+([0-9]{8}))';
  profileFormGroup: FormGroup;
  landlord: Landlord;
  user: User;
  message: Message = {
    content: '',
    type: 0,
  };
  check: number = 0;

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: LandlordService
  ) {}

  ngOnInit() {
    this.resetMess();
    this.removeLoading();
    this.getProvince();
    this.profileFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([Validators.required])),
      phone: this.fb.control('', Validators.compose([Validators.required, Validators.pattern(this.phonePattern)])),
      date: this.fb.control('', Validators.compose([Validators.required])),
      sex: this.fb.control(0, Validators.compose([Validators.required])),
      province: this.fb.control('', Validators.compose([Validators.required])),
      distric: this.fb.control('', Validators.compose([Validators.required])),
      wards: this.fb.control('', Validators.compose([Validators.required])),
      address: this.fb.control('', Validators.compose([Validators.required])),
    });
  }
  getProfile() {
    this.addLoading();
    this.service.getProfile().subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse('' + res);
        if (response.type == 1) {
          this.landlord = JSON.parse(response.data);
          let arr = null;
          if (this.landlord.user.address != ' ') {
            arr = this.landlord.user.address.split('-');
          }
          this.getAddress();
          this.profileFormGroup
            .get('name')
            .setValue(this.landlord.user.name != ' ' ? this.landlord.user.name.trim() : ' ');
          this.profileFormGroup
            .get('phone')
            .setValue(this.landlord.user.phone != ' ' ? this.landlord.user.phone.trim() : ' ');
          this.profileFormGroup.controls['phone'].disable();
          if (this.landlord.user.dateOfBirth != 'null') {
            this.profileFormGroup.get('date').setValue(this.landlord.user.dateOfBirth);
          }
          this.profileFormGroup.get('sex').setValue(this.landlord.user.sex);
        } else {
          this.message = JSON.parse(response.message);
        }
      },
      err => {
        this.message = JSON.parse(err);
      }
    );
  }

  getAddress() {
    let arr = null;
    if (this.landlord.user.address != ' ') {
      arr = this.landlord.user.address.split('-');
    }
    for (let province of this.dataProvince) {
      if (arr[3] == province.name) {
        this.profileFormGroup.get('province').setValue(province);
        let arrDistric = [];
        this.placeService.getDistric(province.code).subscribe(response => {
          for (let key in response) {
            arrDistric.push(response[key]);
          }
          this.dataDistric = arrDistric;
          for (let distric of arrDistric) {
            if (arr[2] == distric.name) {
              this.profileFormGroup.get('distric').setValue(distric);
              let arrWards = [];
              this.placeService.getWards(distric.code).subscribe(response => {
                for (let key in response) {
                  arrWards.push(response[key]);
                }
                this.dataWards = arrWards;
                for (let wards of arrWards) {
                  if (arr[1] == wards.name) {
                    this.profileFormGroup.get('wards').setValue(wards);
                    this.profileFormGroup.get('address').setValue(arr[0]);
                    break;
                  }
                }
              });
              break;
            }
          }
        });
        break;
      }
    }
  }

  getProvince() {
    this.placeService.getProvince().subscribe(response => {
      let arr = [];
      for (let key in response) {
        arr.push(response[key]);
      }
      this.dataProvince = arr;
      this.getProfile();
    });
    
  }

  getDistric(province: any): any[] {
    let arr = [];
    this.placeService.getDistric(province.code).subscribe(response => {
      for (let key in response) {
        arr.push(response[key]);
      }
      this.dataDistric = arr;
    });
    return arr;
  }

  getWards(distric: any): any[] {
    let arr = [];
    this.placeService.getWards(distric.code).subscribe(response => {
      for (let key in response) {
        arr.push(response[key]);
      }
      this.dataWards = arr;
    });
    return arr;
  }

  onChangeProvince() {
    this.placeService.getDistric(this.profileFormGroup.value.province.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key]);
      }
      this.dataDistric = arr;
      this.profileFormGroup.get('distric').setValue(arr[0]);
      this.onChangeDistric();
    });
  }

  onChangeDistric() {
    this.placeService.getWards(this.profileFormGroup.value.distric.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key]);
      }
      this.dataWards = arr;
      this.profileFormGroup.get('wards').setValue(arr[0]);
    });
  }

  onSubmit() {
    if (!this.profileFormGroup.invalid) {
      this.checkChangeData();
      if (this.check == 1) {
        this.addLoading();
        this.service.updateProfile({ user: this.landlord.user, landlord: this.landlord}).subscribe(
          res => {
            this.removeLoading();
            let response = JSON.parse('' + res);
            if (response.type == 1) {
              this.message.type = 1;
            } else {
              this.message.type = 0;
            }
            this.message.content = response.message;
          },
          err => {
            this.message.type = 0;
            this.message.content = CommonMessage.defaultErrMess;
          }
        );
      } else {
        this.message.type = 0;
        this.message.content = 'Vui lòng thay đổi thông tin nếu bạn muốn cập nhật thông tin!';
      }
    } else {
      this.message.type = 0;
      this.message.content = 'Vui lòng kiểm tra lại!';
    }
  }

  checkChangeData() {
    let address =
      this.profileFormGroup.value.address +
      '-' +
      this.profileFormGroup.value.wards.name +
      '-' +
      this.profileFormGroup.value.distric.name +
      '-' +
      this.profileFormGroup.value.province.name;
    if (this.landlord.user.name != this.profileFormGroup.value.name) {
      this.landlord.user.name = this.profileFormGroup.value.name
      this.check = 1;
    } else if (this.landlord.user.sex != this.profileFormGroup.value.sex) {
      this.landlord.user.sex = this.profileFormGroup.value.sex
      this.check = 1;
    } else if (this.landlord.user.dateOfBirth != this.profileFormGroup.value.date) {
      this.landlord.user.dateOfBirth = this.profileFormGroup.value.date
      this.check = 1;
    }else if(this.landlord.user.address != address){
      this.landlord.user.address = address
      this.check = 1;
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

  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }
}
