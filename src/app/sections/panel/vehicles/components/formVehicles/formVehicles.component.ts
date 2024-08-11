import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map, max } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { VehiclesService } from '../../../../../services/vehicles.service';
import { UsersService } from '../../../../../services/users.service';
import { CarBrandsService } from '../../../../../services/carBrands.service';
import { SimpleChanges } from '@angular/core';
import { SweetAlert } from '../../../../../shared/SweetAlert';
import { CustomValidators } from '../../../../../shared/validation';

@Component({
  selector: 'app-form-Vehicles',
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
  templateUrl: './formVehicles.component.html',
  styleUrls: ['./formVehicles.component.css'],
})
export class formVehiclesComponent {
  @Input() showTable!: boolean;
  @Output() showTableChange = new EventEmitter<boolean>();
  @Input() dataVehicle: any;
  @Output() dataVehicleChange = new EventEmitter<any>();
  formVehicles: FormGroup;
  textCondition = '';
  owners: any[] = [];
  filteredOwners$!: Observable<any[]>;
  brands: any[] = [];
  filteredBrands$!: Observable<any[]>;
  models: any[] = [];
  filteredModels$!: Observable<any[]>;
  modelActive = true;
  disabledSendButton = true;
  maxlengthOwner = 10;
  maxlengthBrand = 10;

  constructor(
    private fb: FormBuilder,
    private vehiclesService: VehiclesService,
    private usersService: UsersService,
    private carBrandsService: CarBrandsService
  ) {
    this.formVehicles = this.newFormControls();
    this.getOwners();
    this.getBrands();
    setTimeout(() => {
      if (this.textCondition === 'Editar') {
        this.getModels();
      }
    }, 500);
  }

