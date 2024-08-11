import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { IUser } from '../interfaces/Users';
import { AuthService } from './auth.service';
import { UserInterface } from '../sections/panel/users/users-table/users-table.component';

@Injectable({ providedIn: 'root' })
export class UsersService {
  API_URL = environments.API_URL + '/user-management';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllUsers(): Observable<any> {
    return this.http.get(this.API_URL + '/users', {});
  }

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

  updateUser(form: any, updateURL: string): Observable<any> {
    return this.http.put(environments.API_URL + '/' + updateURL, form, {});
  }
}
