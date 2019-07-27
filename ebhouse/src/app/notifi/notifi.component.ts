import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonMessage, Message } from '../models/message';
import { Notification } from '../models/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlaceService } from '../service/place.service';
import { AuthenticationService } from '../user/service/authentication.service';
import { NotifiService } from './service/notifi.service';
import { Role } from '../user/models/role';
import { MatTableDataSource } from '@angular/material/table';
import { CommmonFunction } from '../shared/common-function';
import { ToastrService } from 'ngx-toastr';

declare var $: JQueryStatic;
@Component({
  selector: 'app-notifi',
  templateUrl: './notifi.component.html',
  styleUrls: ['./notifi.component.css'],
})
export class NotifiComponent implements OnInit {
  public createNotifiFormGroup: FormGroup;
  public flag: any = 0;
  newNotifi: Notification = new Notification();
  public dataSourceSent = new MatTableDataSource();
  public listDataSet: any[] = [];
  listUser: any[] = [];
  listBH: any[] = [];
  listRoom: any[] = [];
  flagLoadUser: any = 0;
  option_send: String = 'user';
  public currentNotifi: Notification;
  role: string = '';
  currentUser: any;
  check: any = 0;

  displayedColumns: string[] = ['userTo', 'action'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: NotifiService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
      this.getRole();
    });
    this.createNotifiFormGroup = this.fb.group({
      userToText: this.fb.control(''),
      userTo: this.fb.control(''),
      subject: this.fb.control('', Validators.compose([Validators.required])),
      content: this.fb.control('', Validators.compose([Validators.required])),
    });
  }

  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }
  getRole() {
    if (this.currentUser && this.currentUser.role === Role.Lanlord) {
      this.role = 'landlord';
    } else if (this.currentUser && this.currentUser.role === Role.Tenant) {
      this.role = 'tenant';
    } else {
      this.role = '';
    }
  }

  creatNotification() {
    this.addLoading();
    this.createNotifiFormGroup.reset();
    this.dataSourceSent.data = [];
    this.listDataSet = [];
    $('#myInput').removeAttr('disabled');
    $('#myDropdown').removeClass('show-s');
    console.log(this.flagLoadUser);
    if (this.flagLoadUser == 0) {
      this.service.getUserSend().subscribe(
        res => {
          let response = JSON.parse('' + res);
          if (response.type == 1) {
            let data = JSON.parse('' + CommmonFunction.escapeSpecialChars(response.data));
            this.listUser = data.listUser;
            if (data.listBoardingHouse != undefined) {
              this.listBH = data.listBoardingHouse;
            }
            if (data.listRoom != undefined) {
              this.listRoom = data.listRoom;
            }

            if (data.listBoardingHouse != undefined && data.listRoom != undefined) {
              this.listBH.forEach(bh => {
                this.listRoom.forEach(room => {
                  if (room.boardinghouse_id == bh.id) {
                    room['bh_name'] = bh.name;
                  }
                });
              });
            }
            this.flagLoadUser = 1;
            $('#modalNotification').modal('show');
          } else {
            this.showErr(response.message);
          }
          this.removeLoading();
        },
        err => {
          this.showErr(CommonMessage.defaultErrMess);
          this.removeLoading();
        }
      );
    }else{
      $('#modalNotification').modal('show');
      this.removeLoading();
    }
  }

  myFunction() {
    $('#myDropdown').toggleClass('show-s');
  }

  checkChange() {
    this.createNotifiFormGroup.get('userTo').setValue(null);
  }

  public onSubmit() {
    if (!this.createNotifiFormGroup.invalid) {
      this.addLoading();

      this.newNotifi.subject = this.createNotifiFormGroup.value.subject;
      this.newNotifi.content = this.createNotifiFormGroup.value.content;

      let listBhSent = [];
      let listRoomSent = [];
      let listUserSent = [];
      let listAdminSent = [];
      if (this.flag == 1) {
        listUserSent.push(this.createNotifiFormGroup.value.userTo);
      } else {
        this.listDataSet.forEach(element => {
          switch (element.option) {
            case 'bh':
              listBhSent.push(element.id);
              break;
            case 'room':
              listRoomSent.push(element.id);
              break;
            case 'user':
              listUserSent.push(element.id);
              break;
            case 'admin':
              listAdminSent.push(element.id);
              break;
          }
        });
      }

      this.service
        .sendNotification({
          notification: this.newNotifi,
          list_bh: listBhSent,
          list_room: listRoomSent,
          list_user: listUserSent,
          list_admin: listAdminSent,
        })
        .subscribe(
          res => {
            this.removeLoading();
            let response = JSON.parse('' + res);
            if (response.type == 1) {
              this.showSuccess(response.message);
            } else {
              this.showErr(response.message);
            }
            this.service.listNotification.next(1);
            if (this.flag == 1) {
              this.service.updateStatus({ id: this.currentNotifi.id, status: this.currentNotifi.status + 1 }).subscribe(
                res => {
                  let response = JSON.parse('' + res);
                  if (response.type == 1) {
                    this.service.listNotification.next(1);
                  }
                },
                err => {
                  this.showErr(CommonMessage.defaultErrMess);
                  this.removeLoading();
                }
              );
            }
            $('#modalNotification').modal('hide');
          },
          err => {
            this.showErr(CommonMessage.defaultErrMess);
          }
        );
    } else {
      this.showErr(CommonMessage.inputAllFiel);
    }
  }

  hidenDropDown() {
    this.check = 0;
    $('#myDropdown').removeClass('show-s');
  }

  disabledClick(t: String, event: any) {
    this.check = 0;
    let checkExist = 1;
    this.listDataSet.forEach(element => {
      if (element.id == event.target.rel) {
        checkExist = 0;
        this.check = 1;
      }
    });
    if (checkExist == 1) {
      this.option_send = t;
      this.createNotifiFormGroup.get('userToText').setValue(event.target.text);
      this.listDataSet.push({ name: event.target.text, option: t, id: event.target.rel });
      this.dataSourceSent.data = this.listDataSet;
      $('#myDropdown').removeClass('show-s');
    }
    return false;
  }

  forcus() {}

  filterFunction() {
    var input, filter, ul, li, a, i, div, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    div = document.getElementById('myDropdown');
    a = div.getElementsByTagName('a');
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = '';
      } else {
        a[i].style.display = 'none';
      }
    }
  }

  removeDataSent(i: any) {
    this.listDataSet.splice(i, 1);
    this.dataSourceSent.data = this.listDataSet;
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
