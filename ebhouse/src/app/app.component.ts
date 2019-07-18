import { Component,ViewChild,OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './user/service/authentication.service';
// import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

// import { map, filter, scan } from 'rxjs/operators';
// import { Event as RouterEvent } from '@angular/router';
// declare var $: any;
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
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
    private authService: AuthenticationService,
    private toastrService: ToastrService
    ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.toastrService.overlayContainer = this.toastContainer;
  }


}
