import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EquipmentServiceService {
  constructor(private http: HttpClient) {}
  public getEquipment(): Observable<any> {
    return this.http.get("../../assets/equipment.json");
  }
  
}
