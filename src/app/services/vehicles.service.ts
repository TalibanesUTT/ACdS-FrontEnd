import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { AuthService } from './auth.service';
import { ICustomerResponse } from '../interfaces/Users';

@Injectable({ providedIn: 'root' })
export class VehiclesService {
  API_URL = environments.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllVehicles(): Observable<any> {
    return this.http.get(this.API_URL + '/vehicles', {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
  postVehicle(data: any): Observable<any> {
    return this.http.post(this.API_URL + '/vehicles', data, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }
  putVehicle(data: any, id: number): Observable<any> {
    return this.http.put(this.API_URL + `/vehicles/${id}`, data, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }
  getVehicleById(id: number): Observable<any> {
    return this.http.get(this.API_URL + `/vehicles/${id}`, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }
  getModelByBrand(brandId: number): Observable<any> {
    return this.http.get(this.API_URL + `/car-models/${brandId}`, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }
}
