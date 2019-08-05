import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { DataService } from '../../user/service/data.service';
import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import * as $AB from 'jquery';
import * as bootstrap from "bootstrap";
import { CommmonFunction } from '../../shared/common-function';
import { ToastrService } from 'ngx-toastr';
import { CommonMessage } from '../../models/message';
import { LandlordService } from '../service/landlord-service.service';
import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import { Landlord } from '../../models/landlord';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../contract/customDate';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
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
  check: number = 0;
  maxDate = new Date();
  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    public dialog: MatDialog,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: LandlordService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.removeLoading();
    this.getProvince();
    this.profileFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([Validators.required])),
      phone: this.fb.control('', Validators.compose([Validators.required, Validators.pattern(this.phonePattern)])),
      date: this.fb.control({ value: '', disabled: true }, Validators.compose([Validators.required])),
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
          this.showErr(response.message)
        }
      },
      err => {
        this.showErr(CommonMessage.defaultErrMess)
        this.removeLoading();
      }
    );
  }
  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  getAddress() {
    this.addLoading();
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
    if (!this.profileFormGroup.get('date').value) {
      this.showErr('Vui lòng nhập ngày sinh');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: "Bạn chắc chắn muốn lưu thông tin không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.profileFormGroup.invalid && this.profileFormGroup.value.name.trim() != "" && this.profileFormGroup.value.address.trim() != "") {
          this.checkChangeData();
          if (this.check == 1) {
            this.addLoading();
            this.service.updateProfile({ user: this.landlord.user, landlord: this.landlord }).subscribe(
              res => {
                this.removeLoading();
                let response = JSON.parse('' + res);
                if (response.type == 1) {
                  this.showSuccess(response.message)
                } else {
                  this.showErr(response.message)
                }
              },
              err => {
                this.showErr(CommonMessage.defaultErrMess)
              }
            );
          } else {
            this.showErr('Vui lòng thay đổi thông tin nếu bạn muốn cập nhật thông tin!')
    
          }
        } else {
          this.showErr('Vui lòng kiểm tra lại!')
        }
      }
    })
   
  }
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  checkChangeData() {
    let dateOfBirth = this.formatDate(this.profileFormGroup.get('date').value);
    let address =
      this.profileFormGroup.value.address.replace(/-/g, ' ') +
      '-' +
      this.profileFormGroup.value.wards.name +
      '-' +
      this.profileFormGroup.value.distric.name +
      '-' +
      this.profileFormGroup.value.province.name;
    if (this.landlord.user.name != this.profileFormGroup.value.name) {
      this.landlord.user.name = this.profileFormGroup.value.name
      this.check = 1;
    }
    if (this.landlord.user.sex != this.profileFormGroup.value.sex) {
      this.landlord.user.sex = this.profileFormGroup.value.sex
      this.check = 1;
    }
    if (this.landlord.user.dateOfBirth != dateOfBirth) {
      this.landlord.user.dateOfBirth = dateOfBirth
      this.check = 1;
    }
    if (this.landlord.user.address != address) {
      this.landlord.user.address = address
      this.check = 1;
    }
  }
  changePasswordSubmit() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: "Bạn chắc chắn đổi mật khẩu không?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let new_pass = $('#new-pass').val().toString().trim();
        let old_pass = $('#old-pass').val().toString().trim();
        let re_new_pass = $('#re-new-pass').val().toString().trim();
        if (new_pass && old_pass && re_new_pass) {
          if (new_pass.length >= 8 && old_pass.length >= 8 && re_new_pass.length >= 8) {
            if (new_pass == old_pass) {
              this.showErr('Mật khấu cũ cần khác mật khẩu mới');
            }
            else {
              if (new_pass == re_new_pass) {
                let data = {
                  new_pass: new_pass,
                  old_pass: old_pass
                }
                this.addLoading();
                this.service.resetPass(data).subscribe(
                  res => {
                    this.removeLoading();
                    let response = JSON.parse('' + res);
                    if (response.type == 1) {
                      let token = response.data;
                      this.authenticationService.changeToken(token);
                      this.showSuccess(response.message);
                      $('#modal2').modal('hide');
                    } else {
                      this.showErr(response.message)
                    }
                  },
                  err => {
                    this.showErr(CommonMessage.defaultErrMess)
                  }
                )
              }
              else {
                this.showErr('Mật khẩu mới và nhập lại mật khẩu mới cần trùng nhau');
              }
            }
          }
          else {
            this.showErr('Mật khẩu cần ít nhất 8 ký tự');
          }
        }
        else {
          this.showErr('Vui lòng điền vào tất cả các trường');
        }
      }
    });



  }
  changePassword() {
    $('#new-pass').val('');
    $('#re-new-pass').val('');
    $('#old-pass').val('');
    $('#modal2').modal('show');

  }
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }

}
