import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs';
import {environment }from '../../../environments/environment';

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
export class EquipmentServiceService {
  constructor(private http: HttpClient) {}
  // public getEquipment(): Observable<any> {
  //   return this.http.get("../../assets/equipment.json");
  // }
  private baseUrl: string = environment.baseUrl;
  getEquipment():Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/equipment/all`, null, httpOptions);
  }
}

