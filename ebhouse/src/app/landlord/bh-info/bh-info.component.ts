import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { PlaceService } from '../../service/place.service';
// export interface Food {
//   calories: number;
//   carbs: number;
//   fat: number;
//   name: string;
//   protein: number;
// }
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
  createbhFormGroup: FormGroup;
  
  // dataSource: Food[] = [
  //   { name: 'Yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
  //   { name: 'Sandwich', calories: 237, fat: 9, carbs: 37, protein: 4 },
  //   { name: 'Eclairs', calories: 262, fat: 16, carbs: 24, protein: 6 },
  //   { name: 'Cupcakes', calories: 305, fat: 4, carbs: 67, protein: 4 },
  //   { name: 'Gingerbreads', calories: 356, fat: 16, carbs: 49, protein: 4 },
  // ];
  // displayedColumns: string[] = ['name', 'calories', 'fat', 'carbs', 'protein'];


  constructor(private fb: FormBuilder,
    private placeService: PlaceService) { }
  ngOnInit() {
    this.placeService.getProvince().subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataProvince = arr;
    });



    this.createbhFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      numberOfRoom: this.fb.control('', Validators.compose([
        Validators.required,
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
      description : ''

    });

  }
  onChangeProvince() {
    this.placeService.getDistric(this.createbhFormGroup.value.province.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataDistric = arr;
    });
  };
  onChangeDistric() {
    this.placeService.getWards(this.createbhFormGroup.value.distric.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataWards = arr;
    });
  };
}



