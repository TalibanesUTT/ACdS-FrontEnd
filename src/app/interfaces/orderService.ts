export interface IOrderService {
  fileNumber: string;
  initialMileage: number;
  notes: string;
  createDate: string;
  vehicle: IVehicle;
  appointment: IAppointment; // Cambiado de string a IAppointment
  services: IService[];
  detail: IDetail;
  history: IHistory[];
  actualStatus: string;
  dependsOnAppointment?: boolean;
  id?: number;
  action?: string;
  notifyTo: string;
}

export interface IAppointment {
  // Nueva interfaz para Appointment
  id: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  createDate: string;
  customer: ICustomer;
}

export interface ICustomer {
  // Nueva interfaz para Customer dentro de Appointment
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  active: boolean;
  role: string;
}

// Las demás interfaces permanecen iguales
export interface IDetail {
  id: number;
  budget: string;
  totalCost: number;
  departureDate: string;
  finalMileage: number;
  observations: string;
  repairDays: number;
}

export interface IHistory {
  id: number;
  comments: string;
  status: string;
  rollback: string;
  time: string;
  service_order_id?: number;
}

export interface IService {
  id: number;
  name: string;
}

export interface IVehicle {
  id: number;
  serialNumber: string;
  year: number;
  color: string;
  plates: string;
  owner: string;
  model: IModel;
}

export interface IModel {
  id: number;
  model: string;
  brand: string;
}

export interface GResponseOrderService {
  data: IOrderService[];
  message: string;
  status: number;
}
