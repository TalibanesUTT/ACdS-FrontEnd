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
import { formEditUserComponent } from '../../../components/forms/formEditUser/formEditUser.component';
import { formEditPasswordUserComponent } from '../../../components/forms/formEditPasswordUser/formEditPasswordUser.component';
import { SweetAlert } from '../../../shared/SweetAlert';
import { ProfileService } from '../../../services/profile.service';

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
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class profileComponent {
  editProfile: boolean = false;
  PasswordSwitch: boolean = true;
  id: number = 1;
  userData: any = {
    id: 1,
    name: 'Riley',
    lastName: 'Doe',
    email: 'riley.doe@example.com',
    phoneNumber: '123-456-7890',
    role: 'Admin',
  };

  constructor(private profileService: ProfileService) {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe((res) => {
      console.log(res);
      this.userData = res;
      this.id = res.id;
      this.onPhoneFormat(this.userData.phoneNumber);
    });
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
    if (this.editProfile) {
      this.userData.id = this.id;
      SweetAlert.success('Profile Updated', 'Your profile has been updated');
    }
    this.editProfile = !this.editProfile;
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
