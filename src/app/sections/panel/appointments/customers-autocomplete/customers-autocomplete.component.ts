import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppointmentService, Customer} from "../appointment.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Observable, switchMap} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-customers-autocomplete',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    NgForOf,
    AsyncPipe,
    MatInput
  ],
  templateUrl: './customers-autocomplete.component.html',
  styleUrl: './customers-autocomplete.component.css'
})
export class CustomersAutocompleteComponent implements OnInit {
  @Output() customerSelected = new EventEmitter<Customer>();
  @Input() initialValue: Customer | undefined;

  customerCtrl = new FormControl('');
  filteredCustomers$ = new Observable<Customer[]>();

  constructor(private appointmentsService: AppointmentService) {
  }

  ngOnInit() {
    this.filteredCustomers$ = this.customerCtrl.valueChanges.pipe(
      startWith(''),
      switchMap(value =>
        this.appointmentsService.getCustomers().pipe(
          map(customers => this._filter(customers, value ?? ""))
        )
      )
    );
    this.customerSelected.emit(this.initialValue);
  }


  displayFn(customer: Customer): string {
    return customer && customer.name ? `${customer.name} ${customer.lastName}` : '';
  }


  private _filter(customers: Customer[], value: string | Customer): Customer[] {
    let filterValue = '';
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (value && typeof value === 'object') {
      filterValue = value.name.toLowerCase();
    }

    return customers.filter(customer =>
      customer.name.toLowerCase().includes(filterValue) ||
      customer.lastName.toLowerCase().includes(filterValue)
    );
  }

  onSelectionChange(event: any) {
    const selectedCustomer: Customer = event.option.value;
    this.customerSelected.emit(selectedCustomer);
  }
}
