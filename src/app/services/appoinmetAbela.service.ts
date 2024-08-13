import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { AuthService } from './auth.service';
import { ICustomerResponse } from '../interfaces/Users';

@Injectable({ providedIn: 'root' })
export class AppointmentAbelaService {
  API_URL = environments.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllAppointments(): Observable<any> {
    return this.http.get(this.API_URL + '/appointments/all', {});
  }

  getUserAppointments(): Observable<any> {
    return this.http.get(this.API_URL + '/appointments', {});
  }
  postAppointment(data: any): Observable<any> {
    return this.http.post(this.API_URL + '/appointments', data, {});
  }
  putAppointment(data: any, id: number): Observable<any> {
    return this.http.put(this.API_URL + `/appointments/${id}`, data, {});
  }
  getAppointmentById(id: number): Observable<any> {
    return this.http.get(this.API_URL + `/appointments/${id}`, {});
  }

  getAppointmentPending(): Observable<any> {
    return this.http.get(this.API_URL + '/appointments/pending', {});
  }
}
