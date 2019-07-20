import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PlaceService } from '../../service/place.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { LandlordService } from '../service/landlord-service.service';
import { BoardingHouse } from '../../models/bh';
import * as $AB from 'jquery';
import * as bootstrap from "bootstrap";
import { LandlordComponent } from '../landlord.component';
import { CommonMessage, Message } from '../../models/message';
import { ToastrService } from 'ngx-toastr';
import { SharedServiceService } from '../../service/shared-service.service';
@Component({
  selector: 'app-bh-info',
  templateUrl: './bh-info.component.html',
  styleUrls: ['./bh-info.component.css']
})
export class BhInfoComponent implements OnInit {
  dataProvince: any[];
  dataDistric: any[];
  dataWards: any[];
  arrAddress: any[];
  bhList: BoardingHouse[];
  createbhFormGroup: FormGroup;
  isEdit: number = 0;
  currentBh: BoardingHouse;
  CommonMessage = CommonMessage;
  //paging
  perPage: number = 10;
  currentPage: number = 1;
  totalPage: number = 0;

  displayedColumns: string[] = ['name', 'address', 'numberOfRoom', 'description', 'customColumn'];


  constructor(private fb: FormBuilder,
    private placeService: PlaceService,
    public dialog: MatDialog,
    private service: LandlordService,
    private shareService: SharedServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getBoardingHouses();
    //get province from service
    this.placeService.getProvince().subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.dataProvince = arr;
      this.dataWards = null;
    });
     //this.jqueryCode();

    //create form group
    this.createbhFormGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([
        Validators.required
      ])),
      id: '',
      numberOfRoom: this.fb.control('', Validators.compose([
        Validators.required, Validators.pattern("[0-9]+")
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
      description: ''
    });
  }

  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  getBoardingHouses() {
    let page: any = {
      page: this.currentPage
    }
    this.addLoading();
    this.service.getBoardingHouses(page).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.bhList = data.boardingHouse;
          this.totalPage = data.totalPage;

        }
      }, err => {
        this.removeLoading();
        this.showErr(CommonMessage.defaultErrMess);
        console.log(err);
      })
  }

  //create bh
  createBh() {
    this.arrAddress = null;
    this.createbhFormGroup.reset();
    this.isEdit = 0;
    this.currentBh = null;
    this.dataDistric = [];
    this.dataWards = [];
    $('.bd-example-modal-lg').modal('show');
  }
  onSubmit() {
    let fullAddress = this.createbhFormGroup.value.address + "-" + this.createbhFormGroup.value.wards.name + "-" + this.createbhFormGroup.value.distric.name + "-" + this.createbhFormGroup.value.province.name;
    if (this.isEdit == 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: "Bạn chắc chắn muốn lưu thay đổi không ?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let bh: BoardingHouse = {
            id: this.createbhFormGroup.value.id,
            name: this.createbhFormGroup.value.name,
            address: fullAddress,
            numberOfRoom: this.createbhFormGroup.value.numberOfRoom,
            description: this.createbhFormGroup.value.description ? this.createbhFormGroup.value.description : ''
          }

          if (bh.address == this.currentBh.address && bh.name == this.currentBh.name && bh.numberOfRoom == this.currentBh.numberOfRoom && bh.description == this.currentBh.description) {
            this.showErr(CommonMessage.notChangeMess);
          }
          else {
            this.addLoading();
            this.service.editBh(bh).subscribe(
              res => {
                this.successRequestHandle(res)
              },
              err => {
                this.errRequestHandle(err);
              }
            )
          }
        }
      })
    }
    else {
      let bh: BoardingHouse = {
        name: this.createbhFormGroup.value.name,
        numberOfRoom: this.createbhFormGroup.value.numberOfRoom,
        address: fullAddress,
        description: this.createbhFormGroup.value.description ? this.createbhFormGroup.value.description : ''
      }
      this.addLoading();
      this.service.createBh(bh).subscribe(
        res => {
          this.successRequestHandle(res);
        },
        err => {
          this.errRequestHandle(err);
        }
      )
    }
  }

  successRequestHandle(res) {
    let resObject = JSON.parse("" + res);
    if (resObject.type == 1) {
      this.showSuccess(resObject.message);
      this.removeLoading();
      this.currentBh = null;
      $('.bd-example-modal-lg').modal('hide');
      this.getBoardingHouses();
      this.shareService.currentBh.next(null);
      this.shareService.getAllBoardingHouses().subscribe();
    }
    else {
      this.showErr(resObject.message);
      this.removeLoading();
    }
  }
  errRequestHandle(err) {
    this.showErr(CommonMessage.defaultErrMess);
    console.log(err);
    this.removeLoading();
  }
  getProvinceOnEdit(provinceName: string) {
    for (let province of this.dataProvince) {
      if (provinceName == province.name) {
        this.createbhFormGroup.get('province').setValue(province);
        this.onChangeProvinceEdit();
      }
    }
    return '';
  }

  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
  jqueryCode() {
    $("select").change(() => {
      console.log('asdasd')
      if (this.isEdit == 1) {
      
        $("#myButton").removeAttr("disabled");
      }

    });
    $("input").keypress(() => {
      console.log('asdasd')
      if (this.isEdit == 1) {
       
        $("#myButton").removeAttr("disabled");
      }
    });


  }

  //edit and delete boarding-house :
  editBh(obj) {
    this.isEdit = 1;
    this.currentBh = obj;
    this.createbhFormGroup.get('name').setValue(obj.name);
    this.createbhFormGroup.get('numberOfRoom').setValue(obj.numberOfRoom);
    this.createbhFormGroup.get('description').setValue(obj.description);
    this.createbhFormGroup.get('id').setValue(obj.id);
    this.arrAddress = obj.address.split('-');
    this.getProvinceOnEdit(this.arrAddress[3]);
    this.createbhFormGroup.get('address').setValue(this.arrAddress[0]);
    console.log($("#myButton"))
    // $("#myButton").attr("disabled", "disabled");s
    $('.bd-example-modal-lg').modal('show');

  }
  deleteBh(obj) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Bạn chắc chắn muốn xóa nhà trọ không ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let bh = {
          id: obj.id
        }
        this.addLoading();
        this.service.deleteBh(bh).subscribe(
          res => {
            this.successRequestHandle(res)
          },
          err => {
            this.errRequestHandle(this.errRequestHandle)
          }
        )
      }
    });
  }
  onChangeProvince() {
    this.placeService.getDistric(this.createbhFormGroup.value.province.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.createbhFormGroup.get('distric').setValue(arr[0]);
      this.onChangeDistric();
      this.dataDistric = arr;
    });
  };
  onChangeProvinceEdit() {
    this.placeService.getDistric(this.createbhFormGroup.value.province.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
        if (this.arrAddress && this.arrAddress[2] == response[key].name) {
          this.createbhFormGroup.get('distric').setValue(response[key]);
          this.onChangeDistricEdit();
        }
      }
      this.dataDistric = arr;
    });
  };
  onChangeDistricEdit() {
    this.placeService.getWards(this.createbhFormGroup.value.distric.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
        if (this.arrAddress && this.arrAddress[1] == response[key].name) {
          this.createbhFormGroup.get('wards').setValue(response[key]);
        }
      }
      this.dataWards = arr;
    });
  };
  onChangeDistric() {
    this.placeService.getWards(this.createbhFormGroup.value.distric.code).subscribe(response => {
      var arr = [];
      for (var key in response) {
        arr.push(response[key])
      }
      this.createbhFormGroup.get('wards').setValue(arr[0]);
      this.dataWards = arr;
    });
  };
  //paging

  pageChanged(page) {
    this.currentPage = page;
    this.getBoardingHouses();
  }

}






