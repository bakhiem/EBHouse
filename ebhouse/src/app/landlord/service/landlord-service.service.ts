import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import {Landlord} from '../../models/landlord';
import {BoardingHouse} from '../../models/bh';
import {RoomType} from '../../models/room-type';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/Subject';
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
  currentBh: BehaviorSubject<any>;
  constructor(private http: HttpClient) { 
    this.currentBh = new BehaviorSubject<any>({})
  }

  getAllBoardingHouses() : Observable<BoardingHouse[]> {
    return this.http.post<BoardingHouse[]>(`${this.baseUrl}/api/landlord/bh/all`, null, httpOptions);
  }
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
  getRoomTypes(page : any) : Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/landlord/rt/`, page, httpOptions);
  }
  getAllRoomTypes() : Observable<BoardingHouse[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/landlord/rt/all`, null, httpOptions);
  }
  createRt(rt : any) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/landlord/rt/add`, rt, httpOptions);
  }
  editRt(rt : any) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/landlord/rt/update`, rt, httpOptions);
  }
  deleteRt(rt : any) {
    return this.http.post<any>(`${this.baseUrl}/api/landlord/rt/delete`, rt, httpOptions);
  }
  getRooms(page : any) : Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/landlord/room/`, page, httpOptions);
  }
  createRoom(room : any) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/landlord/room/create`, room, httpOptions);
  }
  editRoom(room : any) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/landlord/room/update`, room, httpOptions);
  }
  deleteRoom(room : any) {
    return this.http.post<any>(`${this.baseUrl}/api/landlord/room/delete`, room, httpOptions);
  }
}
