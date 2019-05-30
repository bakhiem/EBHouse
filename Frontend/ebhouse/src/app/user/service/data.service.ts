import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  userSource = new BehaviorSubject<User>(null);
  currentUser = this.userSource.asObservable();
  constructor() { }
  changeUser(user) {
    this.userSource.next(user);
  }
}
