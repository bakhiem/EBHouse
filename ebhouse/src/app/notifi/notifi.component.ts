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
  createNotifiFormGroup: FormGroup;
  newNotifi: Notification;
  listUser: any[] = [];
  listBH: any[]= [];
  listRoom: any[]= [];
  option_send: String;


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

  onSubmit(){
    if (!this.createNotifiFormGroup.invalid) {
        this.addLoading();
        this.newNotifi.userTo = this.createNotifiFormGroup.value.userTo;
        this.newNotifi.subject = this.createNotifiFormGroup.value.subject;
        this.newNotifi.content = this.createNotifiFormGroup.value.content;

        this.service.sendNotification({ notification: this.newNotifi, flag: this.option_send }).subscribe(
          res => {
            this.removeLoading();
            let response = JSON.parse('' + res);
            if (response.type == 1) {
              this.message.type = 1;
            } else {
              this.message.type = 0;
            }
            this.message.content = response.message;
          },
          err => {
            this.message.type = 0;
            this.message.content = CommonMessage.defaultErrMess;
          }
        );
    }
  }

  disabledClick(t : String, event : any){
    this.option_send = t;
    $("#myInput").val(event.target.text);
    this.createNotifiFormGroup.get('userTo').setValue(event.target.rel);
    $('#myDropdown').removeClass('show-s');
    return false;
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
}
