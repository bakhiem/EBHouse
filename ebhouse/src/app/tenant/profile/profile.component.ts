import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { DataService } from '../../user/service/data.service';
import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CommonMessage, Message } from '../../models/message';
import { TenantServiceService } from '../service/tenant-service.service';
import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import { Tenant } from '../../models/tenant';
import * as $ from 'jquery';
//image
import { ImageResult, ResizeOptions } from 'ng2-imageupload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class TenantProfileComponent implements OnInit {
  roleDefault: number = 1;
  dataProvince: any[];
  dataDistric: any[];
  dataWards: any[];
  phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
  imageFrontSrc: string;
  imageBackSrc: string;
  profileFormGroup: FormGroup;
  tenant : Tenant;
  user : User;
  message  : Message = {
    content : '',
    type : 0
  }

  //resize image
  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 1000,
    resizeMaxWidth: 1000
  };

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: TenantServiceService
  ) { }

  ngOnInit() {
      this.resetMess();
      this.removeLoading();
      this.getProvince();
      this.getProfile();
      this.profileFormGroup = this.fb.group({
        fullname: this.fb.control('', Validators.compose([
          Validators.required
        ])),
        phone: this.fb.control('', Validators.compose([
          Validators.required,
          Validators.pattern(this.phonePattern)
        ])),
        date: this.fb.control('', Validators.compose([
          Validators.required
        ])),
        sex: this.fb.control(0, Validators.compose([
          Validators.required
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
        frontID: this.fb.control('', Validators.compose([
          Validators.required
        ])),
        backID: this.fb.control('', Validators.compose([
          Validators.required
        ])),
      });
  }

  getProfile(){
    this.addLoading();
    this.service.getProfile().subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          this.tenant = JSON.parse(response.data);
          let arr = null;
          if(this.tenant.user.address != ' '){
            arr = this.tenant.user.address.split('-');
          }
          this.getAddress();
          this.profileFormGroup.get('fullname').setValue(this.tenant.user.name != ' ' ? this.tenant.user.name.trim() : ' ');
          this.profileFormGroup.get('phone').setValue(this.tenant.user.phone != ' ' ? this.tenant.user.phone.trim() : ' ');
          this.profileFormGroup.controls['phone'].disable();
          if(this.tenant.user.dateOfBirth != 'null'){
            this.profileFormGroup.get('date').setValue(this.tenant.user.dateOfBirth);
          }
          this.profileFormGroup.get('sex').setValue(this.tenant.user.sex);
          this.imageFrontSrc = this.tenant.imgArnFront != ' ' ? this.tenant.imgArnFront.trim() : '';
          this.imageBackSrc = this.tenant.imgArnBack  != ' ' ? this.tenant.imgArnBack.trim() : '';
        }else{
          this.message = JSON.parse(response.message);
        }
      this.removeLoading();
      }, err => {
        this.message = JSON.parse(err);
        this.removeLoading();
      })
  }

  getAddress(){
    let arr = null;
    if(this.tenant.user.address != ' '){
      arr = this.tenant.user.address.split('-');
    }
    for (let province of this.dataProvince) {
      if (arr[3] == province.name) {
        this.profileFormGroup.get('province').setValue(province);
        let arrDistric= [];
        this.placeService.getDistric(province.code).subscribe(response => {
          for (let key in response) {
            arrDistric.push(response[key])
          }
          this.dataDistric = arrDistric;
          for (let distric of arrDistric) {
            if (arr[2] == distric.name) {
              this.profileFormGroup.get('distric').setValue(distric);
              let arrWards = [];
              this.placeService.getWards(distric.code).subscribe(response => {
                for (let key in response) {
                  arrWards.push(response[key])
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

  getProvince(){
    this.placeService.getProvince().subscribe(response => {
      let arr = [];
      for (let key in response) {
        arr.push(response[key])
      }
      this.dataProvince = arr;
    });
  }

  getDistric(province:any): any[]{
    let arr = [];
    this.placeService.getDistric(province.code).subscribe(response => {
      for (let key in response) {
        arr.push(response[key])
      }
      this.dataDistric = arr;
    });
    return arr;
  }

  getWards(distric:any): any[]{
    let arr = [];
    this.placeService.getWards(distric.code).subscribe(response => {
      for (let key in response) {
        arr.push(response[key])
      }
      this.dataWards = arr;
    });
    return arr;
  }

  onChangeProvince() {
    this.placeService.getDistric(this.profileFormGroup.value.province.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataDistric = arr;
      this.profileFormGroup.get('distric').setValue(arr[0]);
      this.onChangeDistric();
    });
  };

  onChangeDistric() {
    this.placeService.getWards(this.profileFormGroup.value.distric.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataWards = arr;
      this.profileFormGroup.get('wards').setValue(arr[0]);
    });
  };

  onSubmit() {
    if(!this.profileFormGroup.invalid){
      this.addLoading();
      this.tenant.user.name = this.profileFormGroup.value.fullname;
      this.tenant.user.address = this.profileFormGroup.value.address + "-" + this.profileFormGroup.value.wards.name + "-" + this.profileFormGroup.value.distric.name + "-" + this.profileFormGroup.value.province.name;
      this.tenant.user.sex = this.profileFormGroup.value.sex;
      this.tenant.user.dateOfBirth = this.profileFormGroup.value.date;
      this.tenant.imgArnFront = this.profileFormGroup.value.frontID != "" ? this.imageFrontSrc.split(',')[1] : "" ;
      this.tenant.imgArnBack = this.profileFormGroup.value.backID != "" ? this.imageBackSrc.split(',')[1] : "" ;
      this.service.updateProfile({"user": this.tenant.user, "tenant": this.tenant}).subscribe(
        res => {
          this.removeLoading();
          let response = JSON.parse("" + res);
          if (response.type == 1) {
            this.message.type = 1;
          }else{
            this.message.type = 0;
          }
          this.message.content = response.message;
        }, err => {
          this.message.type = 0;
          this.message.content = CommonMessage.defaultErrMess;
        })
    }
  }

  checkChangeData(){
  }

  uploadFrontID(imageResult: ImageResult) {
    this.imageFrontSrc = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
  }
  uploadBackID(imageResult: ImageResult) {
    this.imageBackSrc = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
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
