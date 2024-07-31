import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
//components
import { AppComponent } from './app.component';
import { LoginComponent } from './sections/auth/login/login.component';
import { registerComponent } from './sections/auth/register/register.component';
import { HomeComponent } from './sections/panel/home/home.component';
import { sideBarComponent } from './components/sidebar/sideBar.component';
import { headerComponent } from './components/header/header.component';
import { profileComponent } from './sections/panel/profile/profile.component';
import { formEditUserComponent } from './components/forms/formEditUser/formEditUser.component';
import { formEditPasswordUserComponent } from './components/forms/formEditPasswordUser/formEditPasswordUser.component';
import { UsersTableComponent } from './sections/panel/users/users-table/users-table.component';
import { reactiveCountComponent } from './sections/auth/reactiveCount/reactiveCount.component';
import { secondFactorComponent } from './sections/auth/secondFactor/secondFactor.component';
//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

@NgModule({
  imports: [
    AppComponent,
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //components
    LoginComponent,
    registerComponent,
    HomeComponent,
    sideBarComponent,
    headerComponent,
    profileComponent,
    UsersTableComponent,
    formEditUserComponent,
    formEditPasswordUserComponent,
    secondFactorComponent,
    reactiveCountComponent,
    //Material
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ],
  exports: [
    headerComponent,
    sideBarComponent,
    formEditUserComponent,
    formEditPasswordUserComponent,
    UsersTableComponent,
  ],
  declarations: [],
  bootstrap: [],
  providers: [provideHttpClient()],
})
export class AppModule {}
