import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login',
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
  templateUrl: './landingPage.component.html',
  styleUrl: './landingPage.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LandingPageComponent {
  title = 'acds-frontend';
  cards = [
    {
      title: 'Afinación',
      img: 'assets/img/Afinacion.svg',
      description: 'Afinación de motores a gasolina y diesel',
    },
    {
      title: 'Bomba de agua',
      img: 'assets/img/BombaAgua.svg',
      description: 'Cambio de bomba de agua',
    },
    {
      title: 'Clutch',
      img: 'assets/img/Clutch.svg',
      description: 'Cambio de clutch',
    },
    {
      title: 'Dirección hidráulica',
      img: 'assets/img/DireccionHidraulica.svg',
      description: 'Reparación de dirección hidráulica',
    },
    {
      title: 'Frenos',
      img: 'assets/img/Frenos.svg',
      description: 'Reparación de frenos',
    },
    {
      title: 'Suspensión',
      img: 'assets/img/Suspension.svg',
      description: 'Reparación de suspensión',
    },
  ];
  constructor(private router: Router) {}
}
