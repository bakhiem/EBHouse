import {Injectable }from '@angular/core';

import {HttpClient, HttpErrorResponse, HttpHeaders }from '@angular/common/http';
import {Landlord}from '../../models/landlord';
import {BoardingHouse}from '../../models/bh';
import {Observable, throwError, BehaviorSubject }from 'rxjs';

import {Contract}from '../../models/contract';
import {environment }from '../../../environments/environment';
const httpOptions =  {
  headers:new HttpHeaders( {
    'Content-Type':'application/json',
  }),
  withCredentials:true,
  responseType:'text'as 'json'
};
@Injectable( {
  providedIn:'root'
})
export class LandlordService {
  private baseUrl: string = environment.baseUrl;
  currentContract: BehaviorSubject<Contract>;
  constructor(private http: HttpClient) {
    this.currentContract = new BehaviorSubject<any>(null)
  }
  changeCOntract(contract) {
    this.currentContract.next(contract);
  }
  getBoardingHouses(page : any) : Observable<BoardingHouse[]> {
    return this.http.post<BoardingHouse[]>(`${this.baseUrl}/api/landlord/bh/`, page, httpOptions);
  }
  createBh(bh:BoardingHouse):Observable < BoardingHouse >  {
    return this.http.post < BoardingHouse > (`${this.baseUrl}/api/landlord/bh/create`, bh, httpOptions);
  }
  editBh(bh:BoardingHouse):Observable < BoardingHouse >  {
    return this.http.post < BoardingHouse > (`${this.baseUrl}/api/landlord/bh/update`, bh, httpOptions);
  }
  deleteBh(bh:BoardingHouse) {
    return this.http.post < BoardingHouse > (`${this.baseUrl}/api/landlord/bh/delete`, bh, httpOptions);
  }
  getRoomTypes(page:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/rt/`, page, httpOptions);
  }
  getAllRoomTypes():Observable < BoardingHouse[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/rt/all`, null, httpOptions);
  }
  createRt(rt:any):Observable < any >  {
    return this.http.post < any > (`${this.baseUrl}/api/landlord/rt/add`, rt, httpOptions);
  }
  editRt(rt:any):Observable < any >  {
    return this.http.post < any > (`${this.baseUrl}/api/landlord/rt/update`, rt, httpOptions);
  }
  deleteRt(rt:any) {
    return this.http.post < any > (`${this.baseUrl}/api/landlord/rt/delete`, rt, httpOptions);
  }
  getRooms(page:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/room/`, page, httpOptions);
  }
  createRoom(room:any):Observable < any >  {
    return this.http.post < any > (`${this.baseUrl}/api/landlord/room/create`, room, httpOptions);
  }
  editRoom(room:any):Observable < any >  {
    return this.http.post < any > (`${this.baseUrl}/api/landlord/room/update`, room, httpOptions);
  }
  deleteRoom(room:any) {
    return this.http.post < any > (`${this.baseUrl}/api/landlord/room/delete`, room, httpOptions);
  }
  getRoomsAvailable(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/room/all`, data, httpOptions);
  }
  getRoomsNoContract(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/room/available`, data, httpOptions);
  } 
  getRoomsExitsContract(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/room/existContract`, data, httpOptions);
  }
  searchTenantByPhone(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/contract/getTenant`, data, httpOptions);
  }
  addContract(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/contract/add`, data, httpOptions);
  }
  updateContract(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/contract/update`, data, httpOptions);
  }
  getContract(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/contract/`, data, httpOptions);
  }

  getContractByRoom(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/contract/getContractByRoomID`, data, httpOptions);
  }
  deleteContract(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/contract/deActive`, data, httpOptions);
  }
  getUtility(data:any):Observable < any[] >  {
    return this.http.post < any[] > (`${this.baseUrl}/api/landlord/utility/`, data, httpOptions);
  }
  getProfile():Observable < Landlord >  {
    return this.http.post < Landlord > (`${this.baseUrl}/api/profile`, null, httpOptions);
  }
  updateProfile(t:any):Observable < Landlord >  {
    return this.http.post < any > (`${this.baseUrl}/api/profile/update`, t, httpOptions);
  }

  updateUtility(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/utility/add`, data, httpOptions);
  }

  //electric
  getElectric(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/electricity/`, data, httpOptions);
  }
  updateElectric(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/electricity/update`, data, httpOptions);
  }
  getOtherElectric(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/electricity/getOther`, data, httpOptions);
  }

  // extra fee
  getExtrafee(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/extraFee/`, data, httpOptions);
  }
  addExtrafee(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/extraFee/data`, data, httpOptions);
  }
  deleteExtrafee(bh:BoardingHouse) {
    return this.http.post < BoardingHouse > (`${this.baseUrl}/api/landlord/extraFee/delete`, bh, httpOptions);
  }
  getOtherExtrafee(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/extraFee/getOther`, data, httpOptions);
  }
  //financial
  getFinancial(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/financial/`, data, httpOptions);
  }
  geOthertFinancial(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/financial/getOther`, data, httpOptions);
  }
  updateFinancial(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/financial/update`, data, httpOptions);
  }
  getOneFinancial(data : any) : Observable<Landlord>{
    return this.http.post<any>(`${this.baseUrl}/api/landlord/financial/get`, data, httpOptions);
  }

}
