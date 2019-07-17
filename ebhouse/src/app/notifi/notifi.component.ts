import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonMessage, Message } from '../models/message';
import { Notification } from '../models/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlaceService } from '../service/place.service';
import { AuthenticationService } from '../user/service/authentication.service';
import { NotifiService } from './service/notifi.service';
import { Role } from '../user/models/role';
import { MatTableDataSource } from '@angular/material/table';
declare var $:JQueryStatic;
@Component({
  selector: 'app-notifi',
  templateUrl: './notifi.component.html',
  styleUrls: ['./notifi.component.css']
})
export class NotifiComponent implements OnInit {
  message: Message = {
    content: '',
    type: 0,
  };

  messages: Message = {
    content: '',
    type: 0,
  };
  public createNotifiFormGroup: FormGroup;
  public flag: any = 0;
  newNotifi: Notification = new Notification();
  dataSourceSent = new MatTableDataSource();
  listDataSet: any[] = [];
  listUser: any[] = [];
  listBH: any[]= [];
  listRoom: any[]= [];
  option_send: String = "user";
  public currentNotifi: Notification;
  role : string = '';
  currentUser: any;
  check : any = 0;

  displayedColumns: string[] = ['userTo','action'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: NotifiService
  ) { }

  ngOnInit() {
    this.resetMess();
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data;
      this.getRole();
    });
    this.createNotifiFormGroup = this.fb.group({
      userToText: this.fb.control('', Validators.compose([Validators.required])),
      userTo: this.fb.control('', Validators.compose([Validators.required])),
      subject: this.fb.control('', Validators.compose([Validators.required])),
      content: this.fb.control('', Validators.compose([Validators.required]))
    });
  }

  getRole(){
    if(this.currentUser && this.currentUser.role === Role.Lanlord){
      this.role = 'landlord';
    }
    else if(this.currentUser && this.currentUser.role === Role.Tenant){
      this.role = 'tenant';
    }
    else{
      this.role = ''
    }

  }

  creatNotification(){
    this.resetMessage();
    this.createNotifiFormGroup.reset();
    $('#myDropdown').removeClass('show-s');
    this.service.getUserSend().subscribe(
      res => {
        let response = JSON.parse('' + res);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.listUser = data.listUser;
          if(data.listBoardingHouse != undefined){
            this.listBH = data.listBoardingHouse;

          }
          if(data.listRoom != undefined){
            this.listRoom = data.listRoom;
          }

          if(data.listBoardingHouse != undefined && data.listRoom != undefined){
            this.listBH.forEach(bh => {
              this.listRoom.forEach(room => {
                if(room.boardinghouse_id == bh.id){
                  room['bh_name'] = bh.name;
                }
              });
            });
          }

          this.createNotifiFormGroup.get('userTo').setValue(null);
          this.createNotifiFormGroup.get('userToText').setValue(null);
          this.createNotifiFormGroup.get('subject').setValue(null);
          this.createNotifiFormGroup.get('content').setValue(null);
          $('#modalNotification').modal('show');
        } else {
          this.message.content = response.message;
          this.message.type = 0;
        }
        this.removeLoading();
      },
      err => {
        this.message.content = 'Lỗi';
        this.message.type = 0;
        this.removeLoading();
      }
    );
  }

  myFunction() {
    $('#myDropdown').toggleClass('show-s');
  }

  checkChange(){
    this.createNotifiFormGroup.get('userTo').setValue(null);
  }

  public onSubmit(){
    this.resetMessage();
    if (!this.createNotifiFormGroup.invalid) {
        this.addLoading();

        this.newNotifi.subject = this.createNotifiFormGroup.value.subject;
        this.newNotifi.content = this.createNotifiFormGroup.value.content;

        let listBhSent = [];
        let listRoomSent = [];
        let listUserSent = [];
        if(this.flag == 1){
          listUserSent.push(this.createNotifiFormGroup.value.userTo);
        }else{
          this.listDataSet.forEach(element => {
            switch(element.option){
              case 'bh':
                listBhSent.push(element.id);
                break;
              case 'room':
                listRoomSent.push(element.id);
                break;
              case 'user':
                listUserSent.push(element.id);
                break;
            }
          });
        }

        this.service.sendNotification({ notification: this.newNotifi, list_bh: listBhSent, list_room: listRoomSent, list_user: listUserSent}).subscribe(
          res => {
            this.removeLoading();
            let response = JSON.parse('' + res);
            if (response.type == 1) {
              this.messages.type = 1;
            } else {
              this.messages.type = 0;
            }
            this.messages.content = response.message;
            this.service.listNotification.next(1);
            if(this.flag == 1){
              this.service.updateStatus({ id:  this.currentNotifi.id, status :  this.currentNotifi.status+1}).subscribe(
                res => {
                  let response = JSON.parse('' + res);
                  if (response.type == 1) {
                    this.service.listNotification.next(1);
                  }
                },
                err => {
                  this.message.content = 'Lỗi';
                  this.message.type = 0;
                  this.removeLoading();
                }
              );
            }
          },
          err => {
            this.messages.type = 0;
            this.messages.content = CommonMessage.defaultErrMess;
          }
        );
    }else{
      this.messages.content = 'Vui lòng điền đầy đủ thông tin';
      this.messages.type = 0;
    }
  }

  hidenDropDown(){
    this.check = 0;
    $('#myDropdown').removeClass('show-s');
  }

  disabledClick(t : String, event : any){
      this.check = 0;
      let checkExist = 1;
      this.listDataSet.forEach(element => {
        if(element.id ==  event.target.rel){
          checkExist = 0;
          this.check = 1;
        }
      });
      if(checkExist == 1){
        this.option_send = t;
        this.createNotifiFormGroup.get('userToText').setValue(event.target.text);
        this.listDataSet.push({name: event.target.text, option: t, id: event.target.rel});
        this.dataSourceSent.data = this.listDataSet;
        $('#myDropdown').removeClass('show-s');
      }
    return false;
  }

  forcus(){}

  filterFunction() {
    var input, filter, ul, li, a, i, div ,txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  removeDataSent(i:any){
    this.listDataSet.splice(i,1);
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

  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }

  resetMessage() {
    this.messages.content = '';
    this.messages.type = 0;
  }
}
