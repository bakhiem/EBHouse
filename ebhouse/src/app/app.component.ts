import { Component,ViewChild,OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './user/service/authentication.service';
import { SharedServiceService } from './service/shared-service.service';
// import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

// import { map, filter, scan } from 'rxjs/operators';
// import { Event as RouterEvent } from '@angular/router';
// declare var $: any;
  import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
  import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  title = 'ebhouse';
  isLoggedIn$: Observable<boolean>;
  constructor(
    private shareService : SharedServiceService,
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    private _router: Router
    ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.toastrService.overlayContainer = this.toastContainer;
  }
  isLandingPage(){
    if(this._router.url == '/home'){
      return true;
    }
  }
}
