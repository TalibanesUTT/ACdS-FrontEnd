import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert } from '../../shared/SweetAlert';
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sideBar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatFormField, MatInputModule, MatLabel, MatButtonModule, RouterLink, ReactiveFormsModule, MatExpansionModule],
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class sideBarComponent {
  @Input() sectionText: string = '';
  @Output() editSectionText = new EventEmitter<string>();
  title = 'acds-frontend';
  urlSidebar = '';
  role: string = '';
  readonly panelOpenState = signal(false);

  constructor(private router: Router, private profileService: ProfileService, private cdr: ChangeDetectorRef) {
    this.initializeComponent();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.urlSidebar = this.router.url;
        this.cdr.detectChanges(); // Fuerza la detección de cambios
      }
    });
  }

  initializeComponent() {
    this.getDataUser();
    this.urlSidebar = this.router.url;
  }

  getDataUser() {
    this.profileService.getProfile().subscribe(
      (data) => {
        this.role = this.translateRole(data.role);
        localStorage.setItem('user', JSON.stringify(data));
      },
      (error) => {}
    );
  }

  getRoute(text: string) {
    this.urlSidebar = this.router.url;
    this.sectionTextChange(text);
  }

  translateRole(role: string): string {
    const roleTranslations: { [key: string]: string } = {
      root: 'Administrador',
      admin: 'Administrativo',
      mechanic: 'Mecánico',
      customer: 'Cliente',
    };
    return roleTranslations[role] || role;
  }

  sectionTextChange(text: string) {
    this.editSectionText.emit(text);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
