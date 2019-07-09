import { Component, OnInit } from '@angular/core';
import { CommonMessage, Message } from '../models/message';
import { Notification } from '../models/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlaceService } from '../service/place.service';
import { AuthenticationService } from '../user/service/authentication.service';
import { NotifiService } from './service/notifi.service';

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
  listUser: any[] = [];
  listBH: any[]= [];
  listRoom: any[]= [];
  option_send: String = "user";
  public currentNotifi: Notification;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private placeService: PlaceService,
    private authenticationService: AuthenticationService,
    private service: NotifiService
  ) { }

  ngOnInit() {
    this.resetMess();
    this.createNotifiFormGroup = this.fb.group({
      userToText: this.fb.control('', Validators.compose([Validators.required])),
      userTo: this.fb.control('', Validators.compose([Validators.required])),
      subject: this.fb.control('', Validators.compose([Validators.required])),
      content: this.fb.control('', Validators.compose([Validators.required]))
    });
  }

  creatNotification(){
    this.resetMessage();
    this.service.getUserSend().subscribe(
      res => {
        let response = JSON.parse('' + res);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.listUser = data.listUser;
          if(data.listBoardingHouse != 'undefined'){
            this.listBH = data.listBoardingHouse
          }
          if(data.listRoom != 'undefined'){
            this.listRoom = data.listRoom
          }

          this.listBH.forEach(bh => {
            this.listRoom.forEach(room => {
              if(room.boardinghouse_id == bh.id){
                room['bh_name'] = bh.name;
              }
            });
          });

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

        this.service.sendNotification({ notification: this.newNotifi, id: this.createNotifiFormGroup.value.userTo, flag: this.option_send }).subscribe(
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

  disabledClick(t : String, event : any){
    this.option_send = t;
    this.createNotifiFormGroup.get('userToText').setValue(event.target.text);
    this.createNotifiFormGroup.get('userTo').setValue(event.target.rel);
    $('#myDropdown').removeClass('show-s');
    return false;
  }

  // hidesearch(){
  //   $('#myDropdown').removeClass('show-s');
  // }

  // forcus(){}

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
