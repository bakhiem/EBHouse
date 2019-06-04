import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private http: HttpClient) {}
  public getProvince(): Observable<any> {
    return this.http.get("../../assets/place/tinh_tp.json");
  }
  public getDistric(code : string): Observable<any> {
    return this.http.get("../../assets/quan-huyen/" + code + ".json");
  }
  public getWards(code : string): Observable<any> {
    return this.http.get("../../assets/xa-phuong/" + code + ".json");
  }
}
