import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './user/service/authentication.service';
// import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

// import { map, filter, scan } from 'rxjs/operators';
// import { Event as RouterEvent } from '@angular/router';
// declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'ebhouse';
  isLoggedIn$: Observable<boolean>;
  constructor(
    private authService: AuthenticationService
    ) { }

  ngOnInit() {
   
  }
  ngAfterViewInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }


}
