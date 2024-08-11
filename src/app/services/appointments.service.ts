import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { AuthService } from './auth.service';
import { ICustomerResponse } from '../interfaces/Users';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  API_URL = environments.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllAppointments(): Observable<any> {
    return this.http.get(this.API_URL + '/appointments', {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
  postAppointment(data: any): Observable<any> {
    return this.http.post(this.API_URL + '/appointments', data, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }
  putAppointment(data: any, id: number): Observable<any> {
    return this.http.put(this.API_URL + `/appointments/${id}`, data, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }
  getAppointmentById(id: number): Observable<any> {
    return this.http.get(this.API_URL + `/appointments/${id}`, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() },
    });
  }

  getAppointmentPending(): Observable<any> {
    return this.http.get(this.API_URL + '/appointments/pending', {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
}
