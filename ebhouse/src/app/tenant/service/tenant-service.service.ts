import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Tenant } from '../../models/tenant';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import {Contract}from '../../models/contract';
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
export class TenantServiceService {
  private baseUrl: string = environment.baseUrl;
  currentContract: BehaviorSubject<Contract>;
  constructor(private http: HttpClient) {
    this.currentContract = new BehaviorSubject<any>(null)
  }
  changeContract(contract) {
    this.currentContract.next(contract);
  }

  getProfile() : Observable<Tenant>{
    return this.http.post<Tenant>(`${this.baseUrl}/api/profile`, null, httpOptions);
  }

  updateProfile(t : any) : Observable<Tenant>{
    return this.http.post<any>(`${this.baseUrl}/api/profile/update`, t, httpOptions);
  }

  getBhInfo(data : any) : Observable<Tenant>{
    return this.http.post<any>(`${this.baseUrl}/api/tenant/bhInfo`, data, httpOptions);
  }
  getUtility(data : any) : Observable<Tenant>{
    return this.http.post<any>(`${this.baseUrl}/api/tenant/utilityInfo`, data, httpOptions);
  }
  getContract(data : any) : Observable<Tenant>{
    return this.http.post<Tenant>(`${this.baseUrl}/api/tenant/contractInfo`, data, httpOptions);
  }
  getFinancial(data : any) : Observable<Tenant>{
    return this.http.post<Tenant>(`${this.baseUrl}/api/tenant/financialInfo`, data, httpOptions);
  }
  getOneFinancial(data : any) : Observable<Tenant>{
    return this.http.post<Tenant>(`${this.baseUrl}/api/tenant/financialDetail`, data, httpOptions);
  }
  getRoomsInfo(data : any) : Observable<Tenant>{
    return this.http.post<Tenant>(`${this.baseUrl}/api/tenant/roomInfo`, data, httpOptions);
  }
  getEquipment():Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/equipment/all`, null, httpOptions);
  }
  

}
