import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { IUser } from '../interfaces/Users';
import { AuthService } from './auth.service';
import { UserInterface } from '../sections/panel/users/users-table/users-table.component';

@Injectable({ providedIn: 'root' })
export class ReportService {
  API_URL = environments.API_URL + '/reports';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAccountingBalance(year: string, month?: string): Observable<any> {
    if (month === undefined) {
      return this.http.get(this.API_URL + '/accounting-balance?year=' + year, {});
    }
    return this.http.get(this.API_URL + '/accounting-balance?year=' + year + '&month=' + month, {});
  }
  getExpenditureSummary(year: string, month?: string): Observable<any> {
    if (month === undefined) {
      return this.http.get(this.API_URL + '/expenditure-summary?year=' + year, {});
    }
    return this.http.get(this.API_URL + '/expenditure-summary?year=' + year + '&month=' + month, {});
  }
  getIncomeSummary(startDate: string, endDate: string): Observable<any> {
    return this.http.get(this.API_URL + '/income-summary?startDate=' + startDate + '&endDate=' + endDate, {});
  }
}
