import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import {User} from '../user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-confirm-phone',
  templateUrl: './confirm-phone.component.html',
  styleUrls: ['./confirm-phone.component.css']
})
export class ConfirmPhoneComponent implements OnInit {
  user : User;
  constructor(private data : DataService,
    private router: Router
    ){}

  ngOnInit() {
    this.data.currentUser.subscribe(user => this.user = user);
    // if(this.user == null){
    //   this.router.navigate(['']);
    // }
    console.log(this.user);
  }
  
}
