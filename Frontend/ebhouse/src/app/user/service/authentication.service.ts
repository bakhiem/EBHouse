import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { environment } from '../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
  responseType: 'text' as 'json'
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private baseUrl: string = environment.baseUrl;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user : User ) {
        return this.http.post<any>(`${this.baseUrl}/api/login`, user ,httpOptions)
            .pipe(map(res => {
                // login successful if there's a jwt token in the response
                // if (res && res.token) {
                //     console.log(res);
                //     // store user details and jwt token in local storage to keep user logged in between page refreshes
                //     localStorage.setItem('currentUser', JSON.stringify(res));
                //     this.currentUserSubject.next(res);
                // }
                // var saveUser : User = {
                //   phone : user.phone,
                //   token : res
                // };
                console.log(res);
                // localStorage.setItem('currentUser', JSON.stringify(saveUser));
                return res;
            }));
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
  }