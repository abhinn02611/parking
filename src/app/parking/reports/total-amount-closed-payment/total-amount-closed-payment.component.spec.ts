import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAmountClosedPaymentComponent } from './total-amount-closed-payment.component';

describe('TotalAmountClosedPaymentComponent', () => {
  let component: TotalAmountClosedPaymentComponent;
  let fixture: ComponentFixture<TotalAmountClosedPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalAmountClosedPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAmountClosedPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
