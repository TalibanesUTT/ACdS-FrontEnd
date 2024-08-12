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
    console.log(this.dataVehicle);

    this.getAllOwners();
    this.getAllBrands();
    this.formVehicles = this.newFormControls();
    this.filteredOwners$ = this.formVehicles.get('ownerId')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterOwners(value))
    );
    this.filteredBrands$ = this.formVehicles.get('brandId')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBrands(value))
    );
    this.filteredModels$ = this.formVehicles.get('model')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterModels(value))
    );
  }
  ngOnInit() {
    if (this.dataVehicle.action === 'edit') {
      this.textCondition = 'Editar';
      this.disabledSendButton = false;
      setTimeout(() => {
        this.assignFormValues();
      }, 500); // Espera medio segundo para asegurar que los datos estén cargados
    } else {
      this.textCondition = 'Agregar';
    }
  }

  assignFormValues() {
    this.formVehicles.patchValue({
      id: this.dataVehicle.id,
      serialNumber: this.dataVehicle.serialNumber,
      year: this.dataVehicle.year,
      color: this.dataVehicle.color,
      plates: this.dataVehicle.plates,
    });

    const owner = this.owners.find((o) => o.name + ' ' + o.lastName === this.dataVehicle.owner);
    if (owner) {
      this.formVehicles.patchValue({ ownerId: owner });
    }

    const brand = this.brands.find((b) => b.name === this.dataVehicle.brandId);
    if (brand) {
      this.formVehicles.patchValue({ brandId: brand });
      this.onBrandSelected(brand);
    }
    console.log('formularios', this.formVehicles.value);
  }

  newFormControls(): FormGroup {
    return this.fb.group({
      id: [''],
      ownerId: ['', [Validators.required]],
      serialNumber: ['', [Validators.maxLength(20), Validators.minLength(17), CustomValidators.onlyNumbers]],
      model: ['', [Validators.required]],
      brandId: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      color: ['', [Validators.required, CustomValidators.namePattern]],
      plates: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(6)]],
    });
  }
  //*Obtener todos los propietarios
  getAllOwners() {
    this.usersService.getAllUsers().subscribe((res: any) => {
      this.owners = res.data;
      console.log(this.owners);
    });
  }
  private _filterOwners(value: any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.owners.filter((owner) => `${owner.name} ${owner.lastName}`.toLowerCase().includes(filterValue));
  }

  displayOwner = (owner: any): string => {
    this.setOwnerMaxLength(owner);
    return owner ? `${owner.name} ${owner.lastName}` : '';
  };

  //*Obtener todas las marcas
  onBrandSelected(brand: any): void {
    this.setBrandMaxLength(brand);
    this.getAllModels(brand.id);
  }
  getAllBrands() {
    this.carBrandsService.getCardBrands().subscribe((res: any) => {
      this.brands = res.data;
      console.log(this.brands);
    });
  }
  private _filterBrands(value: any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.brands.filter((brand) => brand.name.toLowerCase().includes(filterValue));
  }
  displayBrand = (brand: any): string => {
    this.setBrandMaxLength(brand);
    return brand ? brand.name : '';
  };
  //*Obtener todos los modelos
  getAllModels(brandId: any) {
    this.vehiclesService.getModelByBrand(brandId).subscribe((res: any) => {
      this.models = res.data;
      console.log(this.models);

      if (this.dataVehicle.action === 'edit') {
        const model = this.models.find((m) => m.model.toLowerCase() === this.dataVehicle.model.toLowerCase());
        if (model) {
          this.formVehicles.patchValue({ model: model });
          this.formVehicles.value.model = model;
        } else {
          console.error(`Modelo ${this.dataVehicle.model} no encontrado en la lista de modelos`);
        }
      }
    });
  }
  private _filterModels(value: any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.models.filter((model) => model.model.toLowerCase().includes(filterValue));
  }
  saveVehicle() {
    // Asegúrate de que brandId y ownerId sean números y que el modelo sea una cadena
    const formValue = {
      ...this.formVehicles.value,
      brandId: this.formVehicles.value.brandId?.id || this.formVehicles.value.brandId.id,
      ownerId: parseInt(this.formVehicles.value.ownerId.id),
      model: typeof this.formVehicles.value.model === 'object' ? this.formVehicles.value.model.model : this.formVehicles.value.model,
      year: parseInt(this.formVehicles.value.year),
    };

    if (this.dataVehicle.action === 'add') {
      delete formValue.id;
      this.vehiclesService.postVehicle(formValue).subscribe((res: any) => {
        SweetAlert.success('Success', res.message);
        this.toggleShowTable();
      });
      return;
    }

    console.log('edit');
    const ID = this.dataVehicle.id;
    delete formValue.id;
    console.log('formValueEdit', formValue);
    this.vehiclesService.putVehicle(formValue, ID).subscribe((res: any) => {
      SweetAlert.success('Success', res.message);
      this.toggleShowTable();
    });
  }

  toggleShowTable() {
    this.showTable = !this.showTable;
    this.showTableChange.emit(this.showTable); // Emitir el nuevo valor
  }
  displayModel(model: any): string {
    return model ? model.model : '';
  }
  disableSendButton($event: any) {
    if (this.formVehicles.invalid) {
      this.disabledSendButton = true;
    } else {
      this.disabledSendButton = false;
    }
  }

  setOwnerMaxLength(owner: any) {
    if (owner) {
      this.maxlengthOwner = owner.name.length + owner.lastName.length + 1; // Espacio entre nombre y apellido
      this.formVehicles.get('ownerId')!.setValidators([Validators.required, Validators.maxLength(this.maxlengthOwner)]);
      this.formVehicles.get('ownerId')!.updateValueAndValidity();
    }
  }

  setBrandMaxLength(brand: any) {
    if (brand) {
      this.maxlengthBrand = brand.name.length;
      this.formVehicles.get('brandId')!.setValidators([Validators.required, Validators.maxLength(this.maxlengthBrand)]);
      this.formVehicles.get('brandId')!.updateValueAndValidity();
    }
  }
  getSerialNumberErrorMessage() {
    const control = this.formVehicles.get('serialNumber');

    if (control?.hasError('invalidNumber')) {
      return 'Solo se permiten números';
    } else if (control?.hasError('minlength')) {
      return 'Debe tener de mínimo 17 caracteres y máximo 20 caracteres';
    }

    return ''; // No mostrar nada si no hay errores
  }
}
