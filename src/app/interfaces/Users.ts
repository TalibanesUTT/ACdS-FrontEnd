import { ResponseGlobal } from './responseGlobal';

export interface IUser {
  active?: boolean;
  createDate?: string;
  email?: string;
  emailConfirmed?: boolean;
  id?: number;
  lastName?: string;
  name?: string;
  password?: string;
  phoneConfirmed?: boolean;
  phoneNumber?: string;
  verificationCode?: boolean;
  access_token?: string;
  token?: string;
  role?: string;
}

export interface ICustomerResponse extends ResponseGlobal {
  data: IUser[];
}
