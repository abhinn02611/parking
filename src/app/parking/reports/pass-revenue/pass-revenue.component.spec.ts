import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassRevenueComponent } from './pass-revenue.component';

describe('PassRevenueComponent', () => {
  let component: PassRevenueComponent;
  let fixture: ComponentFixture<PassRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassRevenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
