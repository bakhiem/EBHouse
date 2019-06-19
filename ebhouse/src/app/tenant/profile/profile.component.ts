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
      //get tinh/tp
      this.placeService.getProvince().subscribe(response => {
        var arr = [];
        for (var key in response) {
          arr.push(response[key])
        }
        this.dataProvince = arr;
      });

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
      this.getProfile();
  }

  getProfile(){
    this.service.getProfile().subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          this.tenant = JSON.parse(response.data);
          let arr = null;
          if(this.tenant.user.address != ' '){
            arr = this.tenant.user.address.split('-');
          }

          this.profileFormGroup.get('fullname').setValue(this.tenant.user.name != ' ' ? this.tenant.user.name : ' ');
          this.profileFormGroup.get('phone').setValue(this.tenant.user.phone != ' ' ? this.tenant.user.phone : ' ');
          if(this.tenant.user.dateOfBirth != 'null'){
            this.profileFormGroup.get('date').setValue(this.tenant.user.dateOfBirth);
          }
          this.profileFormGroup.get('sex').setValue(this.tenant.user.sex);
          this.profileFormGroup.get('province').setValue(arr != null ? arr[3] : '');
          this.profileFormGroup.get('distric').setValue(arr != null ? arr[2] : '');
          this.profileFormGroup.get('wards').setValue(arr != null ? arr[1] : '');
          this.profileFormGroup.get('address').setValue(arr != null ? arr[0]: '');
          this.profileFormGroup.get('frontID').setValue(this.tenant.imgArnFront != ' ' ? this.tenant.imgArnFront : '');
          this.profileFormGroup.get('backID').setValue(this.tenant.imgArnBack != ' ' ? this.tenant.imgArnBack : '' );
        }else{
          this.message = JSON.parse(response.message);
        }
      }, err => {
        console.log(err);
        this.message = JSON.parse(err);
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
