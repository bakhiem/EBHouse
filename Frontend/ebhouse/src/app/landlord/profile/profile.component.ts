import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class LandlordProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('profile')
  }

}
