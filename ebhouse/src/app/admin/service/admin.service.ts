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
  currentContract: BehaviorSubject<Equipment>;
  constructor(private http: HttpClient) {
    this.currentContract = new BehaviorSubject<any>(null)
  }
  changeCOntract(contract) {
    this.currentContract.next(contract);
  }
  getEquipmentByPage(page : any) : Observable<Equipment[]> {
    return this.http.post<Equipment[]>(`${this.baseUrl}/api/admin/equipment`, page, httpOptions);
  }
}
