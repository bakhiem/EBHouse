import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {

  constructor(private service : AuthenticationService,
    private router : Router) { }

  ngOnInit() {
    this.service.logout().subscribe();
    this.router.navigate(['/login']);
    // location.reload(true);
  }


}



