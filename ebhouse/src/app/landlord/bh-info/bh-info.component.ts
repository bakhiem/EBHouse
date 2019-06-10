import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PlaceService } from '../../service/place.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import * as $AB  from 'jquery';
import * as bootstrap from "bootstrap";
export interface Food {
  address: string;
  numberOfRoom: number;
  name: string;
  description: string;
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
  arrAddress : any[];
  createbhFormGroup: FormGroup;
  
  dataSource: Food[] = [
    { name: 'Nhà trọ 1', address: "Thôn 3,Thạch Hoà,Thạch Thất,Hà Nội", numberOfRoom: 24,description :"" },
    { name: 'Nhà trọ 2', address: "Thôn 6,Thạch Hoà,Thạch Thất,Hà Nội", numberOfRoom: 37, description :"" }
  ];
  displayedColumns: string[] = ['name', 'address', 'numberOfRoom', 'description','customColumn'];


  constructor(private fb: FormBuilder,
    private placeService: PlaceService,
    public dialog: MatDialog) { }
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
        Validators.required,Validators.pattern("[0-9]+")
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
  //create bh
  createBh(){
    this.createbhFormGroup.reset();
    $('.bd-example-modal-lg').modal('show');
  }
  onSubmit(){

  }
  getProvinceOnEdit(provinceName : string){
    for (let province of this.dataProvince) {
        if(provinceName == province.name){
          this.createbhFormGroup.get('province').setValue(province);
          console.log('ahihi')
        }
    }
    return '';
  }
  //edit and delete boarding-house :
  editBh(obj){
    console.log(obj)
    this.createbhFormGroup.get('name').setValue(obj.name);
    this.createbhFormGroup.get('numberOfRoom').setValue(obj.numberOfRoom);
    this.createbhFormGroup.get('description').setValue(obj.description);
    this.arrAddress =obj.address.split(',');
    this.getProvinceOnEdit(this.arrAddress[3]);
    $('.bd-example-modal-lg').modal('show');
    
  }

  deleteBh(event){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Bạn chắc chắn muốn xóa nhà trọ không ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('Yes clicked');
        // DO SOMETHING
      }
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



