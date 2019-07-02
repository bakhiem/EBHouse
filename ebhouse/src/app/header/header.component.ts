import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from '../service/shared-service.service';
import { BoardingHouse } from '../models/bh';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../user/service/authentication.service';
import { Role } from '../user/models/role';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private service: SharedServiceService,
    private authService: AuthenticationService) {
    // this.getBoardingHouses() 
  }
  role: string = '';
  currentUser: any;
  isLoggedIn$: Observable<boolean>;
  bhList: BoardingHouse[];
  currentBh: BoardingHouse;
  getRole() {
    if (this.currentUser && this.currentUser.role === Role.Lanlord) {
      this.role = 'landlord';
    }
    else if (this.currentUser && this.currentUser.role === Role.Tenant) {
      this.role = 'tenant';
    }

  }
  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.authService.currentUser.subscribe(data => {
      this.currentUser = data;
      this.getRole();
      if (this.role == 'landlord') {
        console.log('asasdas')
        this.getBoardingHouses();
      }
    });
  }

  getBoardingHouses() {
    this.service.getAllBoardingHouses().subscribe();
    this.service.currentBh.subscribe((data) => {
      this.currentBh = data;
      this.bhList = this.service.bhList;
    })
  }
  onChangeBh() {
    this.service.currentBh.next(this.currentBh);
  }
}
