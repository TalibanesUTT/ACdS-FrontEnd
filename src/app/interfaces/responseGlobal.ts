export interface ResponseGlobal {
  status: number;
  message: string;
  data: any;
}

export interface ResponseGlobalTyped<T> {
  status: number;
  message: string;
  data: T;
}
