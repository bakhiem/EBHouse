import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from '../service/shared-service.service';
import { BoardingHouse } from '../models/bh';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../user/service/authentication.service';
import { Role } from '../user/models/role';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  role: string = '';
  currentUser: any;
  isLoggedIn$: Observable<boolean>;
  bhList: BoardingHouse[];
  currentBh: BoardingHouse;
  listUrlHidden = ['/landlord/bh-info','/landlord/room-type','/notification/from','/notification/to','/landlord/profile']
  listUrlDisable = ['/landlord/contract-update']
  constructor(private service: SharedServiceService,
    private authService: AuthenticationService,
    private _router: Router) {
   
    // this.getBoardingHouses() 
  }
  getRole() {
    if (this.currentUser && this.currentUser.role === Role.Lanlord) {
      this.role = 'landlord';
    }
    else if (this.currentUser && this.currentUser.role === Role.Tenant) {
      this.role = 'tenant';
    }
    else{
      this.role = '';
    }
  }
  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.authService.currentUser.subscribe(data => {
      this.currentUser = data;
      this.getRole();
      if (this.role == 'landlord') {
        this.getBoardingHouses();
      }
      else{
        this.service.currentBh.next(null);
        this.service.bhList = [{}];
        this.bhList = [];
        this.currentBh = null;
      }
    });
  }
  isDisabled() : boolean{
    for (let index = 0; index < this.listUrlDisable.length; index++) {
      const element = this.listUrlDisable[index];
      if(this._router.url == element){
        return true;
      }
    }
    return false;
  }
  isHiddenChooseBh() : boolean{
    for (let index = 0; index < this.listUrlHidden.length; index++) {
      const element = this.listUrlHidden[index];
     
      if(this._router.url == element){
        return false;
      }
    }
    return true;
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
