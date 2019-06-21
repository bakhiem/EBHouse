import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Tenant } from '../../models/tenant';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
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
  constructor(private http: HttpClient) { }

  getProfile() : Observable<Tenant>{
    return this.http.post<Tenant>(`${this.baseUrl}/api/profile`, null, httpOptions);
  }

  updateProfile(t : any) : Observable<Tenant>{
    return this.http.post<any>(`${this.baseUrl}/api/profile/update`, t, httpOptions);
  }
}
