import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAmountClosedComponent } from './total-amount-closed.component';

describe('TotalAmountClosedComponent', () => {
  let component: TotalAmountClosedComponent;
  let fixture: ComponentFixture<TotalAmountClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalAmountClosedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAmountClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
