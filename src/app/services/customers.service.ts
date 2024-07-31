import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { AuthService } from './auth.service';
import { ICustomerResponse } from '../interfaces/Users';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  API_URL = environments.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllCustomers(): Observable<ICustomerResponse> {
    return this.http.get<ICustomerResponse>(this.API_URL + '/customers', {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
  postCustomer(data: any): Observable<any> {
    return this.http.post(this.API_URL + '/customers', data, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }
  putCustomer(data: any, id: number): Observable<any> {
    return this.http.put(this.API_URL + `/customers/${id}`, data, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }
  getCustomerById(id: number): Observable<ICustomerResponse> {
    return this.http.get<ICustomerResponse>(this.API_URL + `/customers/${id}`, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }
}
