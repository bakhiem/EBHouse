import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { environment } from '../../../environments/environment';
import { Role } from '../models/role';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
  responseType: 'text' as 'json'
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    userStorage : any;
    private baseUrl: string = environment.baseUrl;
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }
 

    login(u : User ) {
        return this.http.post<any>(`${this.baseUrl}/api/login`, u ,httpOptions)
            .pipe(map(res => {
                //login successful if there's a jwt token in the response
                let resObject = JSON.parse(res);
                
                if(resObject && resObject.data){
                    let resDataObject = resObject.data.map;
                   
                    if(resDataObject.role == Role.Lanlord){
                        let userLogin = JSON.parse(resObject.data.map.landlord);
                        if (resDataObject && userLogin.user.token) {
                            console.log(userLogin);
                            // store user details and jwt token in local storage to keep user logged in between page refreshes
                             this.userStorage  = {
                                user : userLogin.user,
                                id : userLogin.id,
                                role : resDataObject.role
                            };
                            localStorage.setItem('currentUser', JSON.stringify(this.userStorage));
                            console.log(this.userStorage);
                            this.currentUserSubject.next(this.userStorage);
                        }
                    }
                    else if(resDataObject.role == Role.Tenant){
                        let userLogin = JSON.parse(resObject.data.map.tenant);
                        if (resDataObject && userLogin.user.token) {
                            console.log(userLogin);
                            // store user details and jwt token in local storage to keep user logged in between page refreshes
                             this.userStorage  = {
                                user : userLogin.user,
                                id : userLogin.id,
                                role : resDataObject.role
                            };
                            localStorage.setItem('currentUser', JSON.stringify(this.userStorage));
                            console.log(this.userStorage);
                            this.currentUserSubject.next(this.userStorage);
                        }
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