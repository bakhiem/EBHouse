import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './user/service/authentication.service';
import { Role } from './user/models/role';
import { User } from './user/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ebhouse';
  currentUser: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  get isLandlord() {
    return this.currentUser && this.currentUser.role === Role.Lanlord;
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
