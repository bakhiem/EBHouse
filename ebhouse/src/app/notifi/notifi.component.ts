import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
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
          console.log(response.data);
          let data = JSON.parse(response.data);
          this.listUser = data.listUser;
          if(data.listBoardingHouse != 'undefined'){
            this.listBH = data.listBoardingHouse
          }
          if(data.listRoom != 'undefined'){
            this.listRoom = data.listRoom
          }
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

  filterFunction() {
    var input, filter, ul, li, a, i, div,txtValue;
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
  onSubmit(){}

  disabledClick(){
    if($(this).hasClass('send-user')){

    }
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
