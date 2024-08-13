import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ServiceOrdersService } from '../../../services/serviceOrders.service';
import { IOrderService, IService } from '../../../interfaces/orderService';
import { map, startWith } from 'rxjs/operators';
import { MatPaginatorIntlEspañol } from '../../../shared/MatPaginatorIntl';
import { DatePipe } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { RouterOutlet } from '@angular/router';
import { formOrderServiceComponent } from './forms/formOrderService/formEditOrderService.component';
import { tabOrderServiceComponent } from './tabOrdersService/tabOrderService.component';
import { formEditOrderServiceComponent } from './forms/formEditOrderService/formOrderService.component';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-orderService',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    DatePipe,
    NgIf,
    NgFor,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDateRangeInput,
    RouterOutlet,
    formOrderServiceComponent,
    tabOrderServiceComponent,
    formEditOrderServiceComponent,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
  templateUrl: './orderService.component.html',
  styleUrls: ['./orderService.component.css'],
})
export class orderServiceComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  formFilter: FormGroup;
  displayedColumns: string[] = ['createDate', 'actualStatus', 'vehicle', 'services', 'totalCost'];
  dataSource = new MatTableDataSource<IOrderService>();
  servicesData: IService[] = [];
  originalData: IOrderService[] = [];
  filterCost = false;
  menuOptions = 'table';
  itemOrderService!: IOrderService;
  UserData: any = {};
  token = localStorage.getItem('token');
  serviceOrdersStatuses = [
    { key: 'Recibido', value: 'Recibido' },
    { key: 'En revisión', value: 'En revisión' },
    { key: 'Emitido', value: 'Emitido' },
    { key: 'Aprobado', value: 'Aprobado' },
    { key: 'En proceso', value: 'En proceso' },
    { key: 'En chequeo', value: 'En chequeo' },
    { key: 'Completado', value: 'Completado' },
    { key: 'Listo para recoger', value: 'Listo para recoger' },
    { key: 'Entregado', value: 'Entregado' },
    { key: 'Finalizado', value: 'Finalizado' },
    { key: 'En espera', value: 'En espera' },
    { key: 'Cancelado', value: 'Cancelado' },
  ];

  constructor(private fb: FormBuilder, private serviceOrdersService: ServiceOrdersService, private profileService: ProfileService) {
    this.formFilter = this.newFormControls();
    this.setupFilter();
    this.getProfile();
    // this.getAllServiceOrders();
    this.getAllService();
  }
  getProfile() {
    this.profileService.getProfile().subscribe(
      (response) => {
        this.UserData = response;
        // Verifica si el rol no es 'customer'
        if (this.UserData.role !== 'customer') {
          // Agrega 'fileNumber' al inicio de displayedColumns
          this.displayedColumns.unshift('fileNumber');

          this.getAllServiceOrders();
          const vehicleIndex = this.displayedColumns.indexOf('vehicle');
          if (vehicleIndex !== -1) {
            this.displayedColumns.splice(vehicleIndex + 1, 0, 'client');
          }
          return;
        }
        this.serviceOrdersService.getAllServiceOrdersByUser(this.UserData.id).subscribe(
          (response) => {
            this.dataSource.data = response.data;
          },
          (error) => {}
        );
      },
      (error) => {}
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  // Getter para acceder al FormGroup de dateRange
  get dateRange(): FormGroup {
    return this.formFilter.get('dateRange') as FormGroup;
  }
  getAllServiceOrders() {
    this.serviceOrdersService.getAllServiceOrders().subscribe(
      (response) => {
        this.originalData = response.data;
        this.dataSource.data = this.originalData;
      },
      (error) => {}
    );
  }
  getAllService() {
    this.serviceOrdersService.getAllService().subscribe(
      (response) => {
        this.servicesData = response.data;
      },
      (error) => {}
    );
  }
  newFormControls() {
    return this.fb.group({
      myControl: [''],
      filter: ['all'],
      services: ['all'],
      totalCost: [''],
      filterCost: [false],
      serviceOrdersStatuses: ['all'],
      dateRange: this.fb.group({
        start: [null],
        end: [null],
      }), // Campo para el rango de fechas
    });
  }

  setupFilter() {
    this.formFilter.valueChanges
      .pipe(
        startWith(this.formFilter.value),
        map((value) => this.filterData(value))
      )
      .subscribe();
  }

  filterData(value: any) {
    const filterValue = value.myControl.trim().toLowerCase();
    const selectedFilter = value.filter;
    const selectedServiceId = value.services !== 'all' ? parseInt(value.services, 10) : null;
    const costFilterValue = value.totalCost ? parseFloat(value.totalCost) : null;
    const filterCost = value.filterCost;
    const selectedStatus = value.serviceOrdersStatuses !== 'all' ? value.serviceOrdersStatuses : null;

    // Convertir las fechas a objetos Date y normalizarlas
    const startDate = value.dateRange.start ? new Date(value.dateRange.start).setHours(0, 0, 0, 0) : null;
    const endDate = value.dateRange.end ? new Date(value.dateRange.end).setHours(23, 59, 59, 999) : null;

    this.dataSource.filterPredicate = (data: IOrderService, filter: string) => {
      // Convertir la fecha de creación del servicio a un objeto Date y normalizarla
      const createDate = new Date(data.createDate).setHours(0, 0, 0, 0);

      // Verificar si el servicio está dentro del rango de fechas
      const dateMatch =
        startDate && endDate
          ? createDate >= startDate && createDate <= endDate
          : startDate
          ? createDate >= startDate
          : endDate
          ? createDate <= endDate
          : true;

      if (!dateMatch) return false; // Si no coincide con la fecha, filtrar

      // Lógica para el filtro de servicio
      const serviceMatch = selectedServiceId
        ? data.services.some((service) => (selectedServiceId === 7 ? service.id === 7 : service.id === selectedServiceId))
        : true;

      const costMatch =
        costFilterValue !== null
          ? filterCost
            ? (data.detail?.totalCost ?? 0) <= costFilterValue
            : (data.detail?.totalCost ?? 0) >= costFilterValue
          : true;

      const statusMatch = selectedStatus ? data.actualStatus === selectedStatus : true;

      // Aplicar otros filtros seleccionados
      switch (selectedFilter) {
        case 'fileNumber':
          return serviceMatch && costMatch && statusMatch && data.fileNumber.toLowerCase().includes(filterValue);
        case 'vehicle':
          return (
            serviceMatch &&
            costMatch &&
            statusMatch &&
            (data.vehicle.model.brand.toLowerCase().includes(filterValue) ||
              data.vehicle.model.model.toLowerCase().includes(filterValue) ||
              data.vehicle.year.toString().includes(filterValue) ||
              data.vehicle.color.toLowerCase().includes(filterValue))
          );
        case 'client':
          return serviceMatch && costMatch && statusMatch && data.vehicle.owner.toLowerCase().includes(filterValue);
        default:
          return (
            serviceMatch &&
            costMatch &&
            statusMatch &&
            (data.fileNumber.toLowerCase().includes(filterValue) ||
              data.vehicle.model.brand.toLowerCase().includes(filterValue) ||
              data.vehicle.model.model.toLowerCase().includes(filterValue) ||
              data.vehicle.year.toString().includes(filterValue) ||
              data.vehicle.color.toLowerCase().includes(filterValue) ||
              data.vehicle.owner.toLowerCase().includes(filterValue))
          );
      }
    };

    // Forzar el filtro para desencadenar el `filterPredicate`
    this.dataSource.filter = filterValue || selectedServiceId || costFilterValue || startDate || endDate || selectedStatus ? 'activate' : '';
  }

  toggleFilterCost() {
    this.filterCost = !this.filterCost;
    this.formFilter.patchValue({ filterCost: this.filterCost });
  }
  resetFilters() {
    this.formFilter.reset({
      myControl: '',
      filter: 'all',
      services: 'all',
      totalCost: '',
      filterCost: false,
      serviceOrdersStatuses: 'all',
    });

    if (this.UserData.role === 'customer') {
      // Si el rol es 'customer', cargar solo los datos correspondientes a este usuario
      this.serviceOrdersService.getAllServiceOrdersByUser(this.UserData.id).subscribe(
        (response) => {
          this.dataSource.data = response.data;
        },
        (error) => {
          // Manejo de errores si es necesario
        }
      );
    } else {
      // Si no es 'customer', cargar todos los datos
      this.dataSource.data = this.originalData;
    }

    if (this.UserData.role === 'customer') {
      // Si el rol es 'customer', cargar solo los datos correspondientes a este usuario
      this.serviceOrdersService.getAllServiceOrdersByUser(this.UserData.id).subscribe(
        (response) => {
          this.dataSource.data = response.data;
        },
        (error) => {
          // Manejo de errores si es necesario
        }
      );
    } else {
      // Si no es 'customer', cargar todos los datos
      this.dataSource.data = this.originalData;
    }
  }
  editMenuOption(action: string, item?: IOrderService) {
    this.itemOrderService = item!;
    this.menuOptions = action;
  }
  showForm(showForm: string) {
    this.menuOptions = showForm;
    this.getAllServiceOrders();
  }
  formatNumberWithCommas(value: number): string {
    if (value === null || value === undefined) return '-';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
