import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAmountClosedValueComponent } from './total-amount-closed-value.component';

describe('TotalAmountClosedValueComponent', () => {
  let component: TotalAmountClosedValueComponent;
  let fixture: ComponentFixture<TotalAmountClosedValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalAmountClosedValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAmountClosedValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
