import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import {Landlord} from '../models/landlord';
import {BoardingHouse} from '../models/bh';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Contract} from '../models/contract';
import { environment } from '../../environments/environment';
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
export class SharedServiceService {

  private baseUrl: string = environment.baseUrl;
  currentBh: BehaviorSubject<any>;
  
  bhList : [{}];
  
  constructor(private http: HttpClient) { 
    this.currentBh = new BehaviorSubject<any>(null);
  }
  
  getAllBoardingHouses() : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/landlord/bh/all`, null, httpOptions)
    .pipe(map(res => {
      let response = JSON.parse("" + res);
      if (response.type == 1) {
        let data = JSON.parse(response.data);
        this.bhList = data.boardingHouse;
        if (this.bhList.length > 0 && this.currentBh.value == null) {
         this.currentBh.next(this.bhList[0]);
        }
      }
    }, err => {
      console.log(err);
    }));;
  }
  getAllBoardingHousesTenant() : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/tenant/bhAll`, null, httpOptions)
    .pipe(map(res => {
      let response = JSON.parse("" + res);
      console.log(response)
      if (response.type == 1) {
        this.bhList = response.data;
        if (this.bhList.length > 0 && this.currentBh.value == null) {
         this.currentBh.next(this.bhList[0]);
        }
      }
    }, err => {
      console.log(err);
    }));;
  }
}
