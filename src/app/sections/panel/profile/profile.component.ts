import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { formEditUserComponent } from '../../../components/forms/formEditUser/formEditUser.component';
import { formEditPasswordUserComponent } from '../../../components/forms/formEditPasswordUser/formEditPasswordUser.component';
import { SweetAlert } from '../../../shared/SweetAlert';
import { ProfileService } from '../../../services/profile.service';
import { IUser } from '../../../interfaces/Users';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
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
    formEditUserComponent,
    formEditPasswordUserComponent,
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class profileComponent {
  temporyDataUSer: IUser = {};
  editProfile: boolean = false;
  PasswordSwitch: boolean = true;
  id: number = 0;
  userData: any = {
    name: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phoneNumber: '123-456-7890',
    role: 'Admin',
  };

  constructor(private profileService: ProfileService, private authService: AuthService, private router: Router) {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe((res) => {
      console.log(res);
      this.userData = res;
      this.userData = { ...res, role: this.mapRoleEnglish(res.role) };
      this.id = res.id;
      this.temporyDataUSer = res;
      this.onPhoneFormat(this.userData.phoneNumber);
    });
  }
  /**
   * Funcion para mapear el rol
   * @param role
   * @returns
   */
  mapRoleEnglish(role: string): string {
    const roleMap: { [key: string]: string } = {
      customer: 'Cliente',
      admin: 'Administrativo',
      root: 'Administrador',
      mechanic: 'Mecánico',
    };
    return roleMap[role] || role;
  }
  /**
   * Funcion para mapear el rol
   * @param role
   * @returns
   */
  mapRoleSpanish(role: string): string {
    const roleMap: { [key: string]: string } = {
      Cliente: 'customer',
      Administrativo: 'admin',
      Administrador: 'root',
      Mecánico: 'mechanic',
    };
    return roleMap[role];
  }
  onPhoneFormat(phoneNumber: string): void {
    let input = phoneNumber.replace(/\D/g, '');
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    input = input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    this.userData.phoneNumber = input;
  }
  changeEditProfile() {
    let modifyPhone = false;
    let modifyEmail = false;
    this.userData.phoneNumber = this.userData.phoneNumber.replace('-', '');
    this.userData.phoneNumber = this.userData.phoneNumber.replace('-', '');
    if (this.editProfile) {
      this.editProfile = !this.editProfile;
      console.log('datos actualizado', this.userData);
      console.log('datos temporales', this.temporyDataUSer);
      if (this.userData.phoneNumber !== this.temporyDataUSer.phoneNumber) {
        modifyPhone = true;
      }
      if (this.userData.email !== this.temporyDataUSer.email) {
        modifyEmail = true;
      }
      if (modifyPhone || modifyEmail) {
        Swal.fire({
          title: 'Aviso',
          text: 'Estás a punto de modificar tus datos. Por tu seguridad, esto desactivara momentáneamente tu cuenta hasta que verifiques tus nuevos datos. ¿Deseas continuar?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendData(modifyPhone, modifyEmail);
          }
        });
      } else {
        this.sendData();
      }
    }
    this.editProfile = !this.editProfile;
  }
  sendData(modifyPhone?: boolean, modifyEmail?: boolean) {
    let onlyEmailModify = false;
    delete this.userData.emailConfirmed;
    delete this.userData.phoneConfirmed;
    delete this.userData.id;
    this.userData.role = this.mapRoleSpanish(this.userData.role);
    this.profileService.putProfile(this.userData, this.id).subscribe(
      (res) => {
        localStorage.setItem('user', JSON.stringify(this.userData));
        if (modifyPhone && modifyEmail) {
          localStorage.setItem('dataModify', 'both');
          localStorage.setItem('url', res.url);
        } else if (modifyEmail) {
          localStorage.setItem('dataModify', 'email');
          localStorage.setItem('url', res.url);
          onlyEmailModify = true;
        } else if (modifyPhone) {
          localStorage.setItem('dataModify', 'phone');
          localStorage.setItem('url', res.url);
        }
        console.log('respuesta', res);
        SweetAlert.success('success', res.message);
        this.editProfile = !this.editProfile;
        this.logout(onlyEmailModify);
      },
      (err) => {
        if (err.error.error.message) {
          SweetAlert.error('errors', err.error.error.message);
        } else {
          SweetAlert.error('error', 'Vuelve a intentarlo');
        }
      }
    );
  }
  logout(onlyEmailModify?: boolean) {
    this.authService.logout().subscribe(
      (res) => {
        console.log(res);
        if (onlyEmailModify) {
          this.router.navigate(['/login']);
          return;
        }
        this.router.navigate(['/reactiveCount']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editProfileChange(event: boolean) {
    this.editProfile = event;
  }

  PasswordSwitchChange(event: boolean) {
    this.PasswordSwitch = event;
  }

  userDataChange(event: any) {
    this.userData = event;
  }
}
