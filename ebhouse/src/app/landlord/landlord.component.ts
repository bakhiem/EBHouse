import { Component, OnInit } from '@angular/core';

import { LandlordService } from './service/landlord-service.service';

import { Landlord } from '../models/landlord';
import { BoardingHouse } from '../models/bh';
import { Observable, throwError } from 'rxjs';
import {RoomComponent} from './room/room.component';
@Component({
  selector: 'app-landlord',
  templateUrl: './landlord.component.html',
  styleUrls: ['./landlord.component.css'],
  
})

export class LandlordComponent implements OnInit {
  bhList: BoardingHouse[];
 
  currentBh : BoardingHouse;
  constructor(
    private service: LandlordService 
    ) { this.getBoardingHouses() }

  
  ngOnInit() {
  }

  getBoardingHouses() {
    this.service.getAllBoardingHouses().subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let data = JSON.parse(response.data);
          this.bhList = data.boardingHouse;
          if (this.bhList.length > 0 && this.currentBh == null) {
           this.currentBh = this.bhList[0];
           this.service.currentBh.next(this.currentBh);
          }
        }
      }, err => {
        console.log(err);
        // this.message = "Có lỗi xảy ra";
      })
  }
  onChangeBh() {
    this.service.currentBh.next(this.currentBh);
  }
}
