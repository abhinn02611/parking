import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingChartComponent } from './parking-chart.component';

describe('ParkingChartComponent', () => {
  let component: ParkingChartComponent;
  let fixture: ComponentFixture<ParkingChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
