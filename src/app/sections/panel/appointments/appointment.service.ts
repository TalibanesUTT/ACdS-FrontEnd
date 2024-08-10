import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {ResponseGlobalTyped} from "../../../interfaces/responseGlobal";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

export interface Appointment {
  id: number;
  date: string;
  time: string;
  reason: string;
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
    this.snackBar.open(errorMessage, 'Cerrar', this.snackBarContig);
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


  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<ResponseGlobalTyped<Appointment>>(this.path, appointment)
      .pipe(
        map(response => response.data),
        tap(newAppointment => {
          const currentAppointments = this.state.getValue().appointments;
          this.updateState({appointments: [...currentAppointments, newAppointment], loading: false});
        }),
        catchError(this.handleError.bind(this)),
      )
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<ResponseGlobalTyped<Appointment>>(`${this.path}/${appointment.id}`, appointment)
      .pipe(
        map(response => response.data),
        tap(updatedAppointment => {
          const currentAppointments = this.state.getValue().appointments;
          const updatedAppointments = currentAppointments.map(app => app.id === updatedAppointment.id ? updatedAppointment : app);
          this.updateState({appointments: updatedAppointments, loading: false});
        }),
        catchError(this.handleError.bind(this)),
      );
  }
}
