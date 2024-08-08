import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import { ResponseGlobalTyped } from "../../../interfaces/responseGlobal";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

export interface Appointment {
  id: number;
  date: string;
  time: string;
  reason: string;
}

@Injectable({ providedIn: 'root'})
export class AppointmentService {
    private readonly snackBarConfig: MatSnackBarConfig = {
        verticalPosition: 'top',
    }
    private readonly appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
    readonly appointments$ = this.appointmentsSubject.asObservable();

    private http = inject(HttpClient);
    private snack = inject(MatSnackBar);

    getUserAppointments(): void {
        this.http.get<ResponseGlobalTyped<Appointment[]>>('/appointments')
            .pipe(map(response => response.data)).subscribe({
                next: appointments => this.appointmentsSubject.next(appointments),
                error: error => this.handleAppointmentError(error)
            });
    }

    handleAppointmentError(error: any): void {
        const errorMessage = error.error.error.message;
        if (errorMessage) {
            this.snack.open(errorMessage, 'Cerrar', this.snackBarConfig);
            return;
        }
        this.snack.open('Hubo un error al procesar la solicitud', 'Cerrar', this.snackBarConfig);
    }


    getAllAppointments(): Observable<Appointment[]> {
        return this.http.get<ResponseGlobalTyped<Appointment[]>>('/appointments/all')
            .pipe(map(response => response.data));
    }

    getAppointmentDetails(appointment: Appointment): Observable<Appointment> {
        return this.http.get<ResponseGlobalTyped<Appointment>>(`/appointments/${appointment.id}`)
            .pipe(map(response => response.data));
    }
    
    createAppointment(appointment: Appointment): Observable<Appointment> {
        return this.http.post<ResponseGlobalTyped<Appointment>>('/appointments', appointment)
            .pipe(map(response => response.data));
    }
    
    updateAppointment(appointment: Appointment): Observable<Appointment> {
        return this.http.put<ResponseGlobalTyped<Appointment>>(`/appointments/${appointment.id}`, appointment)
            .pipe(map(response => response.data));
    }

    cancelAppointment(id: number): Observable<void> {
        return this.http.delete<void>(`/appointments/${id}`);
    }
}