import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  constructor(private http: HttpClient) { }
  public getProvince(): Observable<any> {
    return this.http.get("../../assets/place/tinh_tp.json").pipe(map(res => {
      var resultArray = $.map(res, function (value, index) { return [value]; });
      resultArray.sort((a,b) => a['slug'] > b['slug'] ? -1 : 1).reverse();
      return resultArray
    }, err => { return err}));
  }
  public getDistric(code: string): Observable<any> {
    return this.http.get("../../assets/place/quan-huyen/" + code + ".json").pipe(map(res => {
      var resultArray = $.map(res, function (value, index) { return [value]; });
      resultArray.sort((a,b) => a['slug'] > b['slug'] ? -1 : 1).reverse();
      return resultArray
    }, err => { return err}));;
  }
  public getWards(code: string): Observable<any> {
    return this.http.get("../../assets/place/xa-phuong/" + code + ".json").pipe(map(res => {
      var resultArray = $.map(res, function (value, index) { return [value]; });
      resultArray.sort((a,b) => a['slug'] > b['slug'] ? -1 : 1).reverse();
      return resultArray
    }, err => { return err}));;
  }
}
