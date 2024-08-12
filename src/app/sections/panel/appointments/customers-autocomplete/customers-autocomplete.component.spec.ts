import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersAutocompleteComponent } from './customers-autocomplete.component';

describe('CustomersAutocompleteComponent', () => {
  let component: CustomersAutocompleteComponent;
  let fixture: ComponentFixture<CustomersAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomersAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
