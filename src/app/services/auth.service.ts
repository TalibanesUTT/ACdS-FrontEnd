import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  API_URL = environments.API_URL + '/auth';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.API_URL + '/login', { email, password });
  }

  register(form: any): Observable<any> {
    return this.http.post(this.API_URL + '/register', form);
  }

  verifyEmail(email: string, code: string): Observable<any> {
    return this.http.post(this.API_URL + '/verify-email', { email, code });
  }
}
