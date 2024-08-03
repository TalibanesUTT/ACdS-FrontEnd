import { ResponseGlobal } from './responseGlobal';

export interface IVehicles {
  id?: number;
  color?: string;
  model?: string;
  owner?: string;
  plates?: string;
  serialNumber?: string;
  year?: string;
}

export interface IVehiclesResponse extends ResponseGlobal {
  data: IVehicles[];
}
