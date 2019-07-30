import {Injectable }from '@angular/core';

import {HttpClient, HttpErrorResponse, HttpHeaders }from '@angular/common/http';
import { Admin }from '../../models/admin';
import { Equipment } from '../../models/equipment'
import {Observable, throwError, BehaviorSubject }from 'rxjs';

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
export class AdminService {

  private baseUrl: string = environment.baseUrl;
  listEquipment: BehaviorSubject<any>;
  constructor(private http: HttpClient) {
    this.listEquipment = new BehaviorSubject<any>(null)
  }

  getEquipmentByPage(page : any) : Observable<Equipment[]> {
    return this.http.post<Equipment[]>(`${this.baseUrl}/api/equipment`, page, httpOptions);
  }

  addOrUpdateEquipment(equipment : any) : Observable<Equipment> {
    return this.http.post<any>(`${this.baseUrl}/api/admin/equipment/add`, equipment, httpOptions);
  }

  deleteOrActiveEquipment(equipment : any) : Observable<Equipment> {
    return this.http.post<any>(`${this.baseUrl}/api/admin/equipment/status/change`, equipment, httpOptions);
  }

  activeEquipment(equipment : any) : Observable<Equipment> {
    return this.http.post<any>(`${this.baseUrl}/api/admin/equipment/delete`, equipment, httpOptions);
  }

  dashboard(data : any) : Observable<Equipment> {
    return this.http.post<any>(`${this.baseUrl}/api/admin/dashboard`, data, httpOptions);
  }
}
