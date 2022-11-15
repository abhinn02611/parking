import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParkingDetailsComponent } from './add-parking-details.component';

describe('AddParkingDetailsComponent', () => {
  let component: AddParkingDetailsComponent;
  let fixture: ComponentFixture<AddParkingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddParkingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParkingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
