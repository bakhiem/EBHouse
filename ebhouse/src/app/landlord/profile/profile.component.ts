import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { DataService } from '../../user/service/data.service';
import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import * as $ from 'jquery';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class LandlordProfileComponent implements OnInit {
  message: string = "";
  roleDefault: number = 1;
  dataProvince: any[];
  dataDistric: any[];
  dataWards: any[];
  phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
  profileFormGroup: FormGroup;
  currentUser: any;

  //for edit
  arrAddress : any[];//store array address of user (['thon3','thach hoa',...])

  constructor(private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService, ) {}

  ngOnInit() {
    //edit user
    this.currentUser = this.authenticationService.currentUserValue;
    console.log(this.currentUser)
    if (this.currentUser && this.currentUser.user.address && this.currentUser.user.address) {
      this.arrAddress = this.currentUser.address.split('-');
    }
    //get tinh/tp
    this.placeService.getProvince().subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])

        //for edit
        if(this.currentUser.address && response[key].name ==  this.arrAddress[3]){
          this.profileFormGroup.get('province').setValue(response[key]);
          this.onChangeProvince();
        }
      }
      this.dataProvince = arr;
      console.log(arr);
    });


    this.profileFormGroup = this.fb.group({
      name: this.fb.control(this.currentUser ? this.currentUser.name : "", Validators.compose([
        Validators.required
      ])),
      phone: this.fb.control(this.currentUser ? this.currentUser.phone : "", Validators.compose([
        Validators.required,
        Validators.pattern(this.phonePattern)
      ])),

      date: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      sex: this.fb.control(this.currentUser.sex ? this.currentUser.sex : "male", Validators.compose([
        Validators.required
      ])),
      province: this.fb.control("", Validators.compose([
        Validators.required
      ])),
      distric: this.fb.control("", Validators.compose([
        Validators.required
      ])),
      wards: this.fb.control("", Validators.compose([
        Validators.required
      ])),
      address: this.fb.control(this.currentUser.address ? this.arrAddress[0] : "", Validators.compose([
        Validators.required
      ]))

    });
  }
  onChangeProvince() {
    this.placeService.getDistric(this.profileFormGroup.value.province.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
        //for edit
        if(this.currentUser.address && response[key].name ==  this.arrAddress[2]){
          this.profileFormGroup.get('distric').setValue(response[key]);
          this.onChangeDistric();
        }
      }
      this.dataDistric = arr;
    });
  };
  onChangeDistric() {
    this.placeService.getWards(this.profileFormGroup.value.distric.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
        //for edit
        if(this.currentUser.address && response[key].name ==  this.arrAddress[1]){
          this.profileFormGroup.get('wards').setValue(response[key]);
        }

      }
      this.dataWards = arr;
    });
  };
  onSubmit() {
    //if edit, compare if have change then post to server

    let fullAddress = this.profileFormGroup.value.address + "-" + this.profileFormGroup.value.wards.name + "-" + this.profileFormGroup.value.distric.name + "-" + this.profileFormGroup.value.province.name;

  }


  //for edit information
  // onEditDistric() {
  //   this.placeService.getWards(this.profileFormGroup.value.distric.code).subscribe(response => {
  //     var arr = [];
  //     for (var key in response) {
  //       arr.push(response[key])
  //     }
  //     this.dataWards = arr;
  //   });
  // };


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
