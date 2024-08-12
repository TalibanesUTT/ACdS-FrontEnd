import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { IUser } from '../interfaces/Users';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CarBrandsService {
  API_URL = environments.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCardBrands(): Observable<any> {
    return this.http.get(this.API_URL + '/car-brands', {});
  }
  postCarBrand(data: any): Observable<any> {
    return this.http.post(this.API_URL + '/car-brands', data, {});
  }
  putCarBrand(data: any, id: number): Observable<any> {
    return this.http.put(this.API_URL + `/car-brands/${id}`, data, {});
  }
  getCarBrandById(id: number): Observable<any> {
    return this.http.get(this.API_URL + `/car-brands/${id}`, {});
  }
}
