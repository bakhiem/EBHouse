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
    userStorage : User;
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
                
                if(resObject && resObject.data){
                    console.log(resObject.data);
                    let resDataObject = resObject.data.map;
                    if (resDataObject && resDataObject.user_Login.token) {
                        //console.log(resObject);
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                         this.userStorage  = {
                            name : resDataObject.user_Login.name,
                            phone : resDataObject.user_Login.phone,
                            id : resDataObject.id,
                            token : resDataObject.user_Login.token,
                            status : resDataObject.user_Login.status,
                            role : resDataObject.role
                        };
                        localStorage.setItem('currentUser', JSON.stringify(this.userStorage));
                        console.log(this.userStorage);
                        this.currentUserSubject.next(this.userStorage);
                    }
                }
                return [res,this.userStorage];
            }));
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
  }