import { Injectable } from '@angular/core';
import { User } from './user';
import {  Observable,of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  }),
  withCredentials: true,
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = 'http://localhost:6969';
  constructor(private http : HttpClient) {}
  register (user: User): Observable<User> {
    console.log(user);
    return this.http.post<User>(`${this.baseUrl}/api/register`, user, httpOptions)};

  // Login (user : User): Observable<Response> {
  //   console.log(user);
  //   return this.http
  //   .post(`${this.baseUrl}/api/auth`, {user}, {headers: this.getHeaders(), withCredentials: true});
  // }

  // Logout(): Observable<Response> {
  //   return this.http
  //   .delete(`${this.baseUrl}/api/auth` , {headers: this.getHeaders(), withCredentials: true});
  // }


  private getHeaders(){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }
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
