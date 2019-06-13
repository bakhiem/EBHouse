import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import {Landlord} from '../../models/landlord';
import {BoardingHouse} from '../../models/bh';
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
export class LandlordService {
  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  
  getBoardingHouses(page : any) : Observable<BoardingHouse[]> {
    return this.http.post<BoardingHouse[]>(`${this.baseUrl}/api/landlord/bh/`, page, httpOptions);
  }
  createBh(bh : BoardingHouse) : Observable<BoardingHouse> {
    return this.http.post<BoardingHouse>(`${this.baseUrl}/api/landlord/bh/create`, bh, httpOptions);
  }
  editBh(bh : BoardingHouse) : Observable<BoardingHouse> {
    return this.http.post<BoardingHouse>(`${this.baseUrl}/api/landlord/bh/update`, bh, httpOptions);
  }
  deleteBh(bh : BoardingHouse) {
    return this.http.post<BoardingHouse>(`${this.baseUrl}/api/landlord/bh/delete`, bh, httpOptions);
  }
  
}