  newFormControls(): FormGroup {
    return this.fb.group({
      id: [''],
      ownerId: ['', [Validators.required]],
      serialNumber: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(17), CustomValidators.onlyNumbers]],
      model: ['', [Validators.required]],
      brandId: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      color: ['', [Validators.required, CustomValidators.namePattern]],
      plates: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(6)]],
    });
  }
  getOwners(): void {
    this.usersService.getAllUsers().subscribe((data) => {
      this.owners = data.data;
      const owner = this.owners.find((owner) => owner.name + ' ' + owner.lastName === this.dataVehicle.ownerId);
      this.formVehicles.get('ownerId')?.setValue(owner);
      if (this.textCondition === 'Nuevo') {
        this.formVehicles.reset();
      }
      this.setupOwnerAutocomplete(); // Aquí se llama a la función para inicializar el autocompletado
    });
  }

  setupOwnerAutocomplete(): void {
    this.filteredOwners$ = this.formVehicles.get('ownerId')!.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : this.displayOwner(value))),
      map((name) => (name ? this._filterOwners(name) : this.owners.slice()))
    );
  }

  private _filterOwners(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.owners.filter((owner) => `${owner.name} ${owner.lastName}`.toLowerCase().includes(filterValue));
  }

  displayOwner(owner: any): string {
    if (owner) {
      const ownerFullName = `${owner.name} ${owner.lastName}`;
      this.maxlengthOwner = ownerFullName.length;
    }

    return owner ? `${owner.name} ${owner.lastName}` : '';
  }

  getBrands(): void {
    this.carBrandsService.getCardBrands().subscribe((data) => {
      this.brands = data.data;
      const brand = this.brands.find((brand) => brand.name === this.dataVehicle.brandId);
      this.formVehicles.get('brandId')?.setValue(brand);
      if (this.textCondition === 'Nuevo') {
        this.formVehicles.reset();
      }
      this.setupBrandAutocomplete(); // Aquí se llama a la función para inicializar el autocompletado
    });
  }

  setupBrandAutocomplete(): void {
    this.filteredBrands$ = this.formVehicles.get('brandId')!.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : this.displayBrand(value))),
      map((name) => (name ? this._filterBrands(name) : this.brands.slice()))
    );

    // Suscribirse a los cambios de valor de brandId para ejecutar getModels
    this.formVehicles.get('brandId')!.valueChanges.subscribe((brand) => {
      if (brand && typeof brand === 'object') {
        this.getModels();
      }
    });
  }

  private _filterBrands(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.brands.filter((brand) => `${brand.name}`.toLowerCase().includes(filterValue));
  }

  displayBrand(brand: any): string {
    if (brand) {
      const brandName = `${brand.name}`;
      this.maxlengthBrand = brandName.length;
    }
    return brand ? `${brand.name}` : '';
  }

  // Función para obtener los modelos de los vehículos
  getModels(): void {
    const selectedBrand = this.formVehicles.get('brandId')?.value;
    if (selectedBrand && selectedBrand.id) {
      this.vehiclesService.getModelByBrand(selectedBrand.id).subscribe(
        (data) => {
          if (data.data && data.data.length > 0) {
            this.models = data.data;
            this.setupModelAutocomplete(); // Inicializar el autocompletado de modelos
          } else {
            // Si no hay modelos, limpiar las opciones
            this.models = [];
            this.setupModelAutocomplete();
          }
        },
        (error) => {
          // En caso de error, limpiar las opciones
          this.models = [];
          this.setupModelAutocomplete();
        }
      );
    } else {
      // Si no hay una marca seleccionada, también limpiar las opciones
      this.models = [];
      this.setupModelAutocomplete();
    }
  }

  setupModelAutocomplete(): void {
    this.filteredModels$ = this.formVehicles.get('model')!.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : this.displayModel(value))),
      map((name) => (name ? this._filterModels(name) : this.models.slice()))
    );
  }

  private _filterModels(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.models.filter((model) => model.model && model.model.toLowerCase().includes(filterValue));
  }

  displayModel(model: any): string {
    if (typeof model === 'string') {
      return model; // Esto maneja el caso en el que `model` es solo un string.
    }
    return model ? `${model.model}` : '';
  }

  toggleShowTable() {
    this.showTable = !this.showTable;
    this.showTableChange.emit(this.showTable); // Emitir el nuevo valor
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataVehicle'] && this.dataVehicle) {
      if (this.dataVehicle.action === 'edit' || this.dataVehicle.action === 'detail') {
        this.textCondition = 'Editar';
        this.formVehicles.patchValue(this.dataVehicle);
        this.disabledSendButton = false;
        return;
      }
      this.textCondition = 'Nuevo';
    }
  }

  saveVehicle() {
    this.formVehicles.value.ownerId = parseInt(this.formVehicles.value.ownerId.id, 10);
    this.formVehicles.value.brandId = parseInt(this.formVehicles.value.brandId.id, 10);
    this.formVehicles.value.year = parseInt(this.formVehicles.value.year, 10);
    if (this.textCondition === 'Nuevo') {
      delete this.formVehicles.value.id;
      // this.formVehicles.value.model = this.formVehicles.value.model.model;
      this.vehiclesService.postVehicle(this.formVehicles.value).subscribe(
        (response) => {
          SweetAlert.success('Success', response.message);
          this.toggleShowTable();
        },
        (error) => {
          SweetAlert.error('Error', error.message);
        }
      );
    }
    if (this.textCondition === 'Editar') {
      const IDVEHICLE = this.dataVehicle.id;
      delete this.formVehicles.value.id;
      // this.formVehicles.value.model = this.formVehicles.value.model.model;
      this.vehiclesService.putVehicle(this.formVehicles.value, IDVEHICLE).subscribe(
        (response) => {
          SweetAlert.success('Success', response.message);
          this.toggleShowTable();
        },
        (error) => {
          SweetAlert.error('Error', error.message);
        }
      );
    }
  }

  disableSendButton($event: any) {
    if (this.formVehicles.valid) {
      this.disabledSendButton = false;
      return;
    }
    this.disabledSendButton = true;
  }
}
