import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import {Landlord} from '../models/landlord';
import {BoardingHouse} from '../models/bh';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Contract} from '../models/contract';
import { CommmonFunction } from '../shared/common-function';
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
  
  getAllBoardingHouses(bhName ?: string) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/landlord/bh/all`, null, httpOptions)
    .pipe(map(res => {
      let response = JSON.parse("" + res);
      if (response.type == 1) {
        let data = JSON.parse("" + CommmonFunction.escapeSpecialChars(response.data));
        this.bhList = data.boardingHouse;
        if(this.bhList.length > 0 && bhName){
          for (let index = 0; index < this.bhList.length; index++) {
            const element = this.bhList[index];
            if(element['name'] == bhName){
              this.currentBh.next(element);
            }
          }
        }
         else if (this.bhList.length > 0 && this.currentBh.value == null) {
         this.currentBh.next(this.bhList[0]);
        }
        else if(data.boardingHouse.length == 0){
          this.currentBh.next({});
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
        else if(response.data.length == 0){
          this.currentBh.next({});
        }
      }
    }, err => {
      console.log(err);
    }));;
  }
}
