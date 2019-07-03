import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders }from '@angular/common/http';
import {Observable, throwError, BehaviorSubject }from 'rxjs';

import {environment }from '../../../environments/environment';
import { Notification } from 'src/app/models/notification';
const httpOptions =  {
  headers:new HttpHeaders( {
    'Content-Type':'application/json',
  }),
  withCredentials:true,
  responseType:'text'as 'json'
};
@Injectable({
  providedIn: 'root'
})

export class NotifiService {
  private baseUrl:string = environment.baseUrl;
  constructor(private http:HttpClient) {}

  getAllFromNotification(t : any):Observable <Notification[]>{
    return this.http.post <Notification[]> (`${this.baseUrl}/api/notification/from`, t, httpOptions);
  }

}
