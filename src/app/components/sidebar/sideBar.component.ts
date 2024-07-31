import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
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
  @Input() sectionText: string = '';
  @Output() editSectionText = new EventEmitter<string>();
  title = 'acds-frontend';
  urlSidebar = '';
  role: string = '';

  constructor(private router: Router, private profileService: ProfileService) {
    this.getDataUser();
    this.getRoute('dashboard');
  }

  getDataUser() {
    this.profileService.getProfile().subscribe(
      (data) => {
        console.log('side', data);
        this.role = this.translateRole(data.role);
        localStorage.setItem('user', JSON.stringify(data));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getRoute(text: string) {
    //obtener ruta actual
    this.urlSidebar = this.router.url;
    console.log(this.urlSidebar);
    this.sectionTextChange('Sección de ' + text);
  }

  translateRole(role: string): string {
    const roleTranslations: { [key: string]: string } = {
      root: 'Administrador',
      admin: 'Administrativo',
      mechanic: 'Mecánico',
      customer: 'Cliente',
      // Agrega más roles y sus traducciones según sea necesario
    };
    return roleTranslations[role] || role;
  }

  sectionTextChange(text: string) {
    this.editSectionText.emit(text);
  }
}
