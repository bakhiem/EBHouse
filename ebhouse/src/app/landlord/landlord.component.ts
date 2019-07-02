import { Component, OnInit } from '@angular/core';

import { LandlordService } from './service/landlord-service.service';

import { BoardingHouse } from '../models/bh';
@Component({
  selector: 'app-landlord',
  templateUrl: './landlord.component.html',
  styleUrls: ['./landlord.component.css'],
})
export class LandlordComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }
}
