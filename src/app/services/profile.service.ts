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
    return this.http.get(this.API_URL + '/profile', {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  putProfile(data: IUser, id: number): Observable<any> {
    if (data.phoneNumber) {
      data.phoneNumber = data.phoneNumber.replace(/-/g, '') as '1231231231';
    }
    return this.http.put(
      this.API_URL + `/user-management/updateProfile/${id}`,
      data,
      {
        headers: {
          Authorization: 'Bearer ' + this.authService.getToken(),
        },
      }
    );
  }

  putUserTemporaly(data: IUser, id: number): Observable<any> {
    if (data.phoneNumber) {
      data.phoneNumber = data.phoneNumber.replace(/-/g, '') as '1231231231';
    }
    return this.http.put(
      this.API_URL + `/user-management/updateProfile/${id}`,
      data,
      {
        headers: {
          Authorization: 'Bearer ' + this.authService.getToken(),
        },
      }
    );
  }
  updatePassword(
    data: {
      actualPassword: string;
      newPassword: string;
      passwordConfirmation: string;
    },
    id: number
  ): Observable<any> {
    return this.http.put(
      this.API_URL + '/user-management/updatePassword/' + id,
      data,
      {
        headers: {
          Authorization: 'Bearer ' + this.authService.getToken(),
        },
      }
    );
  }

  recoverPassword(email: string): Observable<any> {
    return this.http.post(this.API_URL + '/user-management/recoverPassword', {
      email,
    });
  }
}
