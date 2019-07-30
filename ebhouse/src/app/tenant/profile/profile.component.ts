import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { DataService } from '../../user/service/data.service';
import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { CommonMessage, Message } from '../../models/message';
import { TenantServiceService } from '../service/tenant-service.service';
import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import { Tenant } from '../../models/tenant';
import * as $ from 'jquery';
//image
import { Options, ImageResult } from "ngx-image2dataurl";
import { RotateImageFileProcessor } from '../../shared/image-rotate';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],

})
export class TenantProfileComponent implements OnInit {
  roleDefault: number = 1;
  dataProvince: any[];
  dataDistric: any[];
  dataWards: any[];
  phonePattern = '((09|03|07|08|05)+([0-9]{8}))';
  imgArnFront: string;
  imgArnBack: string;
  profileFormGroup: FormGroup;
  tenant: Tenant;
  check: number = 0;
  user: User;
  //resize image
  options: Options = {
    resize: {
      maxHeight: 1000,
      maxWidth: 1000
    },
    allowedExtensions: ['JPG', 'PnG', 'JPEG']
  };
  rotateImageFileProcessor = new RotateImageFileProcessor();
  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: TenantServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
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
      imgArnFront: this.fb.control(''),
      imgArnBack: this.fb.control(''),
    });
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  getProfile() {
    console.log(this.tenant);
    this.addLoading();
    this.service.getProfile().subscribe(
      res => {
        let response = JSON.parse('' + res);
        if (response.type == 1) {
          this.tenant = JSON.parse(response.data);
          console.log(this.tenant);
          // let arr = null;
          // if (this.tenant.user.address != ' ') {
          //   arr = this.tenant.user.address.split('-');
          // }
          this.getAddress();
          this.profileFormGroup.get('name').setValue(this.tenant.user.name != ' ' ? this.tenant.user.name.trim() : ' ');
          this.profileFormGroup.get('phone').setValue(this.tenant.user.phone != ' ' ? this.tenant.user.phone.trim() : ' ');
          this.profileFormGroup.get('phone').disable();
          if (this.tenant.user.dateOfBirth != 'null') {
            this.profileFormGroup.get('date').setValue(this.tenant.user.dateOfBirth);
          }
          this.profileFormGroup.get('sex').setValue(this.tenant.user.sex);
          this.imgArnFront = this.tenant.imgArnFront != ' ' ? this.tenant.imgArnFront.trim() + "?date=" + new Date().getTime() : '';
          this.imgArnBack = this.tenant.imgArnBack != ' ' ? this.tenant.imgArnBack.trim() + "?date=" + new Date().getTime() : '';
        } else {
          this.showErr(response.message)
        }
        this.removeLoading();
      },
      err => {
        this.showErr(CommonMessage.defaultErrMess);
        this.removeLoading();
      }
    );
  }

  getAddress() {
    this.addLoading();
    let arr = null;
    if (this.tenant.user.address != ' ') {
      arr = this.tenant.user.address.split('-');
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
          this.removeLoading();
        });
        break;
      }
    }
    this.removeLoading();
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
    if (!this.profileFormGroup.invalid && this.profileFormGroup.value.name.trim() != "" && this.profileFormGroup.value.address.trim() != "") {
      if (this.checkChangeData()) {
        this.addLoading();
        this.service.updateProfile({ user: this.tenant.user, tenant: this.tenant }).subscribe(
          res => {
            this.removeLoading();
            let response = JSON.parse('' + res);
            if (response.type == 1) {
              this.showSuccess(response.message);
            } else {
              this.showErr(response.message)
            }
          },
          err => {
            this.removeLoading();
            this.showErr(CommonMessage.defaultErrMess);
          }
        );
      } else {
        this.showErr(CommonMessage.notChangeMess);
      }
    } else {
      this.showErr(CommonMessage.inputAllFiel);
    }
  }

  checkChangeData(): any {
    let check = false;
    let address =
      this.profileFormGroup.value.address +
      '-' +
      this.profileFormGroup.value.wards.name +
      '-' +
      this.profileFormGroup.value.distric.name +
      '-' +
      this.profileFormGroup.value.province.name;
    if (this.tenant.user.name != this.profileFormGroup.value.name) {
      this.tenant.user.name = this.profileFormGroup.value.name
      check = true;
    }
    if (this.tenant.user.sex != this.profileFormGroup.value.sex) {
      this.tenant.user.sex = this.profileFormGroup.value.sex
      check = true;
    }
    if (this.tenant.user.dateOfBirth != this.profileFormGroup.value.date) {
      this.tenant.user.dateOfBirth = this.profileFormGroup.value.date
      check = true;
    }
    if (this.tenant.user.address != address) {
      this.tenant.user.address = address
      check = true;
    }
    if (this.profileFormGroup.value.imgArnFront != '') {
      this.tenant.imgArnFront = this.imgArnFront.split(',')[1];
      check = true;
    } else {
      this.tenant.imgArnFront = '';
    }

    if (this.profileFormGroup.value.imgArnBack != '') {
      this.tenant.imgArnBack = this.imgArnBack.split(',')[1];
      check = true;
    } else {
      this.tenant.imgArnBack = '';
    }
    console.log(address);
    console.log(this.tenant.user.address);
    return check;
  }

  uploadFrontID(imageResult: ImageResult) {
    if (imageResult.error) {
      this.showErr('Vui lòng tải lên đúng định dạng ảnh')
    }
    else {
      let image = (imageResult.resized && imageResult.resized.dataURL) || imageResult.dataURL;

      this.getOrientation(imageResult.file, (orientation) => {
        this.rotateImageFileProcessor.process(orientation +','+image).then(res => {
          this.imgArnFront = res;
        });
      });
    }
  }
  uploadBackID(imageResult: ImageResult) {
    if (imageResult.error) {
      this.showErr('Vui lòng tải lên đúng định dạng ảnh')
    }
    else {
      let image = (imageResult.resized && imageResult.resized.dataURL) || imageResult.dataURL;
      this.getOrientation(imageResult.file, (orientation) => {
        this.rotateImageFileProcessor.process(orientation +','+ image).then(res => {
          this.imgArnBack = res;
        });
      });

    }
  }
  getOrientation(file, callback) {
    var reader: any,
    target: EventTarget;
    reader = new FileReader();
    reader.onload = (event) => {
      var view = new DataView(event.target.result);
      if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
      var length = view.byteLength,
        offset = 2;
      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) {
            return callback(-1);
          }
          var little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;

          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + (i * 12), little) == 0x0112)
              return callback(view.getUint16(offset + (i * 12) + 8, little));
        }
        else if ((marker & 0xFF00) != 0xFF00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1);
    };
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  };
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
}


