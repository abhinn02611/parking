import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingForgotPasswordComponent } from './parking-forgot-password.component';

describe('ParkingForgotPasswordComponent', () => {
  let component: ParkingForgotPasswordComponent;
  let fixture: ComponentFixture<ParkingForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingForgotPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
