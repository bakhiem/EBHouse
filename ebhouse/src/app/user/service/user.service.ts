import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as jwt from 'angular2-jwt-simple';
import * as bcrypt from 'bcryptjs';
// import * as bcrypt from 'bcrypt';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
  responseType: 'text' as 'json'
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = environment.baseUrl;
  private secret = '68686868686868688686868686868686';

  constructor(private http: HttpClient) { }
  register(user: any): Observable<String> {
    return this.http.post<String>(`${this.baseUrl}/api/register`, user, httpOptions)
  };
  //after verify otp call this function
  submit(user: any): Observable<String> {
    return this.http.post<String>(`${this.baseUrl}/api/register/submit`, user, httpOptions)
  };

  login(user: any): Observable<String> {
    return this.http.post<String>(`${this.baseUrl}/api/login`, user, httpOptions)
  };
  checkExistPhone(phone: any): Observable<String> {
    return this.http.post<String>(`${this.baseUrl}/api/register/isExisted`, phone, httpOptions)
  };
  resetPass(user: any, hash: any): Observable<any> {
    var payload = {
      username: user.phone,
      private_key: hash
    };
    let token = jwt.encode(payload, this.secret);
    let httpOptionsReset = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      }),
      withCredentials: true,
      responseType: 'text' as 'json'
    };
    let data = {
      new_pass :  user.password
    }
    return this.http.post<any>(`${this.baseUrl}/api/pass/reset`, data, httpOptionsReset);
  };
  // Login (user : User): Observable<Response> {
  //   console.log(user);
  //   return this.http
  //   .post(`${this.baseUrl}/api/auth`, {user}, {headers: this.getHeaders(), withCredentials: true});
  // }

  // Logout(): Observable<Response> {
  //   return this.http
  //   .delete(`${this.baseUrl}/api/auth` , {headers: this.getHeaders(), withCredentials: true});
  // }



  // private handleError<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {

  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     this.log(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }

  /** Log a HeroService message with the MessageService */
  // private log(message: string) {
  //   this.messageService.add(`HeroService: ${message}`);
  // }
}
