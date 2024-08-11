import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { AuthService } from './auth.service';
import { ICustomerResponse } from '../interfaces/Users';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  API_URL = environments.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}
  getExpenditures(month: number, year: number): Observable<any> {
    return this.http.get(this.API_URL + `/expenditures/${month}/${year}`, {});
  }
  postExpenditure(data: any): Observable<any> {
    return this.http.post(this.API_URL + '/expenditures', data, {});
  }
}
