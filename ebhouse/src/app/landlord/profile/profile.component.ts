import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { DataService } from '../../user/service/data.service';
import { PlaceService } from '../../service/place.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class LandlordProfileComponent implements OnInit {
  message: string = "";
  roleDefault: number = 1;
  dataProvince : Observable<Array<any>>;
  phonePattern = "((09|03|07|08|05)+([0-9]{8}))";

  profileFormGroup: FormGroup;
  constructor(private fb: FormBuilder,
    private data: DataService,
    private router: Router,
    private placeService: PlaceService) { }

  ngOnInit() {
    //get tinh/tp 
    this.placeService.getProvince().subscribe(dataProvince => {
      console.log(dataProvince[1]);
    });
    this.profileFormGroup = this.fb.group({
      fullname: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      phone: this.fb.control('', Validators.compose([
        Validators.required,
        Validators.pattern(this.phonePattern)
      ])),

      date: this.fb.control('2018-03-05', Validators.compose([
        Validators.required
      ])),
      sex: this.fb.control('Male', Validators.compose([
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

    });
    


  }
  onSubmit() {
    console.log("Submit");
    console.log(this.profileFormGroup.value)
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
