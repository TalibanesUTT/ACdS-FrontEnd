import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert } from '../../shared/SweetAlert';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class headerComponent {
  @Input() sectionText: string = '';
  @Output() editSectionText = new EventEmitter<boolean>();
  title = 'acds-frontend';

  constructor(private router: Router, private authService: AuthService, private profileService: ProfileService) {}
  user: any;

  logout() {
    this.authService.logout().subscribe(
      (data) => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      (error) => {}
    );
  }
  getDataUser() {
    this.profileService.getProfile().subscribe(
      (data) => {
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
      },
      (error) => {}
    );
  }
}
