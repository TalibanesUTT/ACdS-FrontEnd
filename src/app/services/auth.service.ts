import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { IUser } from '../interfaces/Users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  API_URL = environments.API_URL + '/auth';
  constructor(private http: HttpClient) {}

  login(form: IUser): Observable<IUser> {
    return this.http.post(this.API_URL + '/login', form);
  }

  register(form: IUser): Observable<IUser> {
    return this.http.post(this.API_URL + '/register', form);
  }

  verifyEmail(code: string): Observable<any> {
    return this.http.post(this.API_URL + '/verify-email', { code });
  }
}
