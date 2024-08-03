import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehiclesService } from '../../../../services/vehicles.service';
import { UsersService } from '../../../../services/users.service';
import { CarBrandsService } from '../../../../services/carBrands.service';
import { SweetAlert } from '../../../../shared/SweetAlert';

@Component({
  selector: 'app-vehiclesForm',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './vehiclesForm.component.html',
  styleUrls: ['./vehiclesForm.component.css'],
})
export class vehiclesFormComponent {
  isDisabled: boolean = false;
  title = 'acds-frontend';
  form: FormGroup;
  textButton = '';
  updateURL = '';
  action = '';
  OWNERS: any[] = [];
  CARBRANDS: any[] = [];
  filteredOwners$: Observable<any[]> | undefined;
  filteredModels$: Observable<any[]> | undefined;
  readonly dialogRef = inject(MatDialogRef<vehiclesFormComponent>);
  data = inject(MAT_DIALOG_DATA);
  colorRed = [
    { value: 'Rojo', color: 'Rojo' },
    { value: 'Azul', color: 'Azul' },
    { value: 'Verde', color: 'Verde' },
    { value: 'Amarillo', color: 'Amarillo' },
    { value: 'Blanco', color: 'Blanco' },
    { value: 'Negro', color: 'Negro' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private vehicleService: VehiclesService,
    private usersService: UsersService,
    private carBrandsService: CarBrandsService
  ) {
    this.action = this.data.action;
    this.textButton = this.action === 'edit' ? 'Editar' : 'Agregar';
    this.updateURL = this.data.item.updateURL;
    console.log(this.data);
    // Inicializa el formulario con el propietario preseleccionado si está editando
    let owner = this.data.item.owner;
    if (typeof owner === 'string') {
      const [name, lastName] = owner.split(' '); // Ajustar según la estructura
      owner = { name, lastName };
    }

    this.form = this.formBuilder.group({
      owner: [this.action === 'edit' ? owner : '', Validators.required],
      model: [this.action === 'edit' ? this.data.item.model : '', Validators.required],
      color: [this.action === 'edit' ? this.data.item.color : '', Validators.required],
      plates: [this.action === 'edit' ? this.data.item.plates : '', Validators.required],
      serialNumber: [this.action === 'edit' ? this.data.item.serialNumber : '', Validators.required],
      year: [this.action === 'edit' ? this.data.item.year : '', Validators.required],
    });

    this.getOwners();
    this.getCarBrand();
  }
  // Get all owners
  getOwners() {
    this.usersService.getAllUsers().subscribe(
      (res) => {
        this.OWNERS = res.data;
        this.filteredOwners$ = this.form.get('owner')!.valueChanges.pipe(
          startWith(this.data.action === 'edit' ? this.data.item.owner : ''),
          map((value) => (typeof value === 'string' ? value : value?.name)),
          map((name) => (name ? this.filterOwners(name) : this.OWNERS.slice()))
        );
      },
      (err) => {
        SweetAlert.error('Error', err.error.error.message);
      }
    );
  }
  displayOwnerName(owner: any): string {
    if (!owner) return '';
    if (owner.name && owner.lastName) {
      return `${owner.name} ${owner.lastName}`;
    }
    // Suponiendo que el objeto original tiene un campo `fullName`
    if (owner.fullName) {
      return owner.fullName;
    }
    // Otra opción podría ser simplemente retornar un string representativo
    return owner.toString();
  }

  private filterOwners(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.OWNERS.filter((owner) => owner.name.toLowerCase().includes(filterValue));
  }
  // Get all car brands
  getCarBrand() {
    this.carBrandsService.getCardBrands().subscribe(
      (res) => {
        console.log('brands', res);
        this.CARBRANDS = res.data;
        this.filteredModels$ = this.form.get('model')!.valueChanges.pipe(
          startWith(this.data.action === 'edit' ? this.data.item.model : ''),
          map((value) => (typeof value === 'string' ? value : value?.name)),
          map((name) => (name ? this.filterModels(name) : this.CARBRANDS.slice()))
        );
      },
      (err) => {
        SweetAlert.error('Error', err.error.error.message);
      }
    );
  }
  displayModelName(model: any): string {
    if (!model) return '';
    if (model.name) {
      return model.name;
    }
    return model.toString();
  }
  private filterModels(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.CARBRANDS.filter((model) => model.name.toLowerCase().includes(filterValue));
  }
  submit() {
    console.log(this.data);
    // Aquí puedes manejar la lógica para el submit del formulario
    if (this.data.action === 'edit') {
      delete this.form.value.owner;
      this.vehicleService.putVehicle(this.form.value, this.data.item.id).subscribe(
        (res) => {
          SweetAlert.success('Éxito', res.message);
          this.closeDialog();
        },
        (err) => {
          SweetAlert.error('Error', err.error.error.message);
        }
      );
      return;
    }
    this.vehicleService.postVehicle(this.form.value).subscribe(
      (res) => {
        SweetAlert.success('Éxito', res.message);
        this.closeDialog();
      },
      (err) => {
        SweetAlert.error('Error', err.error.error.message);
      }
    );
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
