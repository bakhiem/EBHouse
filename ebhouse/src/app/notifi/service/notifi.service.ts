import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders }from '@angular/common/http';
import {Observable, throwError, BehaviorSubject }from 'rxjs';

import {environment }from '../../../environments/environment';
import { Notification } from 'src/app/models/notification';
import { User } from 'src/app/user/models/user';
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

  listNotification: BehaviorSubject<any>;
  update: BehaviorSubject<any>;

  constructor(private http:HttpClient) {
    this.listNotification = new BehaviorSubject<any>(null);
    this.update = new BehaviorSubject<any>(null);
  }

  getAllFromNotification(t : any):Observable <Notification[]>{
    return this.http.post <Notification[]> (`${this.baseUrl}/api/notification/from`, t, httpOptions);
  }

  getAllToNotification(t : any):Observable <Notification[]>{
    return this.http.post <Notification[]> (`${this.baseUrl}/api/notification/to`, t, httpOptions);
  }

  updateStatus(t : any):Observable <Notification[]>{
    return this.http.post <Notification[]> (`${this.baseUrl}/api/notification/update`, t, httpOptions);
  }

  getUserSend():Observable <User[]>{
    return this.http.post <User[]> (`${this.baseUrl}/api/notification/user`, null, httpOptions);
  }

  sendNotification(t : any):Observable <Notification[]>{
    return this.http.post <Notification[]> (`${this.baseUrl}/api/notification/send`, t, httpOptions);
  }
}
