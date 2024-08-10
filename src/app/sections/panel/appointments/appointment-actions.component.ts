import {Component, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {Appointment} from './appointment.service';
import {ActionEnum, UserRoleService} from './user-role.service';
import {MatTooltip} from "@angular/material/tooltip";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu"; // You'll need to create this service

@Component({
  selector: 'app-appointment-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, MatTooltip, MatMenuTrigger, MatMenu, MatMenuItem],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Actions">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="onView()">
        <mat-icon>visibility</mat-icon>
        <span>Ver detalle</span>
      </button>
      <button mat-menu-item (click)="onEdit()" *ngIf="canEdit">
        <mat-icon>edit</mat-icon>
        <span>Edit</span>
      </button>
      <button mat-menu-item (click)="onDelete()" *ngIf="canDelete">
        <mat-icon>delete</mat-icon>
        <span>Delete</span>
      </button>
    </mat-menu>

  `,
})
export class AppointmentActionsComponent {
  @Input() appointment!: Appointment;

  constructor(private userRoleService: UserRoleService) {
  }

  get canEdit(): boolean {
    return this.userRoleService.hasPermission(ActionEnum.UPDATE);
  }

  get canDelete(): boolean {
    return this.userRoleService.hasPermission(ActionEnum.DELETE);
  }

  onView(): void {
    console.log('View appointment', this.appointment);
    // Implement view logic
  }

  onEdit(): void {
    console.log('Edit appointment', this.appointment);
    // Implement edit logic
  }

  onDelete(): void {
    console.log('Delete appointment', this.appointment);
    // Implement delete logic
  }
}
