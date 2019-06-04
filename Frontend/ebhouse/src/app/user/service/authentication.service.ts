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
                //login successful if there's a jwt token in the response
                console.log(res);
                let resObject = JSON.parse(res);
                console.log(resObject.data);
                if(resObject && resObject.data){
                    let resDataObject = JSON.parse(resObject.data);
                    console.log(typeof(resDataObject));
                    if (resDataObject && resDataObject.token) {
                        //console.log(resObject);
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(resDataObject));
                        this.currentUserSubject.next(resDataObject);
                    }
                }
               
                
                // var saveUser : User = {
                //   phone : user.phone,
                //   token : res
                // };
                //console.log(res);
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