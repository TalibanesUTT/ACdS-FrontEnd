import {Component, EventEmitter, Input, Output} from '@angular/core';
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
      <button mat-menu-item (click)="triggerEdit()" *ngIf="canEdit">
        <mat-icon>edit</mat-icon>
        <span>Edit</span>
      </button>
      <button mat-menu-item (click)="triggerDelete()" *ngIf="canDelete">
        <mat-icon>delete</mat-icon>
        <span>Delete</span>
      </button>
    </mat-menu>

  `,
})
export class AppointmentActionsComponent {
  @Input() appointment!: Appointment;
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  constructor(private userRoleService: UserRoleService) {
  }

  get canEdit(): boolean {
    return this.userRoleService.hasPermission(ActionEnum.UPDATE);
  }

  get canDelete(): boolean{
    if (this.appointment.status === 'Pendiente') {
      return this.userRoleService.hasPermission(ActionEnum.DELETE);
    }
    return false
  }

  triggerEdit(): void {
    this.onEdit.emit();
  }

  triggerDelete(): void {
    this.onDelete.emit();
  }
}
