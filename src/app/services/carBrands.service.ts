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
    return this.http.get(this.API_URL + '/car-brands', {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
  postCarBrand(data: any): Observable<any> {
    return this.http.post(this.API_URL + '/car-brands', data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
  putCarBrand(data: any, id: number): Observable<any> {
    return this.http.put(this.API_URL + `/car-brands/${id}`, data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
  getCarBrandById(id: number): Observable<any> {
    return this.http.get(this.API_URL + `/car-brands/${id}`, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
}
