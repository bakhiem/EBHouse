import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { DataService } from '../../user/service/data.service';
import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

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
  message: string = "";
  roleDefault: number = 1;
  dataProvince: any[];
  dataDistric: any[];
  dataWards: any[];
  phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
  imageFrontSrc: string;
  imageBackSrc: string;
  profileFormGroup: FormGroup;
  tenant : Tenant;

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
    private service: TenantServiceService) { }

    ngOnInit() {
      this.getProfile();
      //get tinh/tp
      this.placeService.getProvince().subscribe(response => {
        var arr = [];
        for (var key in response) {
          arr.push(response[key])
        }
        this.dataProvince = arr;
      });

      this.profileFormGroup = this.fb.group({
        fullname: this.fb.control(this.tenant ? this.tenant.user.name : '', Validators.compose([
          Validators.required
        ])),
        phone: this.fb.control(this.tenant ? this.tenant.user.phone : '', Validators.compose([
          Validators.required,
          Validators.pattern(this.phonePattern)
        ])),

        date: this.fb.control(this.tenant ? this.tenant.user.dateOfBirth : '', Validators.compose([
          Validators.required
        ])),
        sex: this.fb.control(this.tenant ? this.tenant.user.sex : 0, Validators.compose([
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
        frontID: this.fb.control(this.tenant ? this.tenant.imgArnFront : '', Validators.compose([
          Validators.required
        ])),
        backID: this.fb.control(this.tenant ? this.tenant.imgArnBack : '', Validators.compose([
          Validators.required
        ])),
      });
  }

  getProfile(){
    this.service.getProfile().subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          this.tenant = JSON.parse(response.data);
        }else{
          this.message = "Có lỗi xảy ra";
        }
      }, err => {
        console.log(err);
        // this.message = "Có lỗi xảy ra";
      })
  }

  onChangeProvince() {
    this.placeService.getDistric(this.profileFormGroup.value.province.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataDistric = arr;
    });
  };
  onChangeDistric() {
    this.placeService.getWards(this.profileFormGroup.value.distric.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataWards = arr;
    });
  };
  onSubmit() {
    let fullAddress = this.profileFormGroup.value.address + "-" + this.profileFormGroup.value.wards.name + "-" + this.profileFormGroup.value.distric.name + "-" + this.profileFormGroup.value.province.name;
    console.log(fullAddress)
    console.log(this.profileFormGroup.value)
  }
  // uploadFrontID(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.onload = e => this.imageFrontSrc = "" + reader.result;
  //     reader.readAsDataURL(file);
  //   }
  // }
  uploadFrontID(imageResult: ImageResult) {
    this.imageFrontSrc = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
        console.log(this.imageFrontSrc);
}
  uploadBackID(imageResult: ImageResult) {
   this.imageBackSrc = imageResult.resized
        && imageResult.resized.dataURL
        || imageResult.dataURL;
  }



  // get isMoreThanToday() {
  //   let date = ;
  //   let varDate = new Date(date); //dd-mm-YYYY
  //   var today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   if (varDate >= today) {

  //     alert("Working!");
  //   }
  //   return
  // }
}
