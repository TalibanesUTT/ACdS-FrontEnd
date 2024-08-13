import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { startWith, map } from 'rxjs/operators';
import { VehiclesService } from '../../../../../services/vehicles.service';
import { MatPaginatorIntlEspañol } from '../../../../../shared/MatPaginatorIntl';
import { RouterOutlet } from '@angular/router';
import { CarBrandsService } from '../../../../../services/carBrands.service';
import { UsersService } from '../../../../../services/users.service';
import { ProfileService } from '../../../../../services/profile.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { SweetAlert } from '../../../../../shared/SweetAlert';

@Component({
  selector: 'app-table-Vehicles',
  styleUrls: ['tableVehicles.component.css'],
  templateUrl: 'tableVehicles.component.html',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormField,
    FormsModule,
    NgIf,
    NgFor,
    MatSlideToggle,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatLabel,
    MatInputModule,
    MatSelectModule,
    tableVehiclesComponent,
    RouterOutlet,
    CommonModule,
    JsonPipe,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
})
export class tableVehiclesComponent implements AfterViewInit {
  @Input() showTable!: boolean;
  @Output() showTableChange = new EventEmitter<boolean>();
  @Input() dataVehicle: any;
  @Output() dataVehicleChange = new EventEmitter<any>();
  form: FormGroup;
  displayedColumns: string[] = ['brand', 'model', 'year', 'color', 'plates'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  owners: any;
  brands: any;
  token = localStorage.getItem('token');
  userData: any = {};

  constructor(
    private vehicleService: VehiclesService,
    private fb: FormBuilder,
    private carBrandsService: CarBrandsService,
    private usersService: UsersService,
    private profileService: ProfileService
  ) {
    this.getProfile();
    this.getBrand();
    this.getOwner();
    this.form = this.newFormControls();
    this.setupFilter();
  }
  getProfile() {
    this.profileService.getProfile().subscribe(
      (res) => {
        this.userData = res;
        if (this.userData?.role !== 'customer') {
          this.displayedColumns.push('actions');

          const vehicleIndex = this.displayedColumns.indexOf('plates');
          if (vehicleIndex !== -1) {
            this.displayedColumns.splice(vehicleIndex + 1, 0, 'owner');
          }
          this.getAllVehicles();
          return;
        }
        this.vehicleService.getVehicleByOwner(this.userData.id).subscribe(
          (res) => {
            this.dataSource.data = res.data;
          },
          (err) => {
            return 'No se encontró el vehículo';
          }
        );
      },
      (err) => {
        return 'No se encontró el usuario';
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getAllVehicles() {
    this.vehicleService.getAllVehicles().subscribe(
      (res) => {
        this.dataSource.data = res.data;
      },
      (err) => {
        // SweetAlert.error('Error', err.error.error.message);
      }
    );
  }
  newFormControls(): FormGroup {
    return this.fb.group({
      myControl: [''],
      filter: ['all'],
      brand: ['all'],
      owner: ['all'],
    });
  }

  setupFilter() {
    this.form.valueChanges
      .pipe(
        startWith({ myControl: '', filter: 'all', brand: 'all', owner: 'all' }),
        map((value) => this.filterData(value))
      )
      .subscribe();
  }

  filterData(value: any) {
    const filterValue = value.myControl ? value.myControl.trim().toLowerCase() : '';
    const selectedFilter = value.filter;
    const selectedBrand = value.brand !== 'all' ? value.brand : '';
    const selectedOwner = value.owner !== 'all' ? value.owner : '';

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const searchValue = searchTerms.myControl.toLowerCase();
      const brandMatch = searchTerms.brand ? data.model.brand === searchTerms.brand : true;
      const ownerMatch = searchTerms.owner ? data.owner === searchTerms.owner : true;

      switch (searchTerms.filter) {
        case 'brand':
          return brandMatch && data.model.brand.toLowerCase().includes(searchValue);
        case 'year':
          return brandMatch && ownerMatch && data.year.toString().includes(searchValue);
        case 'color':
          return brandMatch && ownerMatch && data.color.toLowerCase().includes(searchValue);
        case 'plates':
          return brandMatch && ownerMatch && data.plates.toLowerCase().includes(searchValue);
        default:
          return brandMatch && ownerMatch;
      }
    };

    this.dataSource.filter = JSON.stringify({
      myControl: filterValue,
      filter: selectedFilter,
      brand: selectedBrand,
      owner: selectedOwner,
    });
  }

  resetFilters() {
    this.form.reset({
      myControl: '',
      filter: 'all',
      brand: 'all',
      owner: 'all',
    });

    this.dataSource.filter = JSON.stringify({
      myControl: '',
      filter: 'all',
      brand: 'all',
      owner: 'all',
    });

    this.setupFilter();
  }

  // Aquí puedes definir un método para cambiar el valor de showTable si es necesario
  toggleShowTable(action: string, data?: any) {
    if (this.dataVehicle === undefined) {
      this.dataVehicle = {};
    }
    if (data !== undefined) {
      this.dataVehicle = data;
      this.dataVehicle.ownerId = data.owner;
      this.dataVehicle.brandId = data.model.brand;
      this.dataVehicle.model = data.model.model;
    }
    this.dataVehicle.action = action;
    this.dataVehicleChange.emit(this.dataVehicle); // Emitir el nuevo valor
    this.showTable = !this.showTable;
    this.showTableChange.emit(this.showTable); // Emitir el nuevo valor
  }

  getBrand() {
    this.carBrandsService.getCardBrands().subscribe(
      (res) => {
        this.brands = res.data;
      },
      (err) => {
        return 'No se encontró la marca';
      }
    );
  }
  getOwner() {
    this.usersService.getAllUsers().subscribe(
      (res) => {
        this.owners = res.data;
      },
      (err) => {
        return 'No se encontró el propietario';
      }
    );
  }
}
