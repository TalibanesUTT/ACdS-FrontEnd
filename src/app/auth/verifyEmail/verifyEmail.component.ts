import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

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
  ],

  templateUrl: './verifyEmail.component.html',
  styleUrl: './verifyEmail.component.css',
})
export class verifyEmailComponent {
  title = 'acds-frontend';

  constructor() {}

  ngOnInit() {}

  //
}
