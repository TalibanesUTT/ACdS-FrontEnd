import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { AuthService } from './auth.service';
import { GResponseOrderService } from '../interfaces/orderService';

@Injectable({ providedIn: 'root' })
export class ServiceOrdersService {
  API_URL = environments.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}
  getAllServiceOrders(): Observable<GResponseOrderService> {
    return this.http.get<GResponseOrderService>(this.API_URL + '/service-orders', {});
  }

  getAllServiceOrdersByUser(id: number): Observable<GResponseOrderService> {
    return this.http.get<GResponseOrderService>(this.API_URL + '/service-orders/user/' + id, {});
  }
  postServiceOrder(data: any): Observable<any> {
    return this.http.post(this.API_URL + '/service-orders', data, {});
  }
  putServiceOrder(data: any, id: number): Observable<any> {
    return this.http.put(this.API_URL + '/service-orders/' + id, data, {});
  }

  postServiceOrderDetail(data: any, id: number): Observable<any> {
    return this.http.post(this.API_URL + '/service-orders/addDetail/' + id, data, {});
  }
  postUpdateStatus(data: any, id: number): Observable<any> {
    return this.http.post(this.API_URL + '/service-orders/updateStatus/' + id, data, {});
  }
  getAllService(): Observable<any> {
    return this.http.get<any>(this.API_URL + '/services', {});
  }
}
