import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SweetAlert } from '../../shared/SweetAlert';

@Component({
  selector: 'app-sideBar',
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
  ],
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class sideBarComponent {
  title = 'acds-frontend';
  urlSidebar = '';
  role: string = '';

  constructor(private router: Router, private profileService: ProfileService) {
    this.getDataUser();
    this.getRoute();
  }
  getDataUser() {
    this.profileService.getProfile().subscribe(
      (data) => {
        this.role = data.role;
        // console.log('side', data);
        localStorage.setItem('user', JSON.stringify(data));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getRoute() {
    //obtener ruta actual
    this.urlSidebar = this.router.url;
    console.log(this.urlSidebar);
  }
}
