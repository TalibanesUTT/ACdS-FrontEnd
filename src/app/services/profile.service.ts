import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { IUser } from '../interfaces/Users';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  API_URL = environments.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfile(): Observable<any> {
    return this.http.get(this.API_URL + '/profile', {});
  }

  putProfile(data: IUser, id: number): Observable<any> {
    if (data.phoneNumber) {
      data.phoneNumber = data.phoneNumber.replace(/-/g, '') as '1231231231';
    }
    return this.http.put(this.API_URL + `/user-management/updateProfile/${id}`, data, {});
  }

  putUserTemporaly(data: IUser, id: number): Observable<any> {
    if (data.phoneNumber) {
      data.phoneNumber = data.phoneNumber.replace(/-/g, '') as '1231231231';
    }
    return this.http.put(this.API_URL + `/user-management/updateProfile/${id}`, data, {});
  }
  updatePassword(
    data: {
      actualPassword: string;
      newPassword: string;
      passwordConfirmation: string;
    },
    id: number
  ): Observable<any> {
    return this.http.put(this.API_URL + '/user-management/updatePassword/' + id, data, {});
  }

  recoverPassword(email: { email: string; fromAdmin: boolean }): Observable<any> {
    return this.http.post(this.API_URL + '/user-management/recoverPassword', {
      email,
    });
  }
}
