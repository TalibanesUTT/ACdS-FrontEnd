import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {map} from "rxjs/operators";

export enum RoleEnum {
  CUSTOMER = "customer",
  ROOT = "root",
  ADMIN = "admin",
  MECHANIC = "mechanic",
}

interface User {
  "id": string,
  "name": string,
  "lastName": string,
  "email": string,
  "phoneNumber": string,
  "emailConfirmed": boolean,
  "phoneConfirmed": boolean,
  "active": boolean,
  "role": RoleEnum
}

export enum ActionEnum {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private permissions: { [role in RoleEnum]: ActionEnum[] } = {
    [RoleEnum.CUSTOMER]: [ActionEnum.READ, ActionEnum.CREATE, ActionEnum.UPDATE],
    [RoleEnum.ROOT]: [ActionEnum.READ, ActionEnum.CREATE, ActionEnum.UPDATE, ActionEnum.DELETE],
    [RoleEnum.ADMIN]: [ActionEnum.READ, ActionEnum.CREATE, ActionEnum.UPDATE, ActionEnum.DELETE],
    [RoleEnum.MECHANIC]: [ActionEnum.READ, ActionEnum.CREATE, ActionEnum.UPDATE, ActionEnum.DELETE],
  };
  private userRole = new BehaviorSubject<RoleEnum>(RoleEnum.CUSTOMER);
  readonly role$ = this.userRole.asObservable()

  constructor(private http: HttpClient) {
    this.http.get<User>('/profile').pipe(
      map(response => response.role),
    ).subscribe(role => this.userRole.next(role));
  }

  hasPermission(action: ActionEnum): boolean {
    return this.permissions[this.userRole.getValue()].includes(action);
  }
}
