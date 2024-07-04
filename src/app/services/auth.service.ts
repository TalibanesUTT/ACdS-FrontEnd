import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { IUser } from '../interfaces/Users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  API_URL = environments.API_URL + '/auth';
  constructor(private http: HttpClient) {}

  login(form: IUser): Observable<any> {
    return this.http.post(this.API_URL + '/login', form);
  }

  register(form: IUser): Observable<any> {
    return this.http.post(this.API_URL + '/register', form);
  }

  verifyEmail(url: string, code: string): Observable<any> {
    //sendo code como param
    return this.http.get(url + '&code=' + code);
  }

  resendCode(id: number): Observable<any> {
    return this.http.get(this.API_URL + '/resendVerificationCode/' + id);
  }
}
