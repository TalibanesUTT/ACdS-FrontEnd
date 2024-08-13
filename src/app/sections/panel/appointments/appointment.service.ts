import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {ResponseGlobalTyped} from "../../../interfaces/responseGlobal";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import { SweetAlert } from "../../../shared/SweetAlert";

export type Status = 'Pendiente' | 'Completada' | 'Cancelada';

export interface Appointment {
  id: number;
  date: string;
  time: string;
  reason: string;
  userId?: number;
  customer?: Customer;
  status: Status;
}

export interface Customer {
  id: number,
  name: string,
  lastName: string
  email: string,
  phoneNumber: string,
}

interface UpdateAppointment {
  userId?: number;
  date?: string;
  time?: string;
  reason?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

@Injectable({providedIn: 'root'})
export class AppointmentService {
  private readonly path = '/appointments';
  private readonly snackBarContig: MatSnackBarConfig = {
    duration: 3000,
    verticalPosition: 'top',
    horizontalPosition: 'right'
  };

  private state = new BehaviorSubject<AppointmentState>({
    appointments: [],
    loading: false,
    error: null,
  });
  readonly state$ = this.state.asObservable();
  readonly appointments$ = this.state$.pipe(map((state) => state.appointments));

  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  private updateState(partialState: Partial<AppointmentState>): void {
    this.state.next({
      ...this.state.getValue(),
      ...partialState,
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrío un error inesperado';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error?.message || `Codigo de error: ${error.status}\nMensaje: ${error.message}`;
    }
    SweetAlert.error("",errorMessage);
    return throwError(() => new Error(errorMessage));

  }

  getUserAppointments(): void {
    this.updateState({loading: true});
    this.http.get<ResponseGlobalTyped<Appointment[]>>(this.path)
      .pipe(
        map(response => response.data),
        catchError(this.handleError.bind(this)),
      )
      .subscribe({
        next: appointments => this.updateState({appointments, loading: false}),
        error: error => this.updateState({error: error, loading: false}),
      })
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<ResponseGlobalTyped<Customer[]>>('/customers').pipe(
      map(res => res.data),
      catchError(this.handleError.bind(this))
    )
  }

  getAllAppointments(): void {
    this.updateState({loading: true});
    this.http.get<ResponseGlobalTyped<Appointment[]>>(`${this.path}/all`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError.bind(this)),
      )
      .subscribe({
        next: appointments => this.updateState({appointments, loading: false}),
        error: error => this.updateState({error: error, loading: false}),
      })
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    const formattedAppointment = {
      ...appointment,
      date: this.formatDate(appointment.date),
    }
    return this.http.post<ResponseGlobalTyped<Appointment>>(this.path, formattedAppointment)
      .pipe(
        map(response => response.data),
        tap(newAppointment => {
          const currentAppointments = this.state.getValue().appointments;
          this.updateState({appointments: [...currentAppointments, newAppointment], loading: false});
          SweetAlert.success('Cita creada', 'La cita ha sido creada correctamente');
        }),
        catchError(this.handleError.bind(this)),
      )
  }

  updateAppointment(id: number, appointment: UpdateAppointment): Observable<Appointment> {
    const formattedAppointment = {
      ...appointment,
      date: appointment.date ? this.formatDate(appointment.date) : undefined,
    }
    return this.http.put<ResponseGlobalTyped<Appointment>>(`${this.path}/${id}`, formattedAppointment)
      .pipe(
        map(response => response.data),
        tap(updatedAppointment => {
          const currentAppointments = this.state.getValue().appointments;
          const updatedAppointments = currentAppointments.map(app => app.id === updatedAppointment.id ? updatedAppointment : app);
          this.updateState({appointments: updatedAppointments, loading: false});
          SweetAlert.success('Cita actualizada', 'La cita ha sido actualizada correctamente');
        }),
        catchError(this.handleError.bind(this)),
      );
  }

  cancelAppointment(id: number): Observable<void> {
    return this.http.put<ResponseGlobalTyped<Appointment>>(`${this.path}/cancel/${id}`, {})
    .pipe(
      map(response => response.data),
      tap(canceledAppointment => {
        const currentAppointments = this.state.getValue().appointments;
        const updatedAppointments = currentAppointments.map(app => app.id === canceledAppointment.id ? canceledAppointment : app);
        this.updateState({appointments: updatedAppointments, loading: false});
        SweetAlert.success('Cita cancelada', 'La cita ha sido cancelada correctamente');
      }
      ),
      catchError(this.handleError.bind(this)),
      map(() => {})
    )
    
  }
}
